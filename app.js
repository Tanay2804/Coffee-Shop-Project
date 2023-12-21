import express from "express";
import mongoose from "mongoose";
const url = "mongodb://localhost/CoffeeShop";

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // new encoder
app.use(express.static("public")); // serve all public static files

mongoose.connect(url);

const con = mongoose.connection;

con.on("open", () => {
  console.log("connected...");
});

app.use(express.json());

import shopRouter from "./routes/shop.js";
app.use("/", shopRouter);

app.listen(3000, () => {
  console.log("Server started");
});
