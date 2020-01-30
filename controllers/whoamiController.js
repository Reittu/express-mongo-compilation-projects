exports.index = function(req, res) {
  const ipaddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    language = req.headers["accept-language"],
    software = req.headers["user-agent"];
  res.json({ ipaddress, language, software });
};