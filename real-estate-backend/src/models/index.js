const User = require('./User');
const Property = require('./Property');
const Inquiry = require('./Inquiry');

// Define relationships
User.hasMany(Property, { foreignKey: 'agent', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'agent', as: 'agentInfo' });

User.hasMany(Inquiry, { foreignKey: 'user', as: 'inquiries' });
Inquiry.belongsTo(User, { foreignKey: 'user', as: 'userInfo' });

Property.hasMany(Inquiry, { foreignKey: 'property', as: 'propertyInquiries' });
Inquiry.belongsTo(Property, { foreignKey: 'property', as: 'propertyInfo' });

module.exports = {
  User,
  Property,
  Inquiry
};