
import { useParams } from "react-router-dom";

const ClientGymDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gym Details</h1>
      <p>This page is under construction. Details for gym ID: {id} will be available soon.</p>
    </div>
  );
};

export default ClientGymDetail;
