import React from "react";
import { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { app } from "../firebase";
import { Link } from "react-router-dom";

//import icons
import { FaArrowAltCircleDown } from "react-icons/fa";
import { FaMouse } from "react-icons/fa";

// import redux reducer things
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutStart,
  signOutFailure,
  signOutSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const dispatch = useDispatch();
  // avatar img ref
  const fileRef = useRef();
  // introPic img ref
  const introPicRef = useRef();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // upload file useState
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  // upload introPic
  const [introPic, setIntroPic] = useState(undefined);

  //formData
  const [formData, setFormData] = useState({});

  //showListing & save Listings info
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState(null);

  //checkBox upload & get data--------------------------------
  const [selectedStyles, setSelectedStyles] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setSelectedStyles(currentUser.styles || []);
  }, [currentUser.styles]);

  const handleCheckboxChange = (style) => {
    if (selectedStyles.includes(style)) {
      //如果有，則刪除（取消勾選）
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
      setFormData({
        ...formData,
        styles: selectedStyles.filter((s) => s !== style),
      });
    } else {
      //如果沒有，則增加（勾選）
      setSelectedStyles([...selectedStyles, style]);
      setFormData({ ...formData, styles: [...selectedStyles, style] });
    }
  };

  const isChecked = (style) => {
    return selectedStyles.includes(style);
  };
  // ----------------------------------------------------------

  // console.log(file);
  // console.log(filePerc);
  // console.log(fileUploadError);

  // 處理avatar圖片上傳---------------------------------------
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app); // tell which storage we want store
    const fileName = new Date().getTime() + file.name; // prevent two file upload in same time
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  // ---------------------------------------------------------
  // 處理introPic圖片上傳---------------------------------------
  useEffect(() => {
    if (introPic) {
      handleIntroPicUpload(introPic);
    }
  }, [introPic]);
  const handleIntroPicUpload = (file) => {
    const storage = getStorage(app); // tell which storage we want store
    const fileName = new Date().getTime() + file.name; // prevent two file upload in same time
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, introPic: downloadURL });
        });
      }
    );
  };
  // ---------------------------------------------------------

  // 儲存所有改變、提交資料---------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${apiUrl}/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();

      //回傳資料不成功時。
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        console.log("fail");
        return;
      }

      //傳回來的資料成功
      dispatch(updateUserSuccess(data));
      // console.log("success");
      alert("Update Success");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      console.log(error.message);
      console.log("fail deep");
    }
  };

  // ---------------------------------------------------------

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${apiUrl}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch(`${apiUrl}/api/auth/signout`);

      const data = await res.json();
      // console.log(data);
      if (data.success === false) return dispatch(signOutFailure(data.message));
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(data.message));
    }
  };

  //show Listings button handle
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`${apiUrl}/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data); // save listings info
      // console.log(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`${apiUrl}/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.message); // we can do error state for it
        return;
      }

      //also can use useSWR mutate() to refresh the page
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl md:text-4xl font-semibold text-center my-7 text-primaryBrown-color">
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <section className="flex justify-center items-center gap-4">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover curor-pointer self-center mt-2"
            onClick={() => fileRef.current.click()}
          />
          <input
            onChange={(e) => setIntroPic(e.target.files[0])}
            type="file"
            ref={introPicRef}
            hidden
            accept="image/*"
          />
          <img
            src={formData.introPic || currentUser.introPic}
            alt="introPic"
            className="rounded-xl h-24 w-24 object-cover curor-pointer self-center mt-2"
            onClick={() => introPicRef.current.click()}
          />
        </section>

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload(image must ne less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc} %`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg bg-subWhite-color"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg bg-subWhite-color"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg bg-subWhite-color"
          id="password"
          onChange={handleChange}
        />
        {/* new add */}
        <input
          type="text"
          placeholder="stage name"
          className="border p-3 rounded-lg bg-subWhite-color"
          id="stageName"
          defaultValue={currentUser.stageName ? currentUser.stageName : ""}
          onChange={handleChange}
        />

        <textarea
          placeholder="teacher description"
          className="border p-3 rounded-lg bg-subWhite-color"
          id="teacherDesc"
          defaultValue={currentUser.teacherDesc ? currentUser.teacherDesc : ""}
          onChange={handleChange}
          rows="4" // 可以设置textarea的行数
        ></textarea>

        <section className="my-4">
          <p className="text-subWhite-color text-xl text-center mb-2">Styles</p>
          <div className="flex flex-wrap gap-4">
            {" "}
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="border p-3 rounded-lg"
                id="styles_HOUSE"
                onChange={() => handleCheckboxChange("HOUSE")}
                checked={isChecked("HOUSE")}
              />
              <span className="text-subWhite-color">HOUSE</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="border p-3 rounded-lg"
                id="styles_HIPHOP"
                onChange={() => handleCheckboxChange("HIPHOP")}
                checked={isChecked("HIPHOP")}
              />
              <span className="text-subWhite-color">HIPHOP</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="border p-3 rounded-lg"
                id="styles_POPPING"
                onChange={() => handleCheckboxChange("POPPING")}
                checked={isChecked("POPPING")}
              />
              <span className="text-subWhite-color">POPPING</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="border p-3 rounded-lg"
                id="styles_LOCKING"
                onChange={() => handleCheckboxChange("LOCKING")}
                checked={isChecked("LOCKING")}
              />
              <span className="text-subWhite-color">LOCKING</span>
            </div>
          </div>
        </section>

        <button
          disabled={loading}
          className="bg-primaryBrown-color text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>

        <Link
          className="bg-secondaryBrown-color text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between">
        <span
          onClick={handleDeleteUser}
          className="text-red-500 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-500 cursor-pointer">
          Sign out
        </span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <div className="flex justify-center items-center mb-4">
        <Link
          to={`/teacherInfo/${currentUser._id}`}
          className="text-primaryBrown-color font-semibold bg-subWhite-color w-6/12 rounded-md flex justify-center items-center gap-2"
        >
          <FaMouse />
          Check Information Page
        </Link>
      </div>
      <div className="flex justify-center items-center">
        <button
          onClick={handleShowListings}
          className="text-primaryBrown-color font-semibold bg-subWhite-color w-6/12 rounded-md flex justify-center items-center gap-2"
        >
          <FaArrowAltCircleDown />
          Show Listings
        </button>
      </div>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing Listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-primaryBrown-color text-center my-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing, i) => (
            <div
              key={listing._id}
              className="bg-subWhite-color hover:bg-subWhite-color/90 rounded-lg p-3 flex justify-between items-center gap-4"
            >
              {/* this link navigate to listings id page which's creating by createListing.jsx */}
              <Link to={`/listing/${listing._id}`}>
                <img
                  // src={listing.imageUrls[0][0].downloadUrl}
                  src={listing.imageUrls[0]?.downloadUrl}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-primaryBrown-color font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-500 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
