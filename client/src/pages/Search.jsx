import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",

    offer: false,
    sort: "created_at",
    order: "desc",
  });

  //useEffect fetch loading
  const [loading, setLoading] = useState(false);
  // useEffect get fetch listings data
  const [listings, setListings] = useState([]);

  // showMore button state
  const [showMore, setShowMore] = useState(false);

  //   console.log(error);

  useEffect(() => {
    //先拿到現有的url params
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    // const parkingFromUrl = urlParams.get("parking");
    // const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    // 是否有任何查詢參數存在？有的話更新sidebarData
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setShowMore(false);
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`${apiUrl}/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }

      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    // input 有些是boolean, String
    // input 為 type一組的
    if (
      e.target.id === "all" ||
      e.target.id === "HOUSE" ||
      e.target.id === "HIPHOP" ||
      e.target.id === "POPPING" ||
      e.target.id === "LOCKING"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    //searchTerm
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    // true false一組
    // 返回的有可能是boolean的true false,
    // 也可能是String的 "true" "false"
    // 因為從url改變的話，params拿下來會是String
    if (e.target.id === "offer") {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    //sort
    // 將sort跟order切分成兩半。select上雖然是一起的，但是丟進後端時一個是key一個是value。用split切開。
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  // form submit handle
  const handleSubmit = (e) => {
    e.preventDefault();
    //先得到urlParams實例
    //將sidebarData放進url裡面
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    //將所有結果轉成String，才能放進url裡面。
    const searchQuery = urlParams.toString();

    // navigate user to page which he searching
    navigate(`/search?${searchQuery}`);
  };

  // handle showMore button
  const onShowMoreClick = async () => {
    // in backend, we have limit 9 listings once time, so listings.length max is 9
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    let searchQuery = urlParams.toString();

    //fetch data second time
    let res = await fetch(`${apiUrl}/api/listing/get?${searchQuery}`);
    let data = await res.json();

    // if fetchData.length < 9 , don.t show button again
    if (data.length < 9) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }
    setListings([...listings, ...data]); // all result in listings state
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-subWhite-color border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col items-start gap-2">
            <label className="whitespace-nowrap font-semibold text-primaryBrown-color">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full bg-subWhite-color"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2 flex-wrap items-start">
            <label className="font-semibold text-primaryBrown-color">
              Type:
            </label>

            <div className="flex gap-2 flex-wrap item-start">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="all"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebarData.type === "all"}
                />
                <span className="text-secondaryBrown-color">All Styles</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="HOUSE"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebarData.type === "HOUSE"}
                />
                <span className="text-secondaryBrown-color">HOUSE</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="HIPHOP"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebarData.type === "HIPHOP"}
                />
                <span className="text-secondaryBrown-color">HIPHOP</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="POPPING"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebarData.type === "POPPING"}
                />
                <span className="text-secondaryBrown-color">POPPING</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="LOCKING"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebarData.type === "LOCKING"}
                />
                <span className="text-secondaryBrown-color">LOCKING</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-wrap items-start">
            <label className="font-semibold text-primaryBrown-color">
              Offer:
            </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.offer === true}
              />
              <span className="text-secondaryBrown-color">Offer</span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <label className="font-semibold text-primaryBrown-color">
              Sort:
            </label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3 bg-subWhite-color"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-primaryBrown-color text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1 mt-8 md:mt-0">
        <h1 className="text-3xl font-semibold border-b border-subWhite-color p-3 text-primaryBrown-color mt-5">
          Listing results:
        </h1>

        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">Loading</p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              className="text-green-700 hover:underline p-7 text-center w-full"
              onClick={onShowMoreClick}
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
