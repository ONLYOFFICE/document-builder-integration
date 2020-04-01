<%@ Page Title="Home Page" Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="DocumentBuilder._Default" %>

<!DOCTYPE html>
<html lang="en">
<head id="Head1" runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>ONLYOFFICE Document Builder</title>
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans:900,800,700,600,500,400,300&subset=latin,cyrillic-ext,cyrillic,latin-ext" />
    <link href="Content/site.css" rel="stylesheet" />
    <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
</head>
<body>
    <form id="Form1" runat="server">
        <header>
            <a href="/"><img src="Content/Images/logo.png" alt="ONLYOFFICE" /></a>
        </header>
        <div class="main-panel">
            <span class="portal-name">ONLYOFFICE Document Builder – Welcome!</span>
            <span class="portal-descr">Get started with a demo-sample of ONLYOFFICE Document Builder. You may upload your own script for documents using the <b>Upload script</b> button and selecting the necessary file on your PC.</span>
            <div class="help-block">
                <span>Generate a document from the script below, edit it or upload your own script</span>
                <p>Use the script in the textarea below as is to generate the document or you edit it in the textarea window. Or, in case you have a script of your own, use the button under the textarea to upload it.</p>
                <div class="error-message"><%= ErrorMessage %></div>
                <div class="clearFix">
                    <asp:TextBox ID="PredefinedScript" runat="server" TextMode="multiline"></asp:TextBox>
                    <div class="upload-panel clearFix">
                        <a id="builderFileLink" class="file-upload">Upload your own script</a>
                        <input type="file" id="builderFile" />

                        <div class="generate-button-upload">
                            <asp:Button ID="GenerateButton" runat="server" OnClick="GenerateButton_Click" Text="Generate document" />
                        </div>
                        <p>Visit <a target="_blank" href="https://api.onlyoffice.com/docbuilder/basic">ONLYOFFICE Document Builder documentation</a> for more script examples.</p>
                    </div>
                    <div class="create-panel clearFix">
                        <span>Or create a new file from a sample script with your own data</span>
                        Fill the data into the text areas below so that it could appear in the output document. Or leave it blank, in this case the default values (now shown as watermarks in the text area) will be added to the resulting document.

                    <ul class="try-editor-list clearFix">
                        <li>
                            <asp:Button ID="CreateDocx" runat="server" OnClick="CreateDocx_click" CssClass="try-editor document" Text="Create Document" />
                        </li>
                        <li>
                            <asp:Button ID="CreateXlsx" runat="server" OnClick="CreateXlsx_click" CssClass="try-editor spreadsheet" Text="Create Spreadsheet" />
                        </li>
                        <li>
                            <asp:Button ID="CreatePdf" runat="server" OnClick="CreatePdf_click" CssClass="try-editor presentation" Text="Create PDF" />
                        </li>
                    </ul>

                        <div class="own-data-enter">
                            <label>Name: </label>
                            <asp:TextBox ID="NameText" runat="server" CssClass="input"></asp:TextBox>
                            <label>Company: </label>
                            <asp:TextBox ID="CompanyText" runat="server" CssClass="input"></asp:TextBox>
                            <label>Position/Title: </label>
                            <asp:TextBox ID="TitleText" runat="server" CssClass="input"></asp:TextBox>
                        </div>
                    </div>
                </div>
            </div>
            <div class="help-block">
                <span>Want to learn the magic?</span>
                Explore ONLYOFFICE Document Builder
        <a href="http://helpcenter.onlyoffice.com/developers/document-builder/index.aspx" target="_blank">documentation.</a>
            </div>
            <div class="help-block">
                <span>Any questions?</span>
                Please, <a href="mailto:sales@onlyoffice.com">submit your request here</a>.
            </div>
        </div>

        <footer>&copy; Ascensio System SIA 2020. All rights reserved.</footer>
    </form>
    <script src="Scripts/script.js"></script>
</body>
</html>
