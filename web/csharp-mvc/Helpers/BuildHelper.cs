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