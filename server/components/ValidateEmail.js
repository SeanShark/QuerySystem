const DataBase = require("../Model/MogonDB");

const validateUser = async (user) => {
  const isAuthUser = await DataBase.User.exists({
    $and: [
      { email: user },
      { banned: 'false' },
    ],
    });
  if (!isAuthUser) {
    console.log('isAuthUser false');
    return false;
  }
  return true;
};

const placeControl = async (user, place) => {
  const allowPlace = 'placeAccess.' + place
  const legalUser = await DataBase.User.findOne({ 
    $and: [
      { email: user},
      { [allowPlace] : true },
    ] 
  });
  if(!legalUser) {
    return false;
  }
  return true;
}



const addPrivilege = async (user) => {
  const legalUser = await DataBase.User.findOne({ email: user })
    .where("userPrivilege.add")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};
const editPrivilege = async (user) => {
  const legalUser = await DataBase.User.findOne({ email: user })
    .where("userPrivilege.edit")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};
const deletePrivilege = async (user) => {
  const legalUser = await DataBase.User.findOne({ email: user })
    .where("userPrivilege.delete")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};

const allowIP = async (user) => {
  const legalUser = await DataBase.User.findOne({ email: user })
    .where("databasePermissions.ip")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};
const allowsurveillance = async (user) => {
  const legalUser = await DataBase.User.findOne({ email: user })
    .where("databasePermissions.surveillance")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};
const allowPhone = async (user) => {
  const legalUser = await DataBase.User.findOne({ email: user })
    .where("databasePermissions.phone")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};
const allowPrinter = async (user) => {
  const legalUser = await DataBase.User.findOne({ email: user })
    .where("databasePermissions.printer")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};
const allowDatacenter = async (user) => {
  const legalUser = await DataBase.User.findOne({ email: user })
    .where("databasePermissions.datacenter")
    .equals("true");
  
  if(!legalUser) {
    return false;
  }
  return true;
};

module.exports = {
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
