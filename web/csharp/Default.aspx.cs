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