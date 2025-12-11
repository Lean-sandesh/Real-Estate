const crypto = require('crypto');

// Generate random string
const generateRandomString = (length = 10) => {
  return crypto.randomBytes(length).toString('hex');
};

// Format currency (default: INR - Indian Rupee)
const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date with time
const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate pagination
const calculatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    currentPage: page,
    totalPages,
    hasNext,
    hasPrev,
    nextPage: hasNext ? page + 1 : null,
    prevPage: hasPrev ? page - 1 : null
  };
};

// Sanitize object (remove undefined/null fields)
const sanitizeObject = (obj) => {
  const sanitized = { ...obj };
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === undefined || sanitized[key] === null) {
      delete sanitized[key];
    }
  });
  return sanitized;
};

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Real Estate Specific Utilities

// Format property area with unit
const formatArea = (area, unit = 'sqft') => {
  return `${area.toLocaleString('en-IN')} ${unit}`;
};

// Calculate price per square unit
const calculatePricePerUnit = (price, area) => {
  if (!area || area === 0) return 0;
  return (price / area).toFixed(2);
};

// Format price per square unit
const formatPricePerUnit = (price, area, unit = 'sqft') => {
  const pricePerUnit = calculatePricePerUnit(price, area);
  return `${formatCurrency(pricePerUnit)}/${unit}`;
};

// Generate property ID (custom format)
const generatePropertyId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `PROP-${timestamp}-${random}`.toUpperCase();
};

// Calculate distance between coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
};

// Format distance for display
const formatDistance = (distanceInKm) => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)}m`;
  }
  return `${distanceInKm.toFixed(1)}km`;
};

// Calculate EMI (Equated Monthly Installment)
const calculateEMI = (principal, annualRate, years) => {
  const monthlyRate = annualRate / 12 / 100;
  const numberOfPayments = years * 12;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
              (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  return Math.round(emi);
};

// Format phone number (Indian format)
const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned}`;
  }
  return phone;
};

// Validate Indian phone number
const isValidIndianPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned);
};

// Generate OTP
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// Calculate age of property (in years)
const calculatePropertyAge = (yearBuilt) => {
  const currentYear = new Date().getFullYear();
  return currentYear - yearBuilt;
};

// Format property age
const formatPropertyAge = (yearBuilt) => {
  const age = calculatePropertyAge(yearBuilt);
  if (age === 0) return 'New Construction';
  if (age === 1) return '1 year old';
  return `${age} years old`;
};

// Truncate text with ellipsis
const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Convert square feet to square meters and vice versa
const convertArea = (area, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return area;
  
  if (fromUnit === 'sqft' && toUnit === 'sqm') {
    return area * 0.092903;
  }
  if (fromUnit === 'sqm' && toUnit === 'sqft') {
    return area * 10.7639;
  }
  return area;
};

// Generate map URL from coordinates
const generateMapUrl = (lat, lng, label = '') => {
  const encodedLabel = encodeURIComponent(label);
  return `https://maps.google.com/?q=${lat},${lng}&ll=${lat},${lng}&z=17`;
};

// Calculate days until launch (for new launches)
const daysUntilLaunch = (launchDate) => {
  const today = new Date();
  const launch = new Date(launchDate);
  const diffTime = launch - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Format days until launch
const formatDaysUntilLaunch = (launchDate) => {
  const days = daysUntilLaunch(launchDate);
  if (days === 0) return 'Launching Today';
  if (days === 1) return 'Launching Tomorrow';
  if (days <= 7) return `Launching in ${days} days`;
  if (days <= 30) return `Launching in ${Math.ceil(days / 7)} weeks`;
  return `Launching in ${Math.ceil(days / 30)} months`;
};

module.exports = {
  generateRandomString,
  formatCurrency,
  formatDate,
  formatDateTime,
  calculatePagination,
  sanitizeObject,
  isValidEmail,
  generateSlug,
  formatArea,
  calculatePricePerUnit,
  formatPricePerUnit,
  generatePropertyId,
  calculateDistance,
  formatDistance,
  calculateEMI,
  formatPhoneNumber,
  isValidIndianPhone,
  generateOTP,
  calculatePropertyAge,
  formatPropertyAge,
  truncateText,
  convertArea,
  generateMapUrl,
  daysUntilLaunch,
  formatDaysUntilLaunch
};