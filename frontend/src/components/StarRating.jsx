import { useState } from "react";
import API from "../api/axios";

const labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

function StarRating({ storeId, defaultRating = 0 }) {
  const [rating, setRating] = useState(defaultRating);
  const [hover, setHover] = useState(0);

const submitRating = async (value) => {
  const token = localStorage.getItem("token"); // <-- get token here
  if (!token) {
    alert("You must be logged in to rate");
    return;
  }

  try {
    await API.post(
      "/user/rate",
      {
        store_id: storeId,
        rating: value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Rating saved ⭐");
  } catch (err) {
    console.error(err);
    alert("Failed to save rating ❌");
  }
};


  return (
    <div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => {
              setRating(star);
              submitRating(star);
            }}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="text-3xl"
          >
            <span
              className={
                (hover || rating) >= star
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>

      {rating > 0 && (
        <p className="text-sm mt-1 text-gray-600">
          {labels[rating - 1]}
        </p>
      )}
    </div>
  );
}

export default StarRating;
