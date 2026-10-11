import { useParams } from "react-router-dom";

const PropertyDetails = () => {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-bold text-teal-brand">Property Details</h1>
      <p className="mt-3 text-charcoal/70">Property ID: {id}</p>
    </div>
  );
};

export default PropertyDetails;