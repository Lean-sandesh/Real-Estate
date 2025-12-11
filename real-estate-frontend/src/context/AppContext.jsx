import { createContext, useContext, useState, useEffect } from 'react';
import propertyService from '../services/propertyService';


const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Load properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getProperties();
        setProperties(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Add a new property
  const addProperty = async (propertyData) => {
    try {
      const newProperty = await propertyService.createProperty(propertyData);
      setProperties([...properties, newProperty]);
      return newProperty;
    } catch (err) {
      setError('Failed to add property');
      throw err;
    }
  };

  // Update a property
  const updateProperty = async (id, updates) => {
    try {
      const updatedProperty = await propertyService.updateProperty(id, updates);
      setProperties(properties.map(prop => 
        prop._id === id ? updatedProperty : prop
      ));
      return updatedProperty;
    } catch (err) {
      setError('Failed to update property');
      throw err;
    }
  };

  // Delete a property
  const deleteProperty = async (id) => {
    try {
      await propertyService.deleteProperty(id);
      setProperties(properties.filter(prop => prop._id !== id));
    } catch (err) {
      setError('Failed to delete property');
      throw err;
    }
  };

  // Login user
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setUser(userData.user);
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        properties,
        loading,
        error,
        user,
        addProperty,
        updateProperty,
        deleteProperty,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
