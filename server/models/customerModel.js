import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  accessable: {
    type: Array,
    default: [],
  }
});

const CustomerList = mongoose.models.customers || mongoose.model("Customer", CustomerSchema);

export default CustomerList
