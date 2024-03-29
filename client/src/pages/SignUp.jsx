import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

//FireBase用戶驗證
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";

export default function SignUp() {
  const apiUrl = import.meta.env.VITE_API_URL;
  //FireBase用戶驗證
  const auth = getAuth(app);

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);

      //FireBase用戶驗證
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
        .then((userCredential) => {
          console.log(userCredential.user);
        })
        .catch((error) => {
          console.error(error);
        });

      navigate("/sign-in");
      // console.log(data);
    } catch (error) {
      setLoading(false);
      setError(data.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-subWhite-color text-3xl text-center font-semibold mt-7">
        Sign In
      </h1>
      <p className="text-center mb-7 mt-2 text-sm italic text-subWhite-color">
        For Teacher, Student don't need to signUp !
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="bg-subWhite-color border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="bg-subWhite-color border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="bg-subWhite-color border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-primaryBrown-color text-subWhite-color rounded-lg p-3 uppercase disabled:opacity-80 hover:bg-secondaryBrown-color"
        >
          {loading ? "Loading" : "Sign up"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p className="text-subWhite-color">Have an account ?</p>
        <Link to={"/sign-in"}>
          <span className="text-primaryBrown-color hover:text-secondaryBrown-color">
            Sign In
          </span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
