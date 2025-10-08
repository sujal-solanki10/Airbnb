const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "68cce5b3234eb2f8c1a08709",
      geometry: {
        type: "Point",
        coordinates: [72.5714, 23.0225],
      },
    }));

    await Listing.insertMany(initData.data);
    console.log("yes data Deleted");
  } catch (err) {
    console.log(err);
  }
};

initDB();
