<%@ Page Title="Home Page" Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="DocumentBuilder._Default" %>

<!DOCTYPE html>
<html lang="en">
<head id="Head1" runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>ONLYOFFICE Document Builder</title>
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans:900,800,700,600,500,400,300&subset=latin,cyrillic-ext,cyrillic,latin-ext" />
    <link href="~/Content/site.css" rel="stylesheet" />
    <link href="~/Content/toastr.css" rel="stylesheet" />
    <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
</head>
<body>
    <form id="Form1" runat="server">
        <header>
            <img src="Images/logo.png" alt="ONLYOFFICE" />
        </header>
        <div class="main-panel">
            <span class="portal-name">ONLYOFFICE Document Builder – Welcome!</span>
            <span class="portal-descr">Get started with a demo-sample of ONLYOFFICE Document Builder. You may upload your own script for documents using the <b>Upload script</b> button and selecting the necessary file on your PC.</span>
            <div class="help-block">
                <span>Generate a document from the script below, edit it or upload your own script</span>
                <p>Use the script in the textarea below as is to generate the document or you edit it in the textarea window. Or, in case you have a script of your own, use the button under the textarea to upload it.</p>
                <div class="clearFix">
                    <asp:TextBox ID="PredefinedScript" runat="server" TextMode="multiline"></asp:TextBox>
                    <div class="upload-panel clearFix">
                        <a id="builderFileLink" class="file-upload">Upload your own script</a>
                        <input type="file" id="builderFile" />

                        <div class="generate-button-upload">
                            <a class="button-white" id="GenerateBtn">Generate document</a>
                            <asp:Button ID="GenerateButton" runat="server" OnClick="GenerateButton_Click" CssClass="hidden" />
                        </div>
                        <p>Visit <a target="_blank" href="http://helpcenter.onlyoffice.com/developers/document-builder/index.aspx">ONLYOFFICE Document Builder documentation</a> for more script examples.</p>
                    </div>
                    <div class="create-panel clearFix">
                        <span>Or create a new file from a sample script with your own data</span>
                        Fill the data into the text areas below so that it could appear in the output document. Or leave it blank, in this case the default values (now shown as watermarks in the text area) will be added to the resulting document.

                    <ul class="try-editor-list clearFix">
                        <li>
                            <a class="try-editor document reload-page" data-value="docx">Create<br />
                                Document
                            </a>
                        </li>
                        <li>
                            <a class="try-editor spreadsheet reload-page" data-value="xlsx">Create<br />
                                Spreadsheet
                            </a>
                        </li>
                        <li>
                            <a class="try-editor presentation reload-page" data-value="pdf">Create<br />
                                PDF
                            </a>
                        </li>
                    </ul>

                        <div class="own-data-enter">
                            <label>Name: </label>
                            <asp:TextBox ID="NameText" runat="server" CssClass="input"></asp:TextBox>
                            <label>Company: </label>
                            <asp:TextBox ID="CompanyText" runat="server" CssClass="input"></asp:TextBox>
                            <label>Position/Title: </label>
                            <asp:TextBox ID="TitleText" runat="server" CssClass="input"></asp:TextBox>
                            <asp:HiddenField ID="DocumentTypeHiddenField" runat="server" />
                            <asp:Button ID="CreateButton" runat="server" OnClick="CreateButton_Click" CssClass="hidden" />
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
        <asp:HiddenField ID="ErrorHiddenField" runat="server" />

        <footer>&copy; Ascensio Systems Inc 2016. All rights reserved.</footer>
    </form>
    <script src="Scripts/jquery-1.8.2.js"></script>
    <script src="Scripts/toastr.js"></script>
    <script src="Scripts/script.js"></script>
    <script>
        function onfailure(error) {
            alert("Error: " + error.get_message() + "; " +
                "Stack Trace: " + error.get_stackTrace() + "; " +
                "Status Code: " + error.get_statusCode() + "; " +
                "Exception Type: " + error.get_exceptionType() + "; " +
                "Timed Out: " + error.get_timedOut());
        }

        $(function () {
            DocumentBuilder.init();
        });
    </script>
</body>
</html>
