import { useParams, useNavigate  } from "react-router-dom";
import { mockProperties } from "./Listings";
import PropertyCard from "../components/PropertyCard";
import { FiArrowLeft  } from "react-icons/fi";


const AgentListings = () => {
  const { id } = useParams(); 
  const agentId = Number(id);

    const navigate = useNavigate(); // navigation


  // filter properties by agent ID
  const filteredProperties = mockProperties.filter(
    (property) => property.agentId === agentId
  );

    const agentName = filteredProperties[0]?.agentName || "Unknown Agent";


  return (
    <div className="container mx-auto px-4 py-8">

      {/* Go Back button */}
      <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 mb-4 hover:text-black"
            >
              <FiArrowLeft size={20} /> Go Back
            </button>

      <h2 className="text-2xl font-bold mb-6">
        Properties by Agent {agentName}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p className="text-gray-600">No properties listed by this agent.</p>
        )}
      </div>
    </div>
  );
};

export default AgentListings;
