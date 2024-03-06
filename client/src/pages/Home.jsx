import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [HOUSEListings, setHOUSEListings] = useState([]);
  const [HIPHOPListings, setHIPHOPListings] = useState([]);
  const [POPPINGListings, setPOPPINGListings] = useState([]);
  const [LOCKINGListings, setLOCKINGListings] = useState([]);

  //swiper
  SwiperCore.use([Navigation]);

  // useEffect(() => {
  //   console.log(offerListings);
  // }, [offerListings]);

  useEffect(() => {
    // function offerListing
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`); //  give me 4 offer listings
        const data = await res.json();
        setOfferListings(data);
        fetchHOUSEListings(); // we put here bc we wnat fetch step by step (offer => HOUSE => HIPHOP)
      } catch (error) {
        console.log(error);
      }
    };
    // function HOUSEListings
    const fetchHOUSEListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=HOUSE&limit=4`); //  give me 4 offer listings
        const data = await res.json();
        setHOUSEListings(data);
        fetchHIPHOPListings();
      } catch (error) {
        console.log(error);
      }
    };

    // function HIPHOPListings
    const fetchHIPHOPListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=HIPHOP&limit=4`); //  give me 4 offer listings
        const data = await res.json();
        setHIPHOPListings(data);
        fetchPOPPINGListings();
      } catch (error) {
        console.log(error);
      }
    };
    // function HIPHOPListings
    const fetchPOPPINGListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=POPPING&limit=4`); //  give me 4 offer listings
        const data = await res.json();
        setPOPPINGListings(data);
        fetchLOCKINGListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchLOCKINGListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=LOCKING&limit=4`); //  give me 4 offer listings
        const data = await res.json();
        setLOCKINGListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings(); // get offerListings
  }, []);

  return (
    <div>
      {/* top */}

      <section className="relative overflow-hidden rounded-xl p-28 px-3 max-w-6xl mx-auto md:my-20 ">
        <div className="relative z-10 flex flex-col gap-6  mx-auto mb-4 md:mb-0 ">
          {/* <h1 className="text-primaryBrown-color font-bold text-3xl lg:text-6xl">
            Get your next
            <span className="text-secondaryBrown-color"> perfect</span>
            <br />
            dance course with ease
          </h1> */}
          <h1 className="text-primaryBrown-color font-bold text-3xl lg:text-6xl">
            Feel the Beat,
            <span className="text-secondaryBrown-color"> Find </span>
            <br />
            Your Feet with Us
          </h1>
          <div className="text-subWhite-color text-xs sm:text-sm">
            LooseLegs is the best website for finding dance classes.
            <br />
            We have wide range of great courses for you to choose from.
          </div>
          <Link
            to={"/search"}
            className="flex justify-center items-center w-20 h-8 rounded-md text-sm sm:text-base bg-primaryBrown-color text-subWhite-color font-bold hover:bg-secondaryBrown-color hover:underline"
          >
            <p>Start</p>
          </Link>
        </div>
        <video
          className="md:absolute top-0 left-0 right-0 bottom-0 z-0 rounded-xl filter brightness-50 pointer-events-none"
          src="/homeImg/home_danceVideo.mp4"
          type="video/mp4"
          muted
          autoPlay
          loop
          controls={false}
          playsInline
        ></video>
      </section>
      {/* swiper */}
      {/* put latest offer listings in this swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0].downloadUrl}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, dance styles */}
      {/* ------------------------------------------- */}
      {/* offer */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-3xl font-semibold text-subWhite-color">
                Recent offers
              </h2>
              <Link
                className="text-base text-secondaryBrown-color hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------- */}
        {/* house */}
        {HOUSEListings && HOUSEListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-3xl font-semibold text-subWhite-color">
                Recent HOUSE classes
              </h2>
              <Link
                className="text-base text-secondaryBrown-color hover:underline"
                to={"/search?type=HOUSE"}
              >
                Show more HOUSE classes
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {HOUSEListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------- */}
        {/* hiphop */}
        {HIPHOPListings && HIPHOPListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-3xl font-semibold text-subWhite-color">
                Recent HIPHOP classes
              </h2>
              <Link
                className="text-base text-secondaryBrown-color hover:underline"
                to={"/search?type=HIPHOP"}
              >
                Show more HIPHOP classes
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {HIPHOPListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------- */}
        {/* popping */}
        {POPPINGListings && POPPINGListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-3xl font-semibold text-subWhite-color">
                Recent POPPING classes
              </h2>
              <Link
                className="text-base text-secondaryBrown-color hover:underline"
                to={"/search?type=POPPING"}
              >
                Show more POPPING classes
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {POPPINGListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {/* ------------------------------------------- */}
        {/* locking */}
        {LOCKINGListings && LOCKINGListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-3xl font-semibold text-subWhite-color">
                Recent LOCKING classes
              </h2>
              <Link
                className="text-base text-secondaryBrown-color hover:underline"
                to={"/search?type=LOCKING"}
              >
                Show more LOCKING classes
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {LOCKINGListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {/* ------------------------------------------- */}
      </div>
    </div>
  );
}
