//const Busboy = require("busboy");
const fs = require("fs");
const formidable = require("formidable");

exports.fileupload = function(req, res) {
  const form = new formidable.IncomingForm();
  let currentFile;
  form.on("fileBegin", function(name, file) {
    currentFile = file;
    file.path = process.cwd() + "/public/upload/" + file.name;
  });

  form.parse(req, function(err, fields, files) {
    const { size, name, type } = files[Object.keys(files)[0]];
    res.json({ size, name, type });
  });

  form.on("end", function() {
    console.log(currentFile.name, " uploaded!");
    fs.unlink(currentFile.path, function(err) {
      if (err) throw err;
      console.log(currentFile.path + " deleted!");
    });
  });

  form.on("error", function(error) {
    console.error(error);
  });

  return;

  /*
  const busboy = new Busboy({ headers: req.headers });
  busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
    const saveTo = process.cwd() + "/public/upload/" + filename;
    console.log("Saving file to: ", saveTo);
    file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on("finish", function() {
    res.json({ size: req.headers["content-length"], name, type });
  });
  return req.pipe(busboy);
  */
};
