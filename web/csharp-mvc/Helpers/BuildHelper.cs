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

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using DocumentBuilder.Classes;


namespace DocumentBuilder.Helpers
{
    public class BuildHelper
    {
        public static string GenerateDocument(string builderPath, UserInfo userInfo)
        {
            const string formatPattern = "builder.SaveFile\\(\"(.*)\",";
            const string fullPattern = @"builder.SaveFile\(.*\);";

            var format = string.Empty;

            foreach (Match match in Regex.Matches(userInfo.Script, formatPattern)){
                format = match.Value.Split('"')[1];
                break;
            }

            var inputFilePath = Path.Combine(Path.GetTempPath(), "input.docbuilder");
            var outputFilePath = Path.Combine(Path.GetTempPath(), string.Format("output.{0}", format));

            var replacement = string.Format("builder.SaveFile(\"{0}\", \"{1}\");", format, outputFilePath);

            var inputText = Regex.Replace(userInfo.Script, fullPattern, replacement);

            FileHelper.WriteTextToFile(inputFilePath, inputText);

            BuildFile(builderPath, inputFilePath, outputFilePath);

            return outputFilePath;
        }

        public static string CreateDocument(string builderPath, UserInfo userInfo)
        {
            var inputFilePath = Path.Combine(Path.GetTempPath(), "input.docbuilder");
            var outputFilePath = Path.Combine(Path.GetTempPath(), string.Format("output.{0}", userInfo.Type.ToString().ToLowerInvariant()));

            var resourceName = string.Format("DocumentBuilderMVC.Templates.{0}.docbuilder", userInfo.Type.ToString().ToLowerInvariant());

            var templateText = FileHelper.ReadTextFromEmbeddedResource(Assembly.GetExecutingAssembly(), resourceName);

            var customerData = new Dictionary<string, string>
                {
                    {"${Name}", userInfo.Name},
                    {"${Company}", userInfo.Company},
                    {"${Title}", userInfo.Title},
                    {"${DateTime}", DateTime.Now.ToString(CultureInfo.InvariantCulture)},
                    {"${OutputFilePath}", outputFilePath}
                };

            var inputText = customerData.Aggregate(templateText,
                                                   (current, substitution) =>
                                                   current.Replace(substitution.Key, substitution.Value));

            FileHelper.WriteTextToFile(inputFilePath, inputText);

            BuildFile(builderPath, inputFilePath, outputFilePath);

            return outputFilePath;
        }
        
        public static byte[] BuildFile(string builderFilePath, string inputFilePath, string outputFilePath)
        {
            byte[] result = null;

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

            result = FileHelper.ReadBytesFromFile(outputFilePath);

            if (result == null)
                throw new Exception("An error has occurred. Empty Output File");

            return result;
        }
    }
}