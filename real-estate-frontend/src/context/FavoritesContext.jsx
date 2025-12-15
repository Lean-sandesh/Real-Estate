import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";


const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  // CLEAR favorites when user logs out
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      localStorage.removeItem("favorites");
    }
  }, [user]);

  // Save to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, user]);


  const addFavorite = (property) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === property.id)) return prev; // avoid duplicates
      return [...prev, property];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  const isFavorite = (id) => {
    return favorites.some((p) => p.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
