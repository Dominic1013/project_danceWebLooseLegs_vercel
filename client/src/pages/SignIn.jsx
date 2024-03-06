import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

//FireBase用戶驗證
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";

export default function SignIn() {
  const apiUrl = import.meta.env.VITE_API_URL;
  //FireBase用戶驗證
  const auth = getAuth(app);

  const [formData, setFormData] = useState({});

  //redux
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // storage change inside inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // send POST to server auth.route.js  /sign up
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch(`${apiUrl}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      // console.log(res);
      const data = await res.json();
      // console.log(data);

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));

      //FireBase用戶驗證
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          //用戶成功登入 Firebase
          console.log(userCredential.user);
        })
        .catch((error) => {
          console.error(error);
        });

      navigate("/");
      // console.log(data);
    } catch (error) {
      dispatch(signInFailure(data.message));
    }
  };
  // console.log(formData);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-subWhite-color text-3xl text-center font-semibold mt-7">
        Sign In
      </h1>
      <p className="text-center mb-7 mt-2 text-sm italic text-subWhite-color">
        For Teacher, Student don't need to signIn !
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg bg-subWhite-color"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg bg-subWhite-color"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-primaryBrown-color text-subWhite-color rounded-lg p-3 uppercase disabled:opacity-80 hover:bg-secondaryBrown-color"
        >
          {loading ? "Loading" : "Sign in"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p className="text-subWhite-color">Dont have an account ?</p>
        <Link to={"/sign-up"}>
          <span className="text-primaryBrown-color hover:text-secondaryBrown-color">
            Sign up
          </span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
