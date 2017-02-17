using System;
using System.IO;
using System.Reflection;
using System.Web.UI;
using DocumentBuilder.Classes;
using DocumentBuilder.Enums;
using DocumentBuilder.Helpers;

namespace DocumentBuilder
{
    public partial class _Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Page.IsPostBack) return;

            PredefinedScript.Text = FileHelper.ReadTextFromEmbeddedResource(Assembly.GetExecutingAssembly(),
                                                                            "DocumentBuilder.Templates.sample.docbuilder");

            NameText.Text = "";
            NameText.Attributes.Add("placeholder", "John Smith");

            CompanyText.Text = "";
            CompanyText.Attributes.Add("placeholder", "ONLYOFFICE");

            TitleText.Text = "";
            TitleText.Attributes.Add("placeholder", "Commercial director");

            DocumentTypeHiddenField.Value = "";
            ErrorHiddenField.Value = "";
        }

        protected void GenerateButton_Click(object sender, EventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(Settings.BuilderPath))
                    throw new Exception("Empty Builder Path");

                var userInfo = new UserInfo
                    {
                        Script = PredefinedScript.Text.Trim()
                    };

                if (string.IsNullOrEmpty(userInfo.Script))
                    throw new Exception("Empty Script");

                var filePath = BuildHelper.GenerateDocument(Settings.BuilderPath, userInfo);

                Response.ContentType = "application/octet-stream";
                Response.AppendHeader("Content-Disposition", "attachment; filename=" + Path.GetFileName(filePath));
                Response.TransmitFile(filePath);
                Response.End();
            }
            catch (Exception exception)
            {
                ErrorHiddenField.Value = exception.Message;
            }
        }

        protected void CreateButton_Click(object sender, EventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(Settings.BuilderPath))
                    throw new Exception("Empty Builder Path");

                int type;

                Int32.TryParse(DocumentTypeHiddenField.Value, out type);

                var userInfo = new UserInfo
                    {
                        Name = NameText.Text.Trim(),
                        Company = CompanyText.Text.Trim(),
                        Title = TitleText.Text.Trim(),
                        Type = (DocumentType)type
                    };

                if (string.IsNullOrEmpty(userInfo.Name))
                    throw new Exception("Empty Name");

                if (string.IsNullOrEmpty(userInfo.Company))
                    throw new Exception("Empty Company");

                if (string.IsNullOrEmpty(userInfo.Title))
                    throw new Exception("Empty Title");

                var filePath = BuildHelper.CreateDocument(Settings.BuilderPath, userInfo);

                Response.ContentType = "application/octet-stream";
                Response.AppendHeader("Content-Disposition", "attachment; filename=" + Path.GetFileName(filePath));
                Response.TransmitFile(filePath);
                Response.End();
            }
            catch (Exception exception)
            {
                ErrorHiddenField.Value = exception.Message;
            }
        }
    }
}