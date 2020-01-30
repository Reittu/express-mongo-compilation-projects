const fetch = require("node-fetch");

const Stock = require("../models/stock.model.js");
const Voter = require("../models/voter.model.js");

exports.index = async function(req, res) {
  // Check validity of query
  if (!req.query.stock) 
    return res.status(400).json({ Error: "Query should include stock(s)" });
  
  // Array conversion + Flat() required if only 1 stock is given (string).
  const symbols = [req.query.stock].flat().map(x => x.toUpperCase());
  const urls = symbols.map(
    url => `https://repeated-alpaca.glitch.me/v1/stock/${url}/quote`
  );
  // Note that this header can be spoofed so this would be abusable for a serious case.
  const ip = req.headers["x-forwarded-for"].split(",")[0];

  // User searches only one stock
  if (urls.length === 1) {
    // Check the stock exists
    const stats = await fetch(urls[0]).then(res => res.json());
    if (stats === "Unknown symbol" || stats === "Invalid symbol")
      return res.status(400).json({ Error: "Invalid stock value" });
    // Fetch the stock object containing the likes
    const stockDb =
      (await Stock.findOne({ symbol: symbols[0] })) ||
      new Stock({ symbol: symbols[0] });
    if (req.query.like === "true") {
      const voter = (await Voter.findOne({ ip })) || new Voter({ ip });
      // Update (or insert) required only if the like count is modified.
      if (!voter.likes.includes(symbols[0])) {
        stockDb.likes += 1;
        stockDb.save();
        voter.likes = [...voter.likes, symbols[0]];
        voter.save();
      }
    }
    return res.json({
      stockData: {
        stock: symbols[0],
        price: stats.latestPrice,
        likes: stockDb.likes
      }
    });
  }

  // Two stocks
  if (urls.length === 2) {
    Promise.all(urls.map(url => fetch(url).then(res => res.json())))
      .then(async stockDataArray => {
        const [statsOne, statsTwo] = stockDataArray;
        const stockPromises = symbols.map(x => Stock.findOne({ symbol: x }));
        let stocks = await Promise.all(stockPromises);
        stocks = symbols.map((symbol, i) =>
          stocks[i] ? stocks[i] : new Stock({ symbol: symbols[i] })
        );

        if (req.query.like === "true") {
          const voter = (await Voter.findOne({ ip })) || new Voter({ ip });
          for (let i = 0; i < stocks.length; i++) {
            if (!voter.likes.includes(symbols[i])) {
              voter.likes.push(symbols[i]);
              stocks[i].likes += 1;
              stocks[i].save();
            }
          }
          voter.save();
        }

        const relA = stocks[0].likes - stocks[1].likes;
        const relB = -relA || 0;
        return res.json({
          stockData: [
            { stock: symbols[0], price: statsOne.latestPrice, rel_likes: relA },
            { stock: symbols[1], price: statsTwo.latestPrice, rel_likes: relB }
          ]
        });
      })
      .catch(err => res.status(400).json(err));
    // More than 3 stocks
  } else
    return res.status(400).json({ Error: "Maximum of two stocks allowed for comparison" });
};
