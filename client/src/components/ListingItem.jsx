import React from "react";
import { Link } from "react-router-dom";

//import icons
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[250px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0].downloadUrl}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        ></img>
        <div className="p-3">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm font-bold text-allBlack-color line-clamp-2 my-2">
            Teacher{" "}
            <span className="text-base font-bold text-primaryBrown-color">
              {listing.teacherStageName}
            </span>
          </p>

          <p className="text-slate-500 mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("zh-TW") +
                "/ per class ($" +
                (+listing.regularPrice - +listing.discountPrice) +
                " OFF)"
              : listing.regularPrice.toLocaleString("zh-TW") + "/ per class"}
            {/* {"/ per class"} */}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.attendanceCap} person maximum limit
            </div>
            {listing.type === "HIPHOP" ? (
              <div className="text-subWhite-color font-semibold text-xs bg-rose-500 px-2 rounded-sm">
                {listing.type}
              </div>
            ) : listing.type === "HOUSE" ? (
              <div className="text-subWhite-color font-semibold text-xs bg-primaryBrown-color px-2 rounded-sm">
                {" "}
                {listing.type}
              </div>
            ) : listing.type === "POPPING" ? (
              <div className="text-subWhite-color font-semibold text-xs bg-purple-500 px-2 rounded-sm">
                {" "}
                {listing.type}
              </div>
            ) : (
              <div className="text-subWhite-color font-semibold text-xs bg-green-500 px-2 rounded-sm">
                {" "}
                {listing.type}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
