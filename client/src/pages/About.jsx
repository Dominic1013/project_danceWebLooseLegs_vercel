import React from "react";

export default function About() {
  return (
    <div className="py-20 px-4 max-w-6xl mx-auto">
      <img
        className="max-w-32 mx-auto mb-16"
        src="/logo/logoWithText.png"
        alt="logoWithText"
      />
      {/* <h1 className="text-3xl font-bold mb-4 text-secondaryBrown-color">
        About LooseLegs
      </h1> */}
      {/* <p className="mb-4 text-subWhite-color">
        Welcome to LooseLegs! This is a place made for everyone who loves street
        dance, whether you teach it or want to learn. Our goal is to make it
        easy for dance to bring us all together.
      </p> */}
      <h1 className="text-3xl font-bold mb-4 text-secondaryBrown-color">
        Welcome to LooseLegs !
      </h1>
      <p className="mb-4 text-subWhite-color">
        This is a place made for everyone who loves street dance, whether you
        teach it or want to learn. Our goal is to make it easy for dance to
        bring us all together.
      </p>
      <p className="mb-4 text-subWhite-color">
        LooseLegs is a spot where teachers can sign up and share info about
        their dance classes. Each class has details like pictures, the name of
        the class, a description, info about the teacher, the type of dance, and
        any special deals.
      </p>
      <p className="mb-4 text-subWhite-color">
        For students, LooseLegs makes finding dance classes and teachers easy.
        You can see everything about a class and talk directly to teachers if
        you have questions. Right now, you can't book classes online here, but
        you can still get all the info you need and contact the teacher easily.
      </p>
      <p className="mb-4 text-subWhite-color">
        Whether you want to share your dance skills or learn some cool moves,
        LooseLegs is the right place for you. We believe our platform can help
        everyone find their place in the street dance world.
      </p>
      <p className="mb-4 text-subWhite-color">
        Join LooseLegs and start your street dance adventure today!
      </p>
    </div>
  );
}
