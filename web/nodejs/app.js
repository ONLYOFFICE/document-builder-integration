/**
 *
 * (c) Copyright Ascensio System SIA 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
