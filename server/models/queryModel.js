import mongoose from "mongoose";

const IPSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  姓名: {
    type: String,
    required: true,
  },
  MAC: {
    type: String,
    required: true,
    uppercase: true,
  },
  IP: {
    type: String,
    required: true,
  },
  办公室: {
    type: String,
    default: null
  },
  备注: {
    type: String,
    default: null
  },
  picNames: {
    type: Array,
    default: null,
  },
  updatedAt: {
    type: String,
  }
});

const PrinterSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  品牌: {
    type: String,
    required: true,
  },
  硒鼓型号: {
    type: String,
    required: true,
    uppercase: true,
  },
  颜色: {
    type: String,
    required: true,
    default: '黑色'
  },
  数量:{
    type: Number,
    min: 0,
    default: 0
  },
  打印机型号: {
    type: String,
    uppercase: true,
    required: true,
  },
  办公室: {
    type: String,
    default: null
  },
  picNames: {
    type: Array,
    default: null,
  },
  updatedAt: {
    type: String,
  }
});

const PhoneSchema = new mongoose.Schema({
  序号: {
    type: Number,
    required: true,
  },
  号码: {
    type: String,
    required: true,
  },
  面板号: {
    type: String,
  },
  楼层线路: {
    type: String,
    uppercase: true,
  },
  颜色对: {
    type: String,
  },
  办公室:{
    type: String,
    required: true,
  },
  customer: {
    type: String,
    required: true,
  },
  picNames: {
    type: Array,
    default: null,
  },
  updatedAt: {
    type: String,
  }
});

const DatacenterSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  名称: {
    type: String,
    required: true,
  },
  IP: {
    type: String,
    required: true,
  },
  用户名: {
    type: String,
    required: true,
  },
  密码: {
    type: String,
  },
  备注:{
    type: String,
  },
  picNames: {
    type: Array,
    default: null,
  },
  updatedAt: {
    type: String,
  }
});
const SurveillanceSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  类型: {
    type: String,
    required: true,
  },
  IP: {
    type: String,
    required: true,
  },
  用户名: {
    type: String,
    required: true,
  },
  密码: {
    type: String,
    required: true,
  },
  备注:{
    type: String,
    default: null
  },
  picNames: {
    type: Array,
    default: null,
  },
  updatedAt: {
    type: String,
  }
});



const IP = mongoose.models.ipmacs || mongoose.model("Ipmac", IPSchema);
const Printer = mongoose.models.printer || mongoose.model("Printer", PrinterSchema);
const Phone = mongoose.models.phone || mongoose.model("Phone", PhoneSchema);
const Datacenter = mongoose.models.datacenter || mongoose.model("DataCenter", DatacenterSchema);
const Surveillance = mongoose.models.surveillance || mongoose.model("Surveillance", SurveillanceSchema);
// const CustomerList = mongoose.models.customers || mongoose.model("Customer", CustomerSchema);


export {
  IP,
  Printer,
  Phone,
  Datacenter,
  Surveillance,
  // CustomerList
}