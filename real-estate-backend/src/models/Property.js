const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  type: {
    type: String,
    enum: ['sale', 'rent', 'pre-launch'],
    required: [true, 'Property type is required']
  },
  
  category: {
    type: String,
    enum: ['residential', 'commercial', 'land', 'industrial', 'project', 'new-launch'],
    required: [true, 'Property category is required']
  },
  
  price: {
    type: Number,
    required: function() {
      return this.category !== 'project';
    },
    min: [0, 'Price cannot be negative']
  },
  
  projectDetails: {
    projectName: {
      type: String,
      required: function() {
        return this.category === 'project' || this.category === 'new-launch';
      }
    },
    developer: {
      type: String,
      required: function() {
        return this.category === 'project' || this.category === 'new-launch';
      }
    },
    totalUnits: {
      type: Number,
      min: [0, 'Total units cannot be negative']
    },
    unitsAvailable: {
      type: Number,
      min: [0, 'Available units cannot be negative']
    },
    launchDate: {
      type: Date,
      required: function() {
        return this.category === 'new-launch';
      }
    },
    possessionDate: {
      type: Date
    },
    projectPhase: {
      type: String,
      enum: ['planning', 'under-construction', 'completed', 'possession'],
      default: 'planning'
    },
    reraNumber: {
      type: String,
      trim: true
    },
    projectAmenities: [{
      type: String,
      trim: true
    }]
  },
  
  priceRange: {
    minPrice: {
      type: Number,
      min: [0, 'Minimum price cannot be negative']
    },
    maxPrice: {
      type: Number,
      min: [0, 'Maximum price cannot be negative']
    },
    pricePerUnit: {
      type: String,
      enum: ['sqft', 'sqm', 'acre', 'hectare']
    }
  },
  
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  specifications: {
    bedrooms: {
      type: Number,
      required: function() {
        return this.category !== 'project';
      },
      min: [0, 'Bedrooms cannot be negative']
    },
    bathrooms: {
      type: Number,
      required: function() {
        return this.category !== 'project';
      },
      min: [0, 'Bathrooms cannot be negative']
    },
    area: {
      type: Number,
      required: function() {
        return this.category !== 'project';
      },
      min: [0, 'Area cannot be negative']
    },
    areaUnit: {
      type: String,
      enum: ['sqft', 'sqm'],
      default: 'sqft'
    },
    yearBuilt: {
      type: Number,
      min: [1500, 'Year built seems too early']
    },
    floors: {
      type: Number,
      min: [0, 'Floors cannot be negative'],
      default: 1
    },
    parking: {
      type: Number,
      min: [0, 'Parking spaces cannot be negative'],
      default: 0
    }
  },
  
  amenities: [{
    type: String,
    trim: true
  }],
  
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    caption: String,
    imageType: {
      type: String,
      enum: ['exterior', 'interior', 'floor-plan', 'site-plan', 'amenity', 'rendering'],
      default: 'exterior'
    }
  }],
  
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'sold', 'rented', 'expired', 'under-construction', 'completed'],
    default: 'draft'
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  likes: {
    type: Number,
    default: 0
  },
  
  expiresAt: {
    type: Date,
    default: function() {
      const date = new Date();
      if (this.category === 'project' || this.category === 'new-launch') {
        date.setFullYear(date.getFullYear() + 1);
      } else {
        date.setDate(date.getDate() + 30);
      }
      return date;
    }
  },
  
  contactInfo: {
    phone: String,
    email: String,
    showContact: {
      type: Boolean,
      default: true
    }
  },

  brochure: {
    url: String,
    public_id: String
  },

  virtualTour: {
    url: String,
    type: {
      type: String,
      enum: ['video', '3d-tour', 'virtual-reality']
    }
  },

  tags: [{
    type: String,
    trim: true
  }],

  // Add favorites and reviews references
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Favorite'
  }],
  
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  
  inquiries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inquiry'
  }]

}, {
  timestamps: true
});

propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ status: 1, isActive: 1 });
propertySchema.index({ type: 1, status: 1 });
propertySchema.index({ category: 1, status: 1 });
propertySchema.index({ agent: 1, createdAt: -1 });
propertySchema.index({ price: 1, status: 1 });
propertySchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Property', propertySchema);