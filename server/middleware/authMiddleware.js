import User from '../models/userModel.js';


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
  const database = "databasePermissions." + req.body.type
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
    next();
  } catch (error) {
    res.status(401).json({
      title: "error",
      msg: "授权用户查询错误。",
    });
  }
  
})

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
  allowDatabase
}
