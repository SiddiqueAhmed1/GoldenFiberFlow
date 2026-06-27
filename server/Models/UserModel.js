import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "Active",
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
