const Shortener = require("../models/shortener.model.js");
const dnsLookup = require("../helpers/dnsLookup").lookup;

exports.index = function(req, res) {
  res.sendFile(process.cwd() + "/templates/index.html");
};

exports.query = function(req, res) {
  if (/\D/.test(req.params.shortUrl))
    return res.status(400).json({ Error: "Short URL should be an integer" });

  Shortener.findOne({ shortUrl: req.params.shortUrl })
    .then(urlObject => {
      if (!urlObject) throw Error("Invalid/expired short URL");
      res.redirect(urlObject.url);
    })
    .catch(err => res.json(err.message || err));
};

exports.new = async function(req, res) {
  const url = req.originalUrl.split(/new\//)[1];
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i; // By stephenhay, some invalid urls will pass through.
  if (!urlRegex.test(url) || !dnsLookup(url))
    return res.status(400).json({ Error: "Invalid URL" });

  // Check if requested url already exists in the database.
  const queryRes = await Shortener.findOne({ url: url });
  // Already exists; return the existing.
  if (queryRes)
    return res.json({
      original_url: queryRes.url,
      short_url: queryRes.shortUrl
    });

  // Doesn't exist yet; create a new.
  const lastResultArray = await Shortener.find()
    .sort({ _id: -1 })
    .limit(1);
  // If this is the first entry in the database, start from value 1.
  const newShortUrl =
    lastResultArray.length === 0 ? 1 : Number(lastResultArray[0].shortUrl) + 1;

  const newShortener = new Shortener({
    url: url,
    shortUrl: newShortUrl
  });
  
  newShortener
    .save()
    .then(() => {
      res.json({ original_url: url, short_url: newShortUrl });
    })
    .catch(err => res.status(400).json(err));
};
