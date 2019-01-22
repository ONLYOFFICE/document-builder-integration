/*
 *
 * (c) Copyright Ascensio System SIA 2019
 *
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
*/

var express = require("express");
var mime = require("mime");
var path = require("path");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");
var fileSystem = require("fs");
var config = require("config");
var docbuilderHelper = require("./helpers/docbuilderHelper");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs")


app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

app.use(express.static(path.join(__dirname, "public")));
if (config.has("server.static")) {
  var staticContent = config.get("server.static");
  for (var i = 0; i < staticContent.length; ++i) {
    var staticContentElem = staticContent[i];
    app.use(staticContentElem["name"], express.static(staticContentElem["path"], staticContentElem["options"]));
  }
}
app.use(favicon(__dirname + "/public/images/favicon.ico"));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var defaultScript = function () {
    return fileSystem.readFileSync(path.join("public", "samples", "sample.docbuilder"));
};

app.get("/", function (req, res) {
    try {

        res.render("index", {
            predefinedScript: defaultScript(),
            errorMessage: null
        });

    }
    catch (ex) {
        console.log(ex);
        res.render("index", { predefinedScript: defaultScript(), errorMessage: JSON.stringify(ex) });
        return;
    }
});

app.post("/generate", function (req, res) {
    var builderScript = (req.body.PredefinedScript || "").trim();
    try {
        var outputFilePath = docbuilderHelper.generateDocument(builderScript);        

        var fileName = path.basename(outputFilePath) || "output..tmp.docx";
        fileName = fileName.substring(1 + fileName.indexOf(".", 7));

        res.setHeader("Content-Length", fileSystem.statSync(outputFilePath).size);
        res.setHeader("Content-disposition", "attachment; filename=\"" + fileName + "\"");
        res.setHeader("Content-type", mime.lookup(outputFilePath));

        var filestream = fileSystem.createReadStream(outputFilePath);
        filestream.pipe(res);
    }
    catch (ex) {
        console.log(ex);
        res.render("index", { predefinedScript: builderScript, errorMessage: JSON.stringify(ex) });
        return;
    }
});

app.post("/create", function (req, res) {
    try {
        var name = (req.body.NameText || "").trim();
        if (name == "") {
            name = "John Smith";
        }

        var company = (req.body.CompanyText || "").trim();
        if (company == "") {
            company = "ONLYOFFICE";
        }

        var title = (req.body.TitleText || "").trim();
        if (title == "") {
            title = "Commercial director";
        }

        var format = req.body["docx"] ? "docx" : (req.body["xlsx"] ? "xlsx" : "pdf");

        var outputFilePath = docbuilderHelper.CreateDocument(name, company, title, format);

        var fileName = path.basename(outputFilePath) || "output..docx";
        fileName = "Sample" + fileName.substring(fileName.indexOf(".", 7));

        res.setHeader("Content-Length", fileSystem.statSync(outputFilePath).size);
        res.setHeader("Content-disposition", "attachment; filename=" + fileName);
        res.setHeader("Content-type", mime.lookup(outputFilePath));

        var filestream = fileSystem.createReadStream(outputFilePath);
        filestream.pipe(res);
    }
    catch (ex) {
        console.log(ex);
        res.render("index", { predefinedScript: defaultScript(), errorMessage: JSON.stringify(ex) });
        return;
    }
});

app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
        res.render("index", { predefinedScript: defaultScript(), errorMessage: "Server error" });
});

module.exports = app;
