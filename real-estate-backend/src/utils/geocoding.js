const axios = require('axios');
const config = require('../config/environment');

// Geocode address using Google Maps API
const geocodeAddress = async (address) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: config.googleMaps.apiKey
      }
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      const location = result.geometry.location;
      
      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id
      };
    } else {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error('Unable to geocode address');
  }
};

// Get distance between two coordinates (in kilometers)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

// Find properties within radius
const findPropertiesWithinRadius = async (centerLat, centerLon, radiusKm, properties) => {
  return properties.filter(property => {
    if (!property.location.coordinates || !property.location.coordinates.lat) {
      return false;
    }
    
    const distance = calculateDistance(
      centerLat,
      centerLon,
      property.location.coordinates.lat,
      property.location.coordinates.lng
    );
    
    return distance <= radiusKm;
  });
};

// Get address components from geocoding result
const parseAddressComponents = (addressComponents) => {
  const components = {};
  
  addressComponents.forEach(component => {
    if (component.types.includes('street_number')) {
      components.streetNumber = component.long_name;
    } else if (component.types.includes('route')) {
      components.street = component.long_name;
    } else if (component.types.includes('locality')) {
      components.city = component.long_name;
    } else if (component.types.includes('administrative_area_level_1')) {
      components.state = component.short_name;
    } else if (component.types.includes('postal_code')) {
      components.zipCode = component.long_name;
    } else if (component.types.includes('country')) {
      components.country = component.long_name;
    }
  });
  
  return components;
};

module.exports = {
  geocodeAddress,
  calculateDistance,
  findPropertiesWithinRadius,
  parseAddressComponents
};