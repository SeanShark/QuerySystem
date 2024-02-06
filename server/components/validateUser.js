// const DataBase = require("../models/exModel");
import User from "../models/userModel.js";


const validateUser = async (user) => {
  const isAuthUser = await User.exists({
    $and: [
      { 'userInfo.email': user },
      { 'userInfo.banned': 'false' },
    ],
    });
  if (!isAuthUser) {
    console.log('validateUser false');
    return false;
  }
  return true;
};

const placeControl = async (user, place) => {
  const allowPlace = 'placeAccess.' + place
  const legalUser = await User.findOne({ 
    $and: [
      { 'userInfo.email': user},
      { [allowPlace] : true },
    ] 
  });
  if(!legalUser) {
    return false;
  }
  return true;
}

const addPrivilege = async (user) => {
  const legalUser = await User.findOne({ 'userInfo.email': user })
    .where("userPrivilege.add")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};
const editPrivilege = async (user) => {
  const legalUser = await User.findOne({ 'userInfo.email': user })
    .where("userPrivilege.edit")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};

const deletePrivilege = async (user) => {
  const legalUser = await User.findOne({ 'userInfo.email': user })
    .where("userPrivilege.delete")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};

const allowIP = async (user) => {
  const legalUser = await User.findOne({ 'userInfo.email': user })
    .where("databasePermissions.ip")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};

const allowsurveillance = async (user) => {
  const legalUser = await User.findOne({ 'userInfo.email': user })
    .where("databasePermissions.surveillance")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};

const allowPhone = async (user) => {
  const legalUser = await User.findOne({ 'userInfo.email': user })
    .where("databasePermissions.phone")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};

const allowPrinter = async (user) => {
  const legalUser = await User.findOne({ 'userInfo.email': user })
    .where("databasePermissions.printer")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};

const allowDatacenter = async (user) => {
  const legalUser = await User.findOne({ 'userInfo.email': user })
    .where("databasePermissions.datacenter")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};

export {
  validateUser,
  placeControl,
  addPrivilege,
  editPrivilege,
  deletePrivilege,
  allowIP,
  allowsurveillance,
  allowPhone,
  allowPrinter,
  allowDatacenter,
};
