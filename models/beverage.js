import mongoose from "mongoose";
// orders 
const beverageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  Beverages: [
    {
      name: String,
      price: Number,
    },
  ],
},{timestamps:true});

export default mongoose.model("Order", beverageSchema);
