const Students = require("../models/student");
const Faculties = require("../models/faculties");
const Vendors = require("../models/vendors");
const CanteenMenu = require("../models/canteen_menu");
const CanteenOrders = require("../models/canteen_orders");
const { redirect } = require("express/lib/response");

exports.adminPage = (req, res) => {
  res.render("admin", { title: "Admin Page" });
};

exports.addMemberGET = (req, res) => {
  res.render("add_member", { title: "Add Member" });
};

exports.addMemberPOST = async (req, res, next) => {
  // for creating username
  try {
    req.body.member_username =
      req.body.member_name.split(" ")[0].toLowerCase() +
      req.body.member_id.slice(-4);
    const id = req.body.member_id.toLowerCase().split("he");
    req.body.member_pin = Number(id[0]) + Number(id[1]);

    // for creating password
    req.body.member_password = req.body.member_id.toUpperCase();

    if (req.body.member_type === "student") {
      const newStudent = new Students(req.body);
      await newStudent.save();
      // res.redirect(`/students`)
    }

    if (req.body.member_type === "faculty") {
      const newFaculty = new Faculties(req.body);
      await newFaculty.save();
      // res.redirect(`/faculties`)
    }
    if (req.body.member_type === "vendor") {
      const newVendor = new Vendors(req.body);
      await newVendor.save();
      // res.redirect(`/faculties`)
    }
    res.render("add_member", { title: "Add Member" });
  } catch (error) {
    next(error);
  }
};

// rendering all students

exports.listAllStudents = async (req, res, next) => {
  try {
    const allStudents = await Students.find();
    res.render("all_students", { title: "All Students", allStudents });
    // res.json(allStudents);
  } catch (error) {
    next(error);
  }
};

// rendering all faculties

exports.listAllFaculties = async (req, res, next) => {
  try {
    const allFaculties = await Faculties.find();
    res.render("all_faculties", { title: "All Faculties", allFaculties });
    // res.json(allStudents);
  } catch (error) {
    next(error);
  }
};

exports.listAllVendors = async (req, res, next) => {
  try {
    const allVendors = await Vendors.find();
    res.render("all_vendors", { title: "All Vendors", allVendors });
    // res.json(allStudents);
  } catch (error) {
    next(error);
  }
};

// Recharge Wallet
exports.rechargeWalletGET = (req, res) => {
  res.render("recharge_wallet", { title: "Recharge Wallet" });
};

exports.rechargeWalletPOST = async (req, res, next) => {
  try {
    //// For Students
    if (req.body.member_type === "student") {
      // getting correct member
      const member = await Students.find({
        member_id: { $eq: req.body.member_id },
      });
      // Getting member's _id
      const memberID = member[0]._id;

      // getting users current balance
      const memberCurrBalance = member[0].member_balance;
      const rechargeAmount = Number(req.body.recharge_amount);

      const date = new Date();
      const dateString = date.toISOString();
      const movementId = await CanteenOrders.find()
        .limit(1)
        .sort({ $natural: -1 });

      const result = await Students.updateOne(
        { _id: memberID },
        {
          $set: {
            // updating balance
            member_balance: memberCurrBalance + rechargeAmount,
          },
          $push: {
            // updating movements
            member_movements: rechargeAmount,
            movement_dates: dateString,
            movement_id: movementId[0]._id,
          },
        }
      );
    }

    //// For Faculty
    if (req.body.member_type === "faculty") {
      // getting correct member
      const member = await Faculties.find({
        member_id: { $eq: req.body.member_id },
      });
      // Getting member's _id
      const memberID = member[0]._id;

      // getting users current balance
      const memberCurrBalance = member[0].member_balance;
      const rechargeAmount = Number(req.body.recharge_amount);
      const date = new Date();
      const dateString = date.toISOString();
      const movementId = await CanteenOrders.find()
        .limit(1)
        .sort({ $natural: -1 });

      const result = await Faculties.updateOne(
        { _id: memberID },
        {
          $set: {
            // updating balance
            member_balance: memberCurrBalance + rechargeAmount,
          },
          $push: {
            // updating movements
            member_movements: rechargeAmount,
            movement_dates: dateString,
            movement_id: movementId[0]._id,
          },
        }
      );
    }
    res.render("recharge_wallet", { title: "Recharge Wallet" });
  } catch (error) {
    next(error);
  }
  // res.redirect("/admin/recharge-wallet/step2");
  // res.render("recharge_wallet_step2", { x });
};
