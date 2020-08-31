/**
 *
 * (c) Copyright Ascensio System SIA 2020
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
using System.IO;
using System.Reflection;
using System.Web.UI;
using DocumentBuilder.Helpers;

namespace DocumentBuilder
{
    public partial class _Default : Page
    {
        protected string ErrorMessage;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Page.IsPostBack) return;

            PredefinedScript.Text = ReadTextFromEmbeddedResource(Assembly.GetExecutingAssembly(), "DocumentBuilder.App_Data.sample.docbuilder");

            NameText.Text = "";
            NameText.Attributes.Add("placeholder", "John Smith");

            CompanyText.Text = "";
            CompanyText.Attributes.Add("placeholder", "ONLYOFFICE");

            TitleText.Text = "";
            TitleText.Attributes.Add("placeholder", "Commercial director");
        }

        protected void GenerateButton_Click(object sender, EventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(BuildHelper.BuilderPath))
                    throw new Exception("Empty Builder Path");

                var builderScript = (PredefinedScript.Text ?? "").Trim();
                if (string.IsNullOrEmpty(builderScript))
                    throw new Exception("Empty Script");

                var filePath = BuildHelper.GenerateDocument(BuildHelper.BuilderPath, builderScript);

                var fileName = Path.GetFileName(filePath) ?? "output..tmp.docx";
                fileName = fileName.Substring(1 + fileName.IndexOf('.', 7));

                var mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                if (Path.GetExtension(fileName) == "xlsx")
                {
                    mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                }
                else if (Path.GetExtension(fileName) == "pptx")
                {
                    mime = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
                }

                Response.ContentType = mime;
                Response.AppendHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
                Response.TransmitFile(filePath);
                Response.End();
            }
            catch (Exception exception)
            {
                ErrorMessage = exception.Message;
            }
        }

        protected void CreateDocx_click(object sender, EventArgs e)
        {
            Create("docx");
        }

        protected void CreateXlsx_click(object sender, EventArgs e)
        {
            Create("xlsx");
        }

        protected void CreatePdf_click(object sender, EventArgs e)
        {
            Create("pdf");
        }

        private void Create(string format)
        {
            try
            {
                if (string.IsNullOrEmpty(BuildHelper.BuilderPath))
                    throw new Exception("Empty Builder Path");

                var name = (NameText.Text ?? "").Trim();
                if (string.IsNullOrEmpty(name))
                    name = "John Smith";

                var company = (CompanyText.Text ?? "").Trim();
                if (string.IsNullOrEmpty(company))
                    company = "ONLYOFFICE";

                var title = (TitleText.Text ?? "").Trim();
                if (string.IsNullOrEmpty(title))
                    title = "Commercial director";

                var filePath = BuildHelper.CreateDocument(BuildHelper.BuilderPath, name, company, title, format);

                var fileName = Path.GetFileName(filePath) ?? "output..docx";
                fileName = "Sample" + fileName.Substring(fileName.IndexOf('.', 7));

                var mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                if (Path.GetExtension(fileName) == ".xlsx")
                {
                    mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                }
                else if (Path.GetExtension(fileName) == ".pdf")
                {
                    mime = "application/pdf";
                }

                Response.ContentType = mime;
                Response.AppendHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
                Response.TransmitFile(filePath);
                Response.End();
            }
            catch (Exception exception)
            {
                ErrorMessage = exception.Message;
            }
        }

        private static string ReadTextFromEmbeddedResource(Assembly assembly, string resourceName)
        {
            var result = string.Empty;

            using (var stream = assembly.GetManifestResourceStream(resourceName))
            {
                if (stream != null)
                {
                    using (var sr = new StreamReader(stream))
                    {
                        result = sr.ReadToEnd();
                    }
                }
            }

            return result;
        }
    }
}