import mongoose from "mongoose";

const consignmentSchema = mongoose.Schema(
  {
    sender_details: {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      mobile: {
        type: Number,
        required: true,
      },
    },
    receiver_details: {
      name: {
        type: String,
        requred: true,
      },
      address: {
        type: String,
        required: true,
      },
      mobile: {
        type: Number,
        required: true,
      },
    },

    items: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          default: "kg",
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "In transit", "Delivered", "Cancelled"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Consignment", consignmentSchema);
