const handleConversion = input => {
  const lcInput = input.toLowerCase();
  switch (lcInput) {
    case "gal":
      return { returnUnit: "L", multiplier: 3.78541 };
    case "l":
      return { returnUnit: "gal", multiplier: 1 / 3.78541 };
    case "lb":
    case "lbs":
      return { returnUnit: "kg", multiplier: 0.453592 };
    case "kg":
      return { returnUnit: "lbs", multiplier: 1 / 0.453592 };
    case "mi":
      return { returnUnit: "km", multiplier: 1.60934 };
    case "km":
      return { returnUnit: "mi", multiplier: 1 / 1.60934 };
    default:
      return { returnUnit: input, multiplier: 1 };
  }
};

// User stories:
// I can convert 'gal' to 'L' and vice versa. (1 gal to 3.78541 L)
// I can convert 'lbs' to 'kg' and vice versa. (1 lbs to 0.453592 kg)
// I can convert 'mi' to 'km' and vice versa. (1 mi to 1.60934


module.exports = { handleConversion };
