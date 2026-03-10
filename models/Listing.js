import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number
  },
  creatorName: {
    type: String
  },
  userId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},{timestamps:true});

export default mongoose.models.Listing ||
  mongoose.model("Listing", ListingSchema);