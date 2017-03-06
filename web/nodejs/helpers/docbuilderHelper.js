/*
 *
 * (c) Copyright Ascensio System Limited 2010-2017
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7 § 3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7 § 3(e) we decline to grant you any rights under trademark law for use of our trademarks.
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

    child_process.execFileSync(builderPath, [inputFilePath]);

    try {
        fileSystem.accessSync(outputFilePath, fileSystem.F_OK);
    } catch (e) {
        throw "An error has occurred. Result File not found";
    }
};

module.exports = docbuilderHelper;
