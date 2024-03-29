import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        //找到製作此頁面的使用者是誰，並且拿到它的資訊（重點是mail）
        const res = await fetch(`${apiUrl}/api/user/${listing.userRef}`);

        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-subWhite-color">
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">
              {listing.name.toLowerCase()} :
            </span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-textGray-color text-subWhite-color text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
