const express = require("express");
const app = express();
const PORT = 3000;
var data = "Hello World!";

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("list", { data: data });
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
