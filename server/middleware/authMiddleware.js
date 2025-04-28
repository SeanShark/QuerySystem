import User from '../models/userModel.js';
import CustomerList from "../models/customerModel.js";

const adminUser = (async (req, res, next) => {
  const isSuperUser = req.user.userPrivilege.superUser
  if (!isSuperUser) {
    return res.status(401).json({
      title: "error",
      msg: "非授权用户。",
    });
  } else {
    next();
  }
})



const allowDatabase = (async (req, res, next) => {
  const type = req.body.type;
  if (type !== "EmptyIP") {
    const database = "databasePermissions." + type
    // console.log('allowDatabase',database, req.body);
    
    try {
      const authUser = await User.findOne({
          $and: [
            { _id: req.id },
            {[database]: true}
          ]
      });
      // console.log('allowDatabase',database);
      if(!authUser) {
        return res.status(401).json({
          title: "error",
          msg: "您没有权限访问该数据。",
        });
      }
      
    } catch (error) {
      res.status(401).json({
        title: "error",
        msg: "授权用户查询错误。",
      });
    }
  }
  next();
  
})

const accessableCustomer = (async (req, res, next) => {
  // console.log(req.body.data);
  // console.log(req.id);

  //if the user's ID not in the accessable array, will deny to query the customer
  //in the client side, the user cannot even see the customer name in the customer list.
  const id = req.id;
  const { customer } = req.body.data;
  try {
    const authCustomer = await CustomerList.findOne({
      customer: customer,
      accessable: id
    });
    if (!authCustomer) {
      return res.status(401).json({
        title: "error",
        status: "customerError",
        msg: "您没有权限访问该客户数据。",
      });
    }
    next();
  }
  catch (error) {
    return res.status(401).json({
      title: "error",
      msg: "授权用户查询错误。",
    });
  }
})


//customer control handle in customerController.js
const customerControl = (async (req, res, next) => {
  const customer  = req.body.data.customer;
  const allowCustomer = 'customerAccess.' + customer;
  // console.log('customerControl', req.body);
  try {
    const authUser = await User.findOne({ 
      $and: [
        { _id: req.id},
        { [allowCustomer]: true },
      ] 
    }); 
    // console.log('customerControl',authUser);
    if(!authUser) {
      return res.status(401).json({
        title: "error",
        msg: "您没有权限访问该单位。",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      title: "error",
      msg: "授权用户查询错误。",
    });
  }
  
})

const addAuth = (async (req, res, next) => {

  const authUser = req.user.userPrivilege.add;
  if(!authUser) {
    return res.status(401).json({
      title: "error",
      msg: "您没有增加记录的权限。",
    });
  } else {
    next();
  }
})

const updateAuth = (async (req, res, next) => {
  
  const authUser = req.user.userPrivilege.edit;
  if(!authUser) {
    return res.status(401).json({
      title: "error",
      msg: "您没有更改记录的权限。",
    });
  } else {
    next();
  }
  
})

const deleteAuth = (async (req, res, next) => {
  
  const authUser = req.user.userPrivilege.delete;
  if(!authUser) {
    return res.status(401).json({
      title: "error",
      msg: "您没有删除记录的权限。",
    });
  } else {
    next();
  }
  
})




export { 
  adminUser,
  customerControl,
  addAuth,
  updateAuth,
  deleteAuth,
  allowDatabase,
  accessableCustomer
}
