import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // 為了要同步input內跟url內一樣的searchTerm結果。使用useEffect重新渲染。
  //因為我們在onChange內做的改變雖然會更新state，但是在url做的改變並不會更新input格子內的內容，所以我們必須使用useEffect觀察location.search是否有轉變，進而渲染。
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // handle search form
  const handleSubmit = (e) => {
    e.preventDefault(); // dont refresh the page
    const urlParams = new URLSearchParams(window.location.search); // 創建一個urlParams實體
    urlParams.set("searchTerm", searchTerm); // 將searchTerm的地方換成我們的資料
    const searchQuery = urlParams.toString(); // 裡面有些是數字或字串，全部轉作字串處理。
    navigate(`/search?${searchQuery}`); // 將user導向搜尋後的頁面。
  };

  return (
    <header className="bg-bgBlack-color shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/" className="flex justify-center items-center gap-1">
          <img className="size-8" src="/logo/logoBrown.png" alt="logoBrown" />
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-primaryBrown-color font-bold">Loose</span>
            <span className="text-secondaryBrown-color font-bold">Legs</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-subWhite-color focus:outline-none w-24 sm:w-64 "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 justify-center items-center">
          <Link to="/">
            <li className="hidden sm:inline text-subWhite-color hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-subWhite-color hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile" className="rounded-2xl overflow-hidden">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover bg-subWhite-color "
                src={currentUser.avatar}
              />
            ) : (
              <li className="sm:inline text-primaryBrown-color hover:underline">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
