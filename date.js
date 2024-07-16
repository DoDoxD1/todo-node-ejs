module.exports = getDate;
function getDate() {
  var date = new Date();

  var options = {
    month: "short",
    day: "2-digit",
    weekday: "long",
  };
  var day = date.toLocaleDateString("en", options);
  return day;
}
