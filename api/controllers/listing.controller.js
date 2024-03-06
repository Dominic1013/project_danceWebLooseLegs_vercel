import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  //check listing exist
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  //確認當前使用者 === 當初post此篇listing的人
  // Listing的_id是model生成的物件id，我們要比較的是使用者id，而我們先前設定listings使用者id是存在userRef中。
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  // list existed or not
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return new value, not prev value
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// for search all listings
export const getListings = async (req, res, next) => {
  try {
    // get listings & get showmoreLisings handler-------------------------
    // parseInt turn string to Int, Int is number type
    const limit = parseInt(req.query.limit) || 9; // for each 9 listings once // limit可以使用在homePage
    const startIndex = parseInt(req.query.startIndex) || 0; // to get the paginate
    //---------------------------------------------

    // get form data METHOD:GET
    let offer = req.query.offer; // get form data offer
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] }; // mongoose的資料庫內搜索。
    }

    // dance style types
    let type = req.query.type;
    if (type === undefined || type === "all") {
      // type all就是全選全展示
      type = { $in: ["HOUSE", "HIPHOP", "POPPING", "LOCKING"] };
    }

    const searchTerm = req.query.searchTerm || ""; // search name 下面的正規表達式

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" }, // 正規表達式，所選字串, i表示不分大小寫。
      offer,
      type,
    })
      .sort({ [sort]: order }) // 初始是創建時間，默認為降序排序
      .limit(limit)
      .skip(startIndex); // 用來換頁使用。

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
