exports.index = function(req, res) {
  const date = new Date();
  res.json({ unix: date.getTime(), utc: date.toUTCString() });
};

exports.date_string = function(req, res) {
  const input = req.params.date_string.split("-");
  const date =
    input.length === 1 ? new Date(Number(input[0])) : new Date(input);
  if (date.toString() === "Invalid Date")
    return res.json({error: "Invalid Date"}); // Should be .status(400) but test requires not to be.
  res.json({ unix: date.getTime(), utc: date.toUTCString() });
};
