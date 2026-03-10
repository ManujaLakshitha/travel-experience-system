import mongoose from "mongoose";
import User from "./User";

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
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  creatorName: { 
    type: String 
  }
}, { 
  timestamps: true
});

export default mongoose.models.Listing || mongoose.model("Listing", ListingSchema);