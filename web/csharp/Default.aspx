<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="DocumentBuilder._Default" %>

<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <div class="main-panel">
        <span class="portal-name">ONLYOFFICE Document Builder – Welcome!</span>
        <span class="portal-descr">Get started with a demo-sample of ONLYOFFICE Document Builder. You may upload your own script for documents using the <b>Upload script</b> button and selecting the necessary file on your PC.</span>
        <div class="help-block">
            <span>Generate a document from the script below, edit it or upload your own script</span>
            <p>Use the script in the textarea below as is to generate the document or you edit it in the textarea window. Or, in case you have a script of your own, use the button under the textarea to upload it.</p>
            <div class="clearFix">
                <asp:TextBox ID="PredefinedScript" runat="server" TextMode="multiline"></asp:TextBox>
                <div class="upload-panel clearFix">
                    <a class="file-upload">
                        Upload your own script
                        <asp:FileUpload ID="FileUpload" runat="server" />
                        <asp:Button ID="UploadButton" runat="server" OnClick="UploadButton_Click" CssClass="hidden" />
                    </a>
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
                            <a class="try-editor document reload-page" data-value="<%=((int)DocumentBuilder.Enums.DocumentType.Docx)%>">Create<br />
                                Document
                            </a>
                        </li>
                        <li>
                            <a class="try-editor spreadsheet reload-page" data-value="<%=((int)DocumentBuilder.Enums.DocumentType.Xlsx)%>">Create<br />
                                Spreadsheet
                            </a>
                        </li>
                        <li>
                            <a class="try-editor presentation reload-page" data-value="<%=((int)DocumentBuilder.Enums.DocumentType.Pdf)%>">Create<br />
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
</asp:Content>
