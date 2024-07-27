const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
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

const ListSchema = mongoose.Schema({
  name: String,
  items: [itemSchema],
});
const List = mongoose.model("List", ListSchema);

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
let day = "";

app.get("/", async (req, res) => {
  day = date();
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
  const listName = req.body.list;

  const newItem = new Item({
    name: item,
  });

  if (item) {
    if (listName == day) {
      await newItem.save();
      res.redirect("/");
    } else {
      const result = await List.findOne({ name: listName });
      result.items.push(newItem);
      await result.save();
      res.redirect("/" + listName);
    }
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.checkbox;
  const listName = req.body.list;

  if (listName == day) {
    const result = await Item.deleteOne({ _id: id });
    console.log("Deleted: ", id, result);
    res.redirect("/");
  } else {
    const result = await List.findOne({ name: listName });
    result.items.pull({ _id: id });
    await result.save();
    res.redirect("/" + listName);
  }
});

app.get("/:ListName", async (req, res) => {
  const listName = _.capitalize(req.params.ListName);
  const result = await List.findOne({ name: listName }).exec();

  if (!result) {
    const list = new List({
      name: listName,
      items: defaultItems,
    });
    list.save();
    res.redirect("/" + listName);
  } else {
    res.render("list", { title: listName, items: result.items });
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
