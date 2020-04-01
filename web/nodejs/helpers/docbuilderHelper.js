/*
 *
 * (c) Copyright Ascensio System SIA 2020
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

var child_process = require("child_process");
var fileSystem = require("fs");
var os = require("os");
var path = require("path");
var configServer = require("config").get("server");
var builderPath = configServer.get("builderPath");

var docbuilderHelper = {};

docbuilderHelper.generateDocument = function (builderScript) {
    var savePattern = "builder.SaveFile\\s*\\(.*\\);";
    var setTmpFolderPattern = "builder.SetTmpFolder\\s*\\(.*\\);";

    builderScript = CutBuilderScript(builderScript);

    var fileName = GetFileName(builderScript);
    var format = path.extname(fileName).replace(".", "");

    var hash = (Math.random() + "").replace(".", "_");
    var inputFilePath = path.join(os.tmpdir(), "input." + hash + ".docbuilder");
    var outputFilePath = path.join(os.tmpdir(), "output." + hash + "." + fileName);

    var replacement = "builder.SaveFile(\"" + format + "\", \"" + outputFilePath + "\");";

    builderScript = builderScript.replace(new RegExp(savePattern), replacement);

    builderScript = builderScript.replace(new RegExp(setTmpFolderPattern), "");

    fileSystem.writeFileSync(inputFilePath, builderScript);

    BuildFile(inputFilePath, outputFilePath);

    return outputFilePath;
};

var CutBuilderScript = function (builderScript) {
    var openFunction = "builder.OpenFile";
    var createFunction = "builder.CreateFile";
    var saveFunction = "builder.SaveFile";

    if (builderScript == "") {
        throw "Empty Script";
    }

    if (builderScript.indexOf(openFunction) != -1) {
        throw "OpenFile not available there";
    }
    if (builderScript.indexOf(createFunction) == -1) {
        throw "CreateFile not found";
    }
    var saveStartIndex = builderScript.indexOf(saveFunction);
    if (saveStartIndex == -1) {
        throw "SaveFile not found";
    }

    var saveEndIndex = builderScript.indexOf("\r", saveStartIndex);
    if (saveEndIndex != -1) {
        builderScript = builderScript.substring(0, saveEndIndex);
    }
    builderScript += "\r\nbuilder.CloseFile();";

    return builderScript;
};

var GetFileName = function (builderScript) {
    var formatPattern = "builder.SaveFile\\s*\\(\\s*\"(.*)\"\\s*,\\s*\"(.*)\"\\s*\\)";
    var match = new RegExp(formatPattern).exec(builderScript);

    if (match == null) {
        throw "SaveFile without format";
    }

    var format = (match[1] || "").trim().toLowerCase();
    var fileName = (match[2] || "").trim();

    if (fileName != "" && fileName.toLowerCase().search(new RegExp(format)) != -1) {
        fileName = fileName.substring(0, fileName.length - format.length - 1);
    }

    fileName = path.basename(fileName);

    return fileName + "." + format;
};

docbuilderHelper.CreateDocument = function (name, company, title, format) {

    var replacePattern = "['\"\\(\\)\\r\\n]";

    format = ((path.basename(format) || "").split(".")[0] || "");
    if (format == "") {
        throw new Exception("SaveFile without format");
    }

    var hash = (Math.random() + "").replace(".", "_");
    var inputFilePath = path.join(os.tmpdir(), "input." + hash + ".docbuilder");
    var outputFilePath = path.join(os.tmpdir(), "output." + hash + "." + format);

    var templatePath = path.join("public", "samples", format + ".docbuilder");

    try {
        fileSystem.accessSync(templatePath, fileSystem.F_OK);
    } catch (e) {
        throw "An error has occurred. Template File not found";
    }

    var templateText = (fileSystem.readFileSync(templatePath)).toString();

    var customerData = templateText.replace("${Name}", name.replace(new RegExp(replacePattern), ""));
    customerData = customerData.replace("${Company}", company.replace(new RegExp(replacePattern), ""));
    customerData = customerData.replace("${Title}", title.replace(new RegExp(replacePattern), ""));
    customerData = customerData.replace("${DateTime}", new Date().toISOString().replace(/T.+/, " "));
    customerData = customerData.replace("${OutputFilePath}", outputFilePath);

    fileSystem.writeFileSync(inputFilePath, customerData);

    BuildFile(inputFilePath, outputFilePath);

    return outputFilePath;
};

var BuildFile = function (inputFilePath, outputFilePath) {

    child_process.execFileSync(builderPath, [inputFilePath], { cwd: path.dirname(builderPath) });

    try {
        fileSystem.accessSync(outputFilePath, fileSystem.F_OK);
    } catch (e) {
        throw "An error has occurred. Result File not found";
    }
};

module.exports = docbuilderHelper;
