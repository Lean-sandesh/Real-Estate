class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.totalCount = null;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'radius', 'near', 'q', 'text'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering with operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|nin|eq|ne|regex|options)\b/g, match => `$${match}`);

    // Handle price range separately
    if (this.queryString.minPrice || this.queryString.maxPrice) {
      const priceFilter = {};
      if (this.queryString.minPrice) priceFilter.$gte = parseInt(this.queryString.minPrice);
      if (this.queryString.maxPrice) priceFilter.$lte = parseInt(this.queryString.maxPrice);
      this.query = this.query.find({ price: priceFilter });
    } else {
      const parsedQuery = JSON.parse(queryStr);
      if (Object.keys(parsedQuery).length > 0) {
        this.query = this.query.find(parsedQuery);
      }
    }

    return this;
  }

  search() {
    if (this.queryString.search || this.queryString.q) {
      const searchTerm = this.queryString.search || this.queryString.q;
      const searchRegex = new RegExp(searchTerm, 'i');
      
      this.query = this.query.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { 'location.address': searchRegex },
          { 'location.city': searchRegex },
          { 'location.state': searchRegex },
          { 'projectDetails.projectName': searchRegex },
          { 'projectDetails.developer': searchRegex },
          { amenities: searchRegex },
          { tags: searchRegex }
        ]
      });
    }

    // MongoDB text search if enabled
    if (this.queryString.text) {
      this.query = this.query.find({
        $text: { $search: this.queryString.text }
      });
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default sorting based on context
      const defaultSort = this.queryString.search || this.queryString.q 
        ? { score: { $meta: 'textScore' } } 
        : '-createdAt';
      this.query = this.query.sort(defaultSort);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    
    this.pagination = {
      page,
      limit,
      skip
    };

    return this;
  }

  // Real Estate Specific Filters

  filterByLocation() {
    if (this.queryString.near && this.queryString.radius) {
      const { near, radius } = this.queryString;
      const [lat, lng] = near.split(',').map(coord => parseFloat(coord.trim()));
      const radiusKm = parseFloat(radius);

      if (lat && lng && radiusKm) {
        this.query = this.query.find({
          'location.coordinates': {
            $geoWithin: {
              $centerSphere: [[lng, lat], radiusKm / 6378.1] // Convert km to radians
            }
          }
        });
      }
    }

    // Filter by city, state, or zip code
    if (this.queryString.city) {
      this.query = this.query.find({
        'location.city': new RegExp(this.queryString.city, 'i')
      });
    }

    if (this.queryString.state) {
      this.query = this.query.find({
        'location.state': new RegExp(this.queryString.state, 'i')
      });
    }

    if (this.queryString.zipCode) {
      this.query = this.query.find({
        'location.zipCode': this.queryString.zipCode
      });
    }

    return this;
  }

  filterByTypeAndStatus() {
    const filters = {};
    
    if (this.queryString.type) {
      filters.type = this.queryString.type;
    }
    
    if (this.queryString.category) {
      filters.category = this.queryString.category;
    }
    
    if (this.queryString.status) {
      filters.status = this.queryString.status;
    } else if (!this.queryString.agent) {
      // Default to approved properties for public access
      filters.status = 'approved';
      filters.isActive = true;
      filters.expiresAt = { $gt: new Date() };
    }

    if (Object.keys(filters).length > 0) {
      this.query = this.query.find(filters);
    }

    return this;
  }

  filterBySpecifications() {
    const specFilters = {};
    
    // Bedrooms filter with range support
    if (this.queryString.bedrooms) {
      if (this.queryString.bedrooms.includes('-')) {
        const [min, max] = this.queryString.bedrooms.split('-').map(Number);
        specFilters['specifications.bedrooms'] = { $gte: min };
        if (max) specFilters['specifications.bedrooms'].$lte = max;
      } else {
        specFilters['specifications.bedrooms'] = parseInt(this.queryString.bedrooms);
      }
    }
    
    // Bathrooms filter with range support
    if (this.queryString.bathrooms) {
      if (this.queryString.bathrooms.includes('-')) {
        const [min, max] = this.queryString.bathrooms.split('-').map(Number);
        specFilters['specifications.bathrooms'] = { $gte: min };
        if (max) specFilters['specifications.bathrooms'].$lte = max;
      } else {
        specFilters['specifications.bathrooms'] = parseFloat(this.queryString.bathrooms);
      }
    }
    
    // Area range filter
    const areaFilter = {};
    if (this.queryString.minArea) areaFilter.$gte = parseInt(this.queryString.minArea);
    if (this.queryString.maxArea) areaFilter.$lte = parseInt(this.queryString.maxArea);
    if (Object.keys(areaFilter).length > 0) {
      specFilters['specifications.area'] = areaFilter;
    }

    // Year built filter
    if (this.queryString.minYear) {
      specFilters['specifications.yearBuilt'] = { 
        $gte: parseInt(this.queryString.minYear) 
      };
    }

    if (this.queryString.maxYear) {
      specFilters['specifications.yearBuilt'] = { 
        ...specFilters['specifications.yearBuilt'],
        $lte: parseInt(this.queryString.maxYear)
      };
    }

    if (Object.keys(specFilters).length > 0) {
      this.query = this.query.find(specFilters);
    }

    return this;
  }

  filterByAmenities() {
    if (this.queryString.amenities) {
      const amenities = Array.isArray(this.queryString.amenities) 
        ? this.queryString.amenities 
        : this.queryString.amenities.split(',');
      
      this.query = this.query.find({
        amenities: { $in: amenities.map(a => new RegExp(a, 'i')) }
      });
    }
    return this;
  }

  filterByPriceRange() {
    const priceFilter = {};
    
    if (this.queryString.minPrice) priceFilter.$gte = parseInt(this.queryString.minPrice);
    if (this.queryString.maxPrice) priceFilter.$lte = parseInt(this.queryString.maxPrice);
    
    if (Object.keys(priceFilter).length > 0) {
      this.query = this.query.find({ price: priceFilter });
    }

    return this;
  }

  filterByAgent() {
    if (this.queryString.agent) {
      this.query = this.query.find({ agent: this.queryString.agent });
    }
    return this;
  }

  filterByFeatured() {
    if (this.queryString.featured === 'true') {
      this.query = this.query.find({ isFeatured: true });
    }
    return this;
  }

  filterByProjectPhase() {
    if (this.queryString.projectPhase) {
      this.query = this.query.find({
        'projectDetails.projectPhase': this.queryString.projectPhase
      });
    }
    return this;
  }

  // Get total count for pagination
  async getTotalCount() {
    if (this.totalCount === null) {
      // Create a copy of the query without pagination for counting
      const countQuery = this.query.model.find(this.query._conditions);
      
      // Apply all the same filters except pagination
      if (this.query._fields) {
        countQuery.select(this.query._fields);
      }
      if (this.query._sort) {
        countQuery.sort(this.query._sort);
      }

      this.totalCount = await countQuery.countDocuments();
    }
    return this.totalCount;
  }

  // Get pagination info
  async getPaginationInfo() {
    const total = await this.getTotalCount();
    const page = this.pagination?.page || 1;
    const limit = this.pagination?.limit || 10;
    
    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };
  }

  // Execute all common filters for real estate
  async execute() {
    return this
      .filter()
      .search()
      .filterByLocation()
      .filterByTypeAndStatus()
      .filterBySpecifications()
      .filterByAmenities()
      .filterByPriceRange()
      .filterByAgent()
      .filterByFeatured()
      .filterByProjectPhase()
      .sort()
      .limitFields()
      .paginate();
  }

  // Quick search method for common use cases
  static async quickSearch(model, queryString, baseFilter = {}) {
    const features = new APIFeatures(model.find(baseFilter), queryString);
    await features.execute();
    
    const [data, total] = await Promise.all([
      features.query,
      features.getTotalCount()
    ]);

    const pagination = await features.getPaginationInfo();

    return {
      data,
      pagination,
      total
    };
  }
}

module.exports = APIFeatures;