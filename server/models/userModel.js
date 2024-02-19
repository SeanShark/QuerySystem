import mongoose from "mongoose";
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
  userInfo: {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    birth: {
      type: String,
    },
    banned: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
    },
    forgotCode: {
      type: String,
      default: null,
    },
    activationCode: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
    },
  },
  userPrivilege: {
    superUser: {
      type: Boolean,
      default: false
    },
    read: {
      type: Boolean,
      default: false
    },
    add: {
      type: Boolean,
      default: false
    },
    edit: {
      type: Boolean,
      default: false
    },
    delete: {
      type: Boolean,
      default: false
    },
  },
  databasePermissions: {
    IP: {
      type: Boolean,
      default: true
    },
    Phone: {
      type: Boolean,
      default: false
    },
    Printer: {
      type: Boolean,
      default: false
    },
    Datacenter: {
      type: Boolean,
      default: false
    },
    Surveillance: {
      type: Boolean,
      default: false
    },
  },
  customerAccess: {
    '禾花': {
      type: Boolean,
      default: false
    },
    '新南': {
      type: Boolean,
      default: false
    },
    '鹅公岭': {
      type: Boolean,
      default: false
    },
    '白坭坑': {
      type: Boolean,
      default: false
    },
    '慧明': {
      type: Boolean,
      default: false
    },
    '创点': {
      type: Boolean,
      default: false
    },
  },
  loggerSetting: {
    monthRange: {
      type: Number,
      default: 1
    },
    eventColor: {
      type: String,
      default: 'orange'
    },
    themeColor: {
      type: String,
      default: 'primary'
    },
  }
},
{
  timestamps: true
});

userSchema.pre('save', async function (next)  {
  if (!this.isModified('userInfo.password') || !this.userInfo.password) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.userInfo.password = await bcrypt.hash(this.userInfo.password, salt);
});

userSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.userInfo.password);
}
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;