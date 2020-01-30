const dns = require("dns");

const lookup = url => dns.lookup(url, (err, address, family) => (err ? false : true));

module.exports = { lookup };
