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

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Configuration;

namespace DocumentBuilder.Helpers
{
    public class BuildHelper
    {
        public static string BuilderPath
        {
            get { return WebConfigurationManager.AppSettings["builder-path"] ?? string.Empty; }
        }

        public static string GenerateDocument(string builderPath, string builderScript)
        {
            const string savePattern = "builder.SaveFile\\s*\\(.*\\);";
            const string setTmpFolderPattern = "builder.SetTmpFolder\\s*\\(.*\\);";

            builderScript = CutBuilderScript(builderScript);

            var fileName = GetFileName(builderScript);
            var format = (Path.GetExtension(fileName) ?? "").TrimStart('.');

            var hash = Guid.NewGuid().ToString();
            var inputFilePath = Path.Combine(Path.GetTempPath(), string.Format("input.{0}.docbuilder", hash));
            var outputFilePath = Path.Combine(Path.GetTempPath(), string.Format("output.{0}.{1}", hash, fileName));

            var replacement = string.Format("builder.SaveFile(\"{0}\", \"{1}\");", format, outputFilePath);

            builderScript = Regex.Replace(builderScript, savePattern, replacement);

            builderScript = Regex.Replace(builderScript, setTmpFolderPattern, string.Empty);

            File.WriteAllText(inputFilePath, builderScript);

            BuildFile(builderPath, inputFilePath, outputFilePath);

            return outputFilePath;
        }

        private static string CutBuilderScript(string builderScript)
        {
            const string openFunction = "builder.OpenFile";
            const string createFunction = "builder.CreateFile";
            const string saveFunction = "builder.SaveFile";

            if (builderScript.IndexOf(openFunction, StringComparison.InvariantCulture) != -1)
            {
                throw new Exception("OpenFile not available there");
            }
            if (builderScript.IndexOf(createFunction, StringComparison.InvariantCulture) == -1)
            {
                throw new Exception("CreateFile not found");
            }
            var saveStartIndex = builderScript.IndexOf(saveFunction, StringComparison.InvariantCulture);
            if (saveStartIndex == -1)
            {
                throw new Exception("SaveFile not found");
            }

            var saveEndIndex = builderScript.IndexOf('\r', saveStartIndex);
            if (saveEndIndex != -1)
            {
                builderScript = builderScript.Substring(0, saveEndIndex);
            }
            builderScript += "\r\nbuilder.CloseFile();";

            return builderScript;
        }

        private static string GetFileName(string builderScript)
        {
            const string formatPattern = "builder.SaveFile\\s*\\(\\s*\"(.*)\"\\s*,\\s*\"(.*)\"\\s*\\)";

            var format = string.Empty;
            var fileName = string.Empty;

            foreach (Match match in Regex.Matches(builderScript, formatPattern))
            {
                format = match.Groups[1].Value.ToLowerInvariant();
                fileName = match.Groups[2].Value;
                break;
            }

            if (string.IsNullOrEmpty(format))
            {
                throw new Exception("SaveFile without format");
            }

            if (!string.IsNullOrEmpty(fileName) && fileName.ToLowerInvariant().EndsWith("." + format.ToLowerInvariant()))
            {
                fileName = fileName.Substring(0, fileName.Length - format.Length - 1);
            }

            fileName = Path.GetFileName(fileName);

            return fileName + "." + format;
        }

        public static string CreateDocument(string builderPath, string name, string company, string title, string format)
        {
            const string replacePattern = "['\"\\(\\)\\r\\n]";

            format = (Path.GetFileName(format) ?? "").Split('.')[0];
            if (string.IsNullOrEmpty(format))
            {
                throw new Exception("SaveFile without format");
            }

            var hash = Guid.NewGuid().ToString();
            var inputFilePath = Path.Combine(Path.GetTempPath(), string.Format("input.{0}.docbuilder", hash));
            var outputFilePath = Path.Combine(Path.GetTempPath(), string.Format("output.{0}.{1}", hash, format));

            var templatePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", string.Format("{0}.docbuilder", format));

            if (!File.Exists(templatePath))
            {
                throw new Exception("Template not found");
            }
            var templateText = File.ReadAllText(templatePath);

            var customerData = new Dictionary<string, string>
                {
                    { "${Name}", Regex.Replace(name, replacePattern, string.Empty) },
                    { "${Company}", Regex.Replace(company, replacePattern, string.Empty) },
                    { "${Title}", Regex.Replace(title, replacePattern, string.Empty) },
                    { "${DateTime}", DateTime.Now.ToString(CultureInfo.InvariantCulture) },
                    { "${OutputFilePath}", outputFilePath }
                };

            var inputText = customerData.Aggregate(templateText,
                                                   (current, substitution) =>
                                                   current.Replace(substitution.Key, substitution.Value));

            File.WriteAllText(inputFilePath, inputText);

            BuildFile(builderPath, inputFilePath, outputFilePath);

            return outputFilePath;
        }


        private static int _run;
        private const int Max = 10;

        private static void BuildFile(string builderFilePath, string inputFilePath, string outputFilePath)
        {
            try
            {
                if (++_run > Max)
                {
                    throw new Exception("Not available. Try later");
                }

                var startInfo = new ProcessStartInfo
                {
                    WindowStyle = ProcessWindowStyle.Hidden,
                    WorkingDirectory = Path.GetDirectoryName(builderFilePath) ?? string.Empty,
                    FileName = builderFilePath,
                    Arguments = inputFilePath,
                    UseShellExecute = false
                };

                using (var process = Process.Start(startInfo))
                {
                    process.WaitForExit();
                }

                if (!File.Exists(outputFilePath))
                {
                    throw new Exception("An error has occurred. Result File not found");
                }
            }
            catch (Exception)
            {
                _run--;
                throw;
            }
            _run--;
        }
    }
}