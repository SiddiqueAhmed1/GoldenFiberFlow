import mongoose from "mongoose";
import ConsignmentModel from "./ConsignmentModel.js";

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

// userSchema.pre("findOneAndDelete", async function (next) {
//   const userId = this.getQuery()["_id"];
//   await ConsignmentModel.deleteMany({ createdBy: userId });
//   next();
// });

export default mongoose.model("User", userSchema);
