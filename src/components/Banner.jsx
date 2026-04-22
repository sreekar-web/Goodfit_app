import { useNavigate } from "react-router-dom";

export default function Banner({ image, link }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(link)}
      className="cursor-pointer mt-6"
    >
      <img
        src={image}
        className="w-full h-auto rounded-2xl object-cover"
      />
    </div>
  );
}