import React, { useEffect } from "react";
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const apiUrl = import.meta.env.VITE_API_URL;
  // FireBase用戶驗證
  const auth = getAuth();

  const fireBaseUser = auth.currentUser;
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]); // rightnow file upload
  const [formData, setFormData] = useState({
    name: "",
    classTime: "",
    description: "",
    address: "",
    type: "rent",
    attendanceCap: 1,
    regularPrice: 10,
    discountPrice: 0,
    offer: false,
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false); // Form submit error state
  const [loading, setLoading] = useState(false); // Form subit loading sate

  //  we don't need async fn, because inside fn is async: storeImage()

  const handleImageSubmit = (e) => {
    // check files + 原先有的files的length
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      // check file type & size < 2mb
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          setImageUploadError("only image files !");
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          setImageUploadError("Image upload failed (2 mb max per image)");
          return;
        }
      }

      setUploading(true); // button text turn to Uploading
      setImageUploadError(false);
      // we need await many promises, because so many image request
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      // wait all Promise fulfilled
      Promise.all(promises)
        .then((imageObjects) => {
          //imageObjects is array of object
          // console.log(imageObjects);
          const newImageUrls = imageObjects.map((img) => ({
            downloadUrl: img.downloadUrl,
            storagePath: img.storagePath,
          }));
          // console.log(newImageUrls);

          // update formdata
          setFormData((prevFormData) => ({
            ...prevFormData,
            imageUrls: [...prevFormData.imageUrls, ...newImageUrls],
          }));
          // console.log(formData.imageUrls);
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6images per listing");
      setUploading(false);
    }
  };

  // FOR handleIamgeSubmit !! storage Images to firebase with async Promise
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name; // make unique name

      const storageRef = ref(storage, `images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },

        // error handler
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve({
              downloadUrl: downloadURL,
              storagePath: `images/${fileName}`,
            });
          });
        }
      );
    });
  };
  // image Delete button handle
  const handleRemoveImage = async (index) => {
    if (fireBaseUser) {
      //fireBase用戶已經登入
      try {
        //firebase delete
        const imageToDelete = formData.imageUrls[index];

        const storage = getStorage(app);
        const imageRef = ref(storage, imageToDelete.storagePath);

        await deleteObject(imageRef); // 從firebase裡刪除圖片
        console.log("Firebase's Image was deleted！");

        //刪除畫面中的圖片，也就是只顯示沒有此index圖片的array
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
      } catch (error) {
        window.prompt("delete action failed, please Sign in again.");
        console.error("Firebase's delete action is failed:", error.message);
      }
    } else {
      //fireBase用戶未登入
      window.prompt("Your authentication is rejected, please Sign in again.");
      console.log("fireBase's user is not login, can't delete Image");
    }
  };

  const handleChange = (e) => {
    //different types for different if statement
    //1. rent or sale
    if (
      e.target.id === "HOUSE" ||
      e.target.id === "HIPHOP" ||
      e.target.id === "POPPING" ||
      e.target.id === "LOCKING"
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        type: e.target.id,
      }));
    }

    if (e.target.id === "offer") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked, // 去對照現在的checked
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData((pFormData) => ({
        ...pFormData,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("you must be upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);

      const res = await fetch(`${apiUrl}/api/listing/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
          teacherName: currentUser.username,
          teacherStageName: currentUser.stageName
            ? currentUser.stageName
            : currentUser.username,
        }),
        credentials: "include",
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      }
      // console.log(data);
      navigate(`/listing/${data._id}`); // Listing model自動生成的_id, not user id, user id 是在 currentUser._id，就是userRef
      // 這裡是要去listing的頁面，而不是後端api的listings route，仔細想想不要搞混。
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-primaryBrown-color text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="ClassName"
            className="border p-3 rounded-lg bg-subWhite-color"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="ClassTime"
            className="border p-3 rounded-lg bg-subWhite-color"
            id="classTime"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.classTime}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg bg-subWhite-color"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg bg-subWhite-color"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="HOUSE"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "HOUSE"}
              />
              <span className="text-primaryBrown-color font-bold">HOUSE</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="HIPHOP"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "HIPHOP"}
              />
              <span className="text-primaryBrown-color font-bold">HIPHOP</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="POPPING"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "POPPING"}
              />
              <span className="text-primaryBrown-color font-bold">POPPING</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="LOCKING"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "LOCKING"}
              />
              <span className="text-primaryBrown-color font-bold">LOCKING</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span className="text-red-600 font-bold">Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="attendanceCap"
                min="1"
                max="50"
                required
                className="p-3 border border-gray-300 rounded-lg bg-subWhite-color"
                onChange={handleChange}
                value={formData.attendanceCap}
              />
              <p className="text-secondaryBrown-color">attendanceCap</p>
            </div>

            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="2"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg bg-subWhite-color"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p className="text-secondaryBrown-color">Regular price</p>
                <span className="text-xs text-secondaryBrown-color">
                  ($ / per class)
                </span>
              </div>
            </div>
            {formData.offer && (
              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg bg-subWhite-color"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p className="text-secondaryBrown-color">Discounted price</p>
                  <span className="text-xs text-secondaryBrown-color">
                    ($ / per class)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ----------- */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold text-primaryBrown-color">
            Images:
            <span className="font-normal text-secondaryBrown-color ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              className="p-3 border border-gray-300 rounded w-full text-subWhite-color"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-primaryBrown-color border border-primaryBrown-color hover:text-secondaryBrown-color hover:border-secondaryBrown-color rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading" : "Upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url.downloadUrl}
                className="flex justify-between items-center p-3 border"
              >
                <img
                  src={url.downloadUrl}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-600 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-primaryBrown-color text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
