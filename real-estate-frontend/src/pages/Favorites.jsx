import { FiHeart } from "react-icons/fi";
import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FiHeart className="text-red-500" /> Favorites
      </h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorite properties yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {favorites.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
              <img src={p.images?.[0] || p.image} className="h-48 w-full object-cover" />

              <div className="p-4">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-blue-600 font-semibold">{p.price}</p>

                <Link to={`/property/${p.id}`} className="text-blue-500 underline text-sm">
                  View Details
                </Link>

                <button
                  onClick={() => removeFavorite(p.id)}
                  className="mt-3 text-sm text-red-500 hover:text-red-600 block"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
