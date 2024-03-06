import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

//redux
import { useSelector } from "react-redux";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

//import icons
import { FaMapMarkerAlt, FaShare } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import Contact from "../components/Contact";

export default function Listing() {
  //swiper
  SwiperCore.use([Navigation]);

  const [listing, setListing] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const params = useParams(); // get path variable: listingId

  const [copied, setCopied] = useState(false);
  // contact state component
  const [contact, setContact] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    console.log(contact);
  }, [contact]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        // console.log(params);
        const res = await fetch(`/api/listing/get/${params.listingId}`); // get req doesn't need to write method or body.
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong</p>
      )}

      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url.downloadUrl}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url.downloadUrl}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* copy alert */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-subWhite-color cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href); // clip path to clipboard
                setCopied(true);
                setTimeout(() => {
                  // copied turn to false
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-subWhite-color p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold text-subWhite-color">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("zh-TW")
                : listing.regularPrice.toLocaleString("zh-TW")}
            </p>
            <p className="flex items-center mt-6 gap-2 text-secondaryBrown-color  text-sm">
              <FaMapMarkerAlt className="text-primaryBrown-color" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="font-semibold  w-full max-w-[200px] border-2 border-primaryBrown-color text-subWhite-color text-center p-1 rounded-md">
                {/* // for type of styles */}
                {listing.type === "HOUSE"
                  ? "HOUSE Class"
                  : "HIPHOP"
                  ? "HIPHOP Class"
                  : "POPPING"
                  ? "POPPING Class"
                  : "LOCKING"
                  ? "LOCKING Class"
                  : "FREESTYLE"}
              </p>
              {listing.offer && (
                <p className="border-2 border-red-700 w-full max-w-[200px] text-subWhite-color text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <Link to={`/teacherInfo/${listing.userRef}`}>
              <p className="font-bold bg-secondaryBrown-color  hover:bg-primaryBrown-color hover:cursor-pointer transition-all w-full max-w-[200px] text-primaryBrown-color hover:text-subWhite-color text-center p-1 rounded-md">
                {/* // teacher's nickname */}
                <span className="font-semibold text-sm pr-2">Teacher</span>
                {listing.teacherStageName
                  ? listing.teacherStageName
                  : listing.teacherName}
              </p>
            </Link>
            <p className="text-subWhite-color mb-4 mt-4">
              <p className="font-semibold text-primaryBrown-color">
                Description -{" "}
              </p>
              {listing.description}
            </p>
            <ul className="text-primaryBrown-color font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaPeopleGroup className="text-lg" />
                {listing.attendanceCap
                  ? `${listing.attendanceCap} Maximum class size `
                  : ""}
              </li>
            </ul>

            {listing.userRef !== currentUser?._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-textGray-color text-subWhite-color rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
