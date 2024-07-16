const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var items = [];
var workItems = [];

app.get("/", (req, res) => {
  var date = new Date();

  var options = {
    month: "short",
    day: "2-digit",
    weekday: "long",
  };
  var day = date.toLocaleDateString("en", options);
  res.render("list", { title: day, items: items });
});

app.post("/", (req, res) => {
  var item = req.body.todo;
  if (item) {
    if (req.body.list == "Work") {
      workItems.push(item);
      res.redirect("/work");
    } else {
      items.push(item);
      res.redirect("/");
    }
  }
});

app.get("/work", (req, res) => {
  res.render("list", { title: "Work List", items: workItems });
});

app.post("/work", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
