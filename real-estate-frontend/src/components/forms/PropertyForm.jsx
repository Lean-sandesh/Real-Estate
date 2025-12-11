import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiUpload, FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const PropertyForm = ({ property, onSubmit, loading = false }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: property || {
      title: '',
      description: '',
      price: '',
      propertyType: 'apartment',
      propertyStatus: 'for-sale',
      bedrooms: 1,
      bathrooms: 1,
      area: '',
      yearBuilt: new Date().getFullYear(),
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      },
      features: [],
      amenities: [],
      images: []
    }
  });

  const [imagePreviews, setImagePreviews] = useState(property?.images || []);
  const [newFeature, setNewFeature] = useState('');
  const [amenitiesList] = useState([
    'Swimming Pool', 'Gym', 'Parking', 'Garden', 'Security', 'Elevator',
    'Air Conditioning', 'Heating', 'Balcony', 'Furnished', 'Pet Friendly'
  ]);

  const propertyType = watch('propertyType');
  const propertyStatus = watch('propertyStatus');
  const selectedAmenities = watch('amenities') || [];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imagePreviews.length > 10) {
      toast.error('You can upload a maximum of 10 images');
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload only image files');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim() && !watch('features')?.includes(newFeature.trim())) {
      setValue('features', [...(watch('features') || []), newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove) => {
    setValue('features', watch('features').filter(f => f !== featureToRemove));
  };

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setValue('amenities', selectedAmenities.filter(a => a !== amenity));
    } else {
      setValue('amenities', [...selectedAmenities, amenity]);
    }
  };

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      images: imagePreviews,
      price: Number(data.price),
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      area: Number(data.area),
      yearBuilt: Number(data.yearBuilt)
    };
    
    onSubmit(formData);
  };

  useEffect(() => {
    if (property) {
      // Set form values when editing
      Object.entries(property).forEach(([key, value]) => {
        setValue(key, value);
      });
      if (property.images) {
        setImagePreviews(property.images);
      }
    }
  }, [property, setValue]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
              placeholder="E.g. Beautiful 3 BHK Apartment in Downtown"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property Type *
            </label>
            <select
              {...register('propertyType', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="office">Office</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status *
            </label>
            <select
              {...register('propertyStatus', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price ({propertyStatus === 'for-rent' || propertyStatus === 'rented' ? 'per month' : 'total'}) *
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                className={`w-full pl-7 pr-12 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                placeholder="0.00"
              />
            </div>
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
            placeholder="Describe the property in detail..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Property Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bedrooms *
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setValue('bedrooms', Math.max(1, watch('bedrooms') - 1))}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <FiMinus className="h-4 w-4" />
              </button>
              <input
                type="number"
                {...register('bedrooms', { 
                  required: true,
                  min: { value: 1, message: 'At least 1 bedroom' },
                  valueAsNumber: true
                })}
                className="w-full px-3 py-2 border-t border-b border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-center"
                min="1"
              />
              <button
                type="button"
                onClick={() => setValue('bedrooms', (watch('bedrooms') || 0) + 1)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <FiPlus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bathrooms *
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setValue('bathrooms', Math.max(1, watch('bathrooms') - 1))}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <FiMinus className="h-4 w-4" />
              </button>
              <input
                type="number"
                {...register('bathrooms', { 
                  required: true,
                  min: { value: 1, message: 'At least 1 bathroom' },
                  valueAsNumber: true
                })}
                className="w-full px-3 py-2 border-t border-b border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-center"
                min="1"
              />
              <button
                type="button"
                onClick={() => setValue('bathrooms', (watch('bathrooms') || 0) + 1)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <FiPlus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Area (sq.ft) *
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                {...register('area', { 
                  required: 'Area is required',
                  min: { value: 1, message: 'Area must be positive' },
                  valueAsNumber: true
                })}
                className={`w-full px-3 py-2 border ${errors.area ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                placeholder="0"
                min="1"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">sq.ft</span>
              </div>
            </div>
            {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Year Built
            </label>
            <input
              type="number"
              {...register('yearBuilt', {
                min: { value: 1800, message: 'Year must be after 1800' },
                max: { value: new Date().getFullYear(), message: `Year must be ${new Date().getFullYear()} or earlier` },
                valueAsNumber: true
              })}
              className={`w-full px-3 py-2 border ${errors.yearBuilt ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
              placeholder="Year"
              min="1800"
              max={new Date().getFullYear()}
            />
            {errors.yearBuilt && <p className="mt-1 text-sm text-red-600">{errors.yearBuilt.message}</p>}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Address</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              {...register('address.street', { required: 'Street address is required' })}
              className={`w-full px-3 py-2 border ${errors.address?.street ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
              placeholder="123 Main St"
            />
            {errors.address?.street && <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City *
            </label>
            <input
              type="text"
              {...register('address.city', { required: 'City is required' })}
              className={`w-full px-3 py-2 border ${errors.address?.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
              placeholder="Mumbai"
            />
            {errors.address?.city && <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              State *
            </label>
            <input
              type="text"
              {...register('address.state', { required: 'State is required' })}
              className={`w-full px-3 py-2 border ${errors.address?.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
              placeholder="Maharashtra"
            />
            {errors.address?.state && <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ZIP / Postal Code *
            </label>
            <input
              type="text"
              {...register('address.zipCode', { 
                required: 'ZIP/Postal code is required',
                pattern: {
                  value: /^[1-9][0-9]{5}$/,
                  message: 'Please enter a valid Indian PIN code'
                }
              })}
              className={`w-full px-3 py-2 border ${errors.address?.zipCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
              placeholder="400001"
            />
            {errors.address?.zipCode && <p className="mt-1 text-sm text-red-600">{errors.address.zipCode.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country *
            </label>
            <select
              {...register('address.country', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Features</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Add Features
          </label>
          <div className="flex">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="E.g. Ocean View, Walk-in Closet"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Add
            </button>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            {watch('features')?.map((feature, index) => (
              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                >
                  <span className="sr-only">Remove {feature}</span>
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center">
              <input
                id={`amenity-${amenity}`}
                type="checkbox"
                value={amenity}
                checked={selectedAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Property Images</h3>
        
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <div className="flex text-sm text-gray-600 dark:text-gray-300">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
              >
                <span>Upload images</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to 10MB (max 10 images)
            </p>
          </div>
        </div>

        {imagePreviews.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Selected Images ({imagePreviews.length}/10)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt={`Property ${index + 1}`}
                    className="h-32 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {property ? 'Updating...' : 'Publishing...'}
            </>
          ) : property ? (
            'Update Property'
          ) : (
            'Publish Property'
          )}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
