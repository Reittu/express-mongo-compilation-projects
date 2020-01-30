const { handleConversion } = require("../helpers/conversionHandler");

const unabbreviate = {
  gal: "gallon",
  L: "liter",
  lb: "pound",
  lbs: "pound",
  kg: "kilogram",
  mi: "mile",
  km: "kilometer"
};
const supportedUnits = ["gal", "l", "lb", "lbs", "kg", "mi", "km"];

exports.index = function(req, res) {
  const input = req.query.input;
  if (!input)
    return res.status(400).json('Your query should include an input, e.g. /api/convert?input=5/4gal');

  // Splits at the points between a number and a character.
  let [initNum, initUnit] = input.split(/(?<=\d)\s?(?=[a-zA-Z])/);
  // Only either number or unit given.
  if (!initUnit) {
    // Only unit given; assign default value of 1.
    if (/[a-zA-Z]/.test(initNum)) {
      initUnit = initNum;
      initNum = "1";
      // Only number given.
    } else return res.status(400).json('no unit');
  }
  if (!supportedUnits.includes(initUnit.toLowerCase())) 
    return res.status(400).json('invalid unit');
  
  // If input contains a fraction, e.g. 5/4kg (no eval)
  let initVal = initNum;
  if (initNum.includes("/")) {
    const [operand1, operand2] = initNum.split("/");
    initVal = operand1 / operand2;
  }

  const { returnUnit, multiplier } = handleConversion(initUnit);
  const returnNum = (initVal * multiplier).toFixed(5);
  res.json({
    initNum,
    initUnit,
    returnUnit,
    returnNum,
    string: `${initNum} ${unabbreviate[initUnit]}${
      initNum === "1" ? "" : "s"
    } converts to ${returnNum} ${unabbreviate[returnUnit]}s`
  });
};
