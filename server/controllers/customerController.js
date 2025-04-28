import CustomerList from "../models/customerModel.js";
import * as Database from "../models/queryModel.js";

const getCustomerLists = async (req, res) => {
  // console.log(req.body);
  try {
    const lists = await CustomerList.find({});
    // console.log(lists, typeof(lists));
    res.status(201).send(lists);
  }
  catch (err) {
    // console.log('getCustomerLists', err.message);
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  }
}

const updateAccessable = async (req, res) => {
  const { id, customer, value } = req.body;
  // console.log(id, customer, value);
  if (!id || !customer || typeof(value) !== 'boolean') {
    return res.status(401).json({
      status: "error",
      msg: "操作错误",
    });
  }
  try {
    /*
    const idExists = await CustomerList.findOne({
      customer: customer,
      accessable: { $in: id }
    });
    */
    let result;
    if (value) {
      result = await CustomerList.updateOne(
        { customer: customer },
        { $addToSet: { accessable: id } }
      );
    } else {
      result = await CustomerList.updateOne(
        { customer: customer },
        { $pull: { accessable: id } }
      );
    }

    if (result.matchedCount === 0) {
      return res.status(401).json({
        status: "error",
        msg: "没有找到客户名称",
      });
      // console.log('No customer found with that name');
    } else if (result.modifiedCount === 0) {
      return res.status(401).json({
        status: "error",
        msg: "操作不成功,请重试",
      });
      // console.log('ID was not found in the array (or was already removed)');
    } else {
      return res.status(200).json({
        status: "success",
        msg: "权限更改成功",
      });
      // console.log('Successfully removed ID from array');
    }
  } catch (error) {
    return res.status(401).json({
      status: "error",
      msg: error.message,
    });
  }
}

const newCustomer = async (req, res) => {
  const { customer } = req.body;
  try {
    const existCustomer = await CustomerList.exists({ customer: customer });
    if (existCustomer) {
      return res.status(401).json({
        status: "customerError",
        msg: "同名客户已存在",
      });
    } else {
      const newCustomer = new CustomerList({
        customer: customer
      });
      const saveRecode = await newCustomer.save();
      res.status(201).json({
        status: "success",
        msg: "已成功增加新客户",
        _id: saveRecode._id.toString(),
      });
    }
  } catch (error) {
    return res.status(401).json({
      status: "error",
      msg: error.message,
    });
  }
}

const delCustomer = async (req, res) => {
  const { customer } = req.query;
  // console.log('customer',customer);
  try {
    const notEmptyIP = await Database.IP.exists({ customer: customer });
    const notEmptySurveillance = await Database.Surveillance.exists({ customer: customer });
    const notEmptyPhone = await Database.Phone.exists({ customer: customer });
    if (notEmptyIP || notEmptySurveillance || notEmptyPhone) {
      return res.status(401).json({
        status: "notEmptyError",
        msg: "该客户名称下记录不为空,不能删除",
      });
    } else {
      const targetId = await CustomerList.deleteOne({ customer: customer })
      if (targetId) {
        return res.status(201).json({
          status: "success",
          msg: "客户已成功删除.",
        });
      } else {
        return res.status(401).json({
          status: "error",
          msg: "错误，请重试.",
        });
      }
    }
  } catch (error) {
    return res.status(401).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { 
  getCustomerLists,
  updateAccessable,
  newCustomer,
  delCustomer
}
