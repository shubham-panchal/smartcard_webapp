const Students = require("../models/student");
const Faculties = require("../models/faculties");
const Vendors = require("../models/vendors");
const Books = require("../models/books");
const libraryFineLogs = require("../models/library_fine_log");
const { redirect } = require("express/lib/response");
const express = require("express");

exports.displayHomePage = (req, res) => {
  res.render("library_homepage", { title: "Library Home Page" });
};

// for library admin
exports.libraryAdminLoginGET = (req, res) => {
  res.render("library_admin_login", { title: "Library Admin Login" });
};

exports.libraryAdminLoginPOST = (req, res, next) => {
  try {
    // const library_admin_password = "ladmin123";
    let msg = true;
    if (req.body.library_admin_password === process.env.LIBRARYADMIN) {
      msg = true;
      res.redirect("/library-admin");
    } else {
      msg = false;
      res.render("library_admin_login", {
        title: "Library Admin Login",
        msg,
      });
    }
    res.render("library_admin_login", { title: "Library Admin Login", msg });
  } catch (error) {
    next(error);
  }
};

exports.libraryAdminPage = (req, res) => {
  res.render("library_admin_page", { title: "Library Admin Page" });
};

exports.addBooksGET = (req, res) => {
  res.render("add_books", { title: "Add Books" });
};

exports.addBooksPOST = async (req, res, next) => {
  try {
    req.body.book_id = req.body.book_id.toUpperCase();

    // res.json(req.body);
    const newBook = new Books(req.body);
    await newBook.save();
    res.render("add_books", { title: "Add Books" });
  } catch (error) {
    next(error);
  }
};

exports.getUserId = (req, res) => {
  const action = req.params.action;
  // if (action === "fine-payment") {
  //   res.redirect(`/library/fine-payment/${req.body.member_id.toLowerCase()}`);
  // }
  res.render("library_login", { title: "Library Login", action });
};
exports.postUserId = (req, res, next) => {
  try {
    const action = req.params.action;
    res.redirect(`/library/${action}/${req.body.member_id.toLowerCase()}`);
  } catch (error) {
    next(error);
  }
};

exports.displayFormGET = async (req, res, next) => {
  try {
    const action = req.params.action;
    const user = await Students.find({
      member_id: { $eq: req.params.id.toUpperCase() },
    });

    res.render("borrow_return", { title: "Borrow Return Book", user, action });
  } catch (error) {
    next(error);
  }
};

exports.displayFormPOST = async (req, res, next) => {
  try {
    const action = req.params.action;
    const user = await Students.find({
      member_id: { $eq: req.params.id.toUpperCase() },
    });
    const bookDetails = await Books.find({
      book_id: req.body.book_id.toUpperCase(),
    });

    if (action === "borrow") {
      const bookAvailability = await Books.updateOne(
        { book_id: req.body.book_id },
        {
          $set: {
            available: false,
            issued_by: req.params.id.toUpperCase(),
          },
        }
      );

      const date = new Date();
      const returnDate = date.setDate(date.getDate() + 1);
      const newBookDetails = {
        _id: bookDetails[0]._id,
        book_id: bookDetails[0].book_id,
        book_name: bookDetails[0].book_name,
        author: bookDetails[0].author,
        publication: bookDetails[0].publication,
        issue_date: Date.now(),
        return_date: returnDate,
      };

      const borrower = await Students.updateOne(
        { member_id: req.params.id.toUpperCase() },
        {
          $push: {
            issued_books: newBookDetails,
          },
        }
      );
      // // res.json(newBookDetails);
      res.render("borrow_return_result", {
        title: "Borrow Book",
        user,
        action,
      });
    }
    if (action === "return") {
      const returnBook = await Students.updateOne(
        { member_id: req.params.id.toUpperCase() },
        {
          $pull: {
            issued_books: { book_id: req.body.book_id },
          },
        }
      );

      const bookAvailability = await Books.updateOne(
        { book_id: req.body.book_id },
        {
          $set: {
            available: true,
            issued_by: null,
          },
        }
      );

      res.render("borrow_return_result", {
        title: "Borrow Return Book",
        user,
        action,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.finePaymentGET = async (req, res, next) => {
  try {
    const User = await Students.find({
      member_id: req.params.id.toUpperCase(),
    });
    res.render("fine_payment", { title: "Fine Payment", User });
  } catch (error) {
    next(error);
  }
};

exports.finePaymentPOST = async (req, res, next) => {
  try {
    const User = await Students.find({
      member_id: req.params.id.toUpperCase(),
    });

    if (
      User[0].member_id != req.body.member_id ||
      User[0].member_pin != req.body.member_pin
    ) {
      const msg = "invalid pin";
      res.render("fine_payment_result", { title: "Payment Result", User, msg });
    } else if (User[0].member_balance < User[0].fine_amount) {
      const msg = "insufficient balance";
      res.render("fine_payment_result", { title: "Payment Result", User, msg });
    } else {
      const msg = "success";
      const date = new Date();
      const dateString = date.toISOString();

      // library Fine Log
      const fineLog = {
        member_id: req.body.member_id.toUpperCase(),
        movement_dates: dateString,
        movement: Number(User[0].fine_amount),
      };

      const newFineLog = new libraryFineLogs(fineLog);
      newFineLog.save();
      // getting transaction id
      const movementId = await libraryFineLogs
        .find()
        .limit(1)
        .sort({ $natural: -1 });

      const update = await Students.updateOne(
        { member_id: req.params.id.toUpperCase() },
        {
          $set: {
            member_balance: User[0].member_balance - User[0].fine_amount,
            fine_amount: 0,
          },
          $push: {
            member_movements: -Number(User[0].fine_amount),
            movement_dates: dateString,
            movement_id: movementId[0]._id,
          },
        }
      );

      res.render("fine_payment_result", { title: "Payment Result", User, msg });
    }

    // res.render("fine_payment_result", { title: "Payment Result", User });
  } catch (error) {
    next(error);
  }
};
