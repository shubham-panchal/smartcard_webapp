const Students = require("../models/student");
const Faculties = require("../models/faculties");
const Vendors = require("../models/vendors");
const CanteenMenu = require("../models/canteen_menu");
const CanteenOrders = require("../models/canteen_orders");
const { redirect } = require("express/lib/response");

exports.addItemGET = (req, res, next) => {
  res.render("add_foodItem", { title: "Add new food item" });
};

exports.addItemPOST = async (req, res, next) => {
  try {
    const newFooditem = new CanteenMenu(req.body);
    await newFooditem.save();
  } catch (error) {
    next(error);
  }
};

exports.collectOrderGET = async (req, res, next) => {
  try {
    const menu = await CanteenMenu.find();
    res.render("order_menu", { title: "Order Menu", menu });
  } catch (error) {
    next(error);
  }
};

let cart = [];
let total = 0;

exports.collectOrderPOST = async (req, res, next) => {
  const menu = await CanteenMenu.find();
  cart.push(req.body);
  const prevTotal = total;
  cart.forEach((item) => {
    total += Number(item.item_qty) * Number(item.item_price);
  });
  total = total - prevTotal;
  res.render("order_menu", { title: "Order Menu", menu });
};

let balanceError = false;
let validationError = false;
let success = true;
exports.placeOrderGET = async (req, res, next) => {
  try {
    const menu = await CanteenMenu.find();

    res.render("place_order", { title: "Place Order", cart, menu, total });
  } catch (error) {
    next(error);
  }
};

exports.placeOrderPOST = async (req, res, next) => {
  try {
    if (req.body.member_type === "faculty") {
      const user = await Faculties.find({
        member_id: req.body.member_id,
        member_pin: req.body.member_pin,
      });
      if (user.length > 0) {
        // checking balance
        if (user[0].member_balance < total) {
          balanceError = true;
          res.render("place_order", { cart, balanceError, total });
        } else {
          const date = new Date();
          const dateString = date.toISOString();
          const ordersObject = {
            member_id: user[0].member_id,
            movement_date: dateString,
            movement: Number(total),
            order: cart,
          };
          const newOrdersObject = new CanteenOrders(ordersObject);
          await newOrdersObject.save();
          const movementId = await CanteenOrders.find()
            .limit(1)
            .sort({ $natural: -1 });
          const update = await Faculties.updateOne(
            { member_id: user[0].member_id },
            {
              $set: {
                member_balance: user[0].member_balance - Number(total),
              },
              $push: {
                member_movements: Number(-total),
                movement_dates: dateString,
                movement_id: movementId[0]._id,
              },
            }
          );

          res.render("place_order", { cart, success, total });
        }
      } else {
        validationError = true;
        res.render("place_order", { cart, validationError, total });
      }
    } else if (req.body.member_type === "student") {
      const user = await Students.find({
        member_id: req.body.member_id,
        member_pin: req.body.member_pin,
      });
      if (user.length > 0) {
        // checking balance
        if (user[0].member_balance < total) {
          balanceError = true;

          res.render("place_order", { cart, balanceError, total });
        } else {
          const date = new Date();
          const dateString = date.toISOString();
          const ordersObject = {
            member_id: user[0].member_id,
            movement_date: dateString,
            movement: Number(total),
            order: cart,
          };
          const newOrdersObject = new CanteenOrders(ordersObject);
          await newOrdersObject.save();

          const movementId = await CanteenOrders.find()
            .limit(1)
            .sort({ $natural: -1 });
          const update = await Students.updateOne(
            { member_id: user[0].member_id },
            {
              $set: {
                member_balance: user[0].member_balance - Number(total),
              },

              $push: {
                member_movements: -Number(total),
                movement_dates: dateString,
                movement_id: movementId[0]._id,
              },
            }
          );

          res.render("place_order", { cart, success, total });
        }
      } else {
        validationError = true;
        res.render("place_order", { cart, validationError, total });
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.newOrder = (req, res) => {
  total = 0;
  cart = [];
  res.redirect("/vendor/order");
};
