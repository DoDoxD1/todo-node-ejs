const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Homework",
});
const item2 = new Item({
  name: "Welcome",
});
const item3 = new Item({
  name: "Movies",
});

const defaultItems = [item1, item2, item3];

app.get("/", async (req, res) => {
  const day = date();
  let items = await Item.find();
  if (items.length === 0) {
    Item.create(defaultItems)
      .then(function () {
        console.log("Data inserted");
        res.redirect("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    res.render("list", { title: day, items: items });
  }
});

app.post("/", async (req, res) => {
  var item = req.body.todo;
  if (item) {
    if (req.body.list == "Work") {
      workItems.push(item);
      res.redirect("/work");
    } else {
      const newItem = new Item({
        name: item,
      });
      await newItem.save();
      res.redirect("/");
    }
  }
});

app.get("/work", (req, res) => {
  res.render("list", { title: "Work List", items: workItems });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
