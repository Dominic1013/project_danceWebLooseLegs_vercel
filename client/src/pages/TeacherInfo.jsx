import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function TeacherInfo() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const params = useParams();
  const [teacherData, setTeacherData] = useState({});
  const [teacherLists, setTeacherLists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // get dynamic teacher's lists from different teacher
    const getTeacherLists = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/api/user/listings/${params.teacherId}`
        );
        const data = await res.json();
        // console.log(data);

        setTeacherLists(data);
      } catch (error) {
        console.log(error);
      }
    };

    // console.log(params.teacherId);
    // get dynamic teacher's data from different teacher
    const getTeacherData = async () => {
      try {
        setLoading(true);
        // console.log("start! loading be true!");
        const res = await fetch(`${apiUrl}/api/user/${params.teacherId}`);
        const data = await res.json();
        setTeacherData(data);
        setLoading(false);
        // console.log("success! loading be false!");
        // console.log(data);
      } catch (error) {
        // console.log(error.message);
        setLoading(false);
        // console.log("fail! loading be false!");
      }
    };
    getTeacherData();

    getTeacherLists();
  }, [params.teacherId]);

  return (
    <div className="flex flex-col my-10 mx-4 lg:mx-10 gap-12 justify-center items-center">
      <section className="flex flex-col md:flex-row justify-center items-center border-2 border-subWhite-color gap-10 p-4 md:gap-4 md:p-0 rounded-lg">
        <div className="flex-1 text-subWhite-color text-center">
          {loading ? (
            "Loading Image..."
          ) : (
            <img
              src={teacherData?.introPic}
              alt="introPic"
              className="rounded-lg"
            />
          )}
        </div>
        <div className="flex-1 flex flex-col justify-around items-center md:p-4">
          <h1 className="text-5xl font-semiBold text-center text-primaryBrown-color mb-4">
            {teacherData.stageName}
          </h1>
          <p className="text-subWhite-color text-center mb-10">
            {teacherData.email}
          </p>
          <p className="text-subWhite-color text-center mb-10">
            {teacherData.teacherDesc}
          </p>

          {/* dance styles tags */}
          <div className="flex flex-wrap gap-4 w-full justify-center items-center">
            {teacherData?.styles?.map((styleTag, i) => (
              <p
                key={i}
                className="font-semibold border-4 border-primaryBrown-color w-48 text-subWhite-color text-center p-2 rounded-md"
              >
                {styleTag}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-center items-center gap-10 ">
        <h2 className="text-5xl font-semiBold text-center text-secondaryBrown-color">
          {teacherData.stageName}'s Class
        </h2>
        <div className="flex flex-wrap gap-4 justify-center p-4">
          {teacherLists.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
