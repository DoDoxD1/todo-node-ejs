const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var items = [];

app.get("/", (req, res) => {
  var date = new Date();

  var options = {
    month: "short",
    day: "2-digit",
    weekday: "long",
  };
  var day = date.toLocaleDateString("en", options);
  res.render("list", { data: day, items: items });
});

app.post("/", (req, res) => {
  var item = req.body.todo;
  if (item) items.push(item);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
