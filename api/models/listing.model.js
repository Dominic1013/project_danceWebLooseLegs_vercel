import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    classTime: {
      type: "String",
      required: true,
    },
    description: {
      type: "String",
      required: true,
    },
    address: {
      type: "String",
      required: true,
    },
    attendanceCap: {
      type: "Number",
      required: true,
    },
    type: {
      type: "String",
      required: true,
    },
    regularPrice: {
      type: "Number",
      required: true,
    },
    discountPrice: {
      type: "Number",
      required: true,
    },
    offer: {
      type: "Boolean",
      required: true,
    },

    // imageUrls: {
    //   type: "Array",
    //   required: true,
    // },
    imageUrls: [
      {
        downloadUrl: {
          type: "String",
        },
        storagePath: {
          type: "String",
        },
      },
    ],
    userRef: {
      type: "String",
      required: true,
    },
    teacherName: {
      type: "String",
      required: true,
    },
    teacherStageName: {
      type: "String",
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
