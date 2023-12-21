import express from "express";
const router = express.Router();
import User from "../models/user.js";
import Beverage from "../models/beverage.js";
import currentUser from "../models/currentUser.js";

import { dirname } from "path";
import { fileURLToPath } from "url";

const _dirname = dirname(fileURLToPath(import.meta.url));
express.urlencoded({ extended: true });

router.get("/", async (req, res) => {
  const user = await currentUser.collection.findOne();
  if (user) {
    res.render("index", { email: user.email });
  } else {
    res.render("index", { email: null });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.collection.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (user) {
      await currentUser.collection.deleteOne(); // delete old currentUser
      const cUser = new currentUser({
        // add new user as currentUser
        email: user.email,
        userName: user.userName,
      });
      await cUser.save(); // save the temp currrent user
      // res.sendFile(_dirname.replace("/routes", "/public/index2.html")); //serve homepage
      res.render("index", { email: cUser.email, password: cUser.password });
    } else {
      res.send("No Such user found Please Check your email or password");
    }
  } catch (err) {
    res.send("Error " + err);
  }
});

//signup
router.post("/signup", async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    userName: req.body.name,
    phone: req.body.phone,
  });

  try {
    // check if user with email already exists
    const checkemail = await User.collection.findOne({ email: req.body.email });
    if (checkemail) {
      res.send(
        "<h1> User already Exists Please go Back and Sign-in Again</h1>"
      );
    } else {
      const a1 = await user.save();
      res.sendFile(_dirname.replace("/routes", "/public/successSignup.html"));
    }
  } catch (err) {
    if (err) console.log(err);
    res.send("Error");
  }
});

// cart actions on selecting items and storing to db
router.post("/cart", async (req, res) => {
  const cUser = await currentUser.collection.findOne(); // get current user details
  const bev = new Beverage({
    user: cUser.userName,
    email: cUser.email,
    Beverages: req.body.Beverages,
  });
  // after creating a new object check if the user had beverages in his cart
  // ie if he has logged in and his login time has not exceeded 10 mins
  //if so then append or add to same cart as prev
  const oldBev = await Beverage.findOne(
    { email: cUser.email },
    {},
    { sort: { createdAt: -1 } },
    (err, latestBeverage) => {
      return latestBeverage;
    }
  );
  if (
    oldBev &&
    Math.abs(new Date().getTime() - oldBev.createdAt.getTime()) <= 1000 * 60 * 4 // limit is 4 mins
  ) {
    await Beverage.findOneAndUpdate(
      { email: cUser.email },
      { $push: { Beverages: req.body.Beverages } },
      { sort: { createdAt: -1 } }, // sort the orders and append the latest order
      { new: true }
    );
  } else {
    // if no order was passed by user in last 10mins create a new order
    try {
      await bev.save();
    } catch (err) {
      if (err) console.log(err);
      res.send("Error");
    }
  }
});

//Get Cart Page
router.get("/Carts", async (req, res) => {
  const cUser = await currentUser.collection.findOne(); // get current user details
  const latestBeverage = await Beverage.findOne(
    // get current user's current order
    { email: cUser.email },
    {},
    { sort: { createdAt: -1 } },
    (err, latestBeverage) => {
      return latestBeverage;
    }
  );
  res.render("cart", { Beverages: latestBeverage.Beverages });
});

router.get("/pay", async (req, res) => {
  const cUser = await currentUser.collection.findOne(); // get current user details
  const latestBeverage = await Beverage.findOne(
    // get current user's current order
    { email: cUser.email },
    {},
    { sort: { createdAt: -1 } },
    (err, latestBeverage) => {
      return latestBeverage;
    }
  );
  res.render("payment", { Beverages: latestBeverage.Beverages });
});

router.post("/pay",async (req,res)=>{
  const user = await currentUser.collection.findOne();
  if (user) {
    res.render("index", { email: user.email });
  } else {
    res.render("index", { email: null });
  }
})


router.get("/signout", async (req, res) => {
  await currentUser.deleteOne();
  res.render("index", { email: null });
});

// Final Page
export default router;
