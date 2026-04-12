import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    studentId:   { type: String, required: true },
    amount:      { type: Number, required: true },
    method:      { type: String, default: "Mobile Money" },
    status:      { type: String, enum: ["paid","pending","partial","waived"], default: "paid" },
    date:        { type: String, required: true },
    note:        { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);