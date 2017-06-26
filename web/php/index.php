<?php
/*
 *
 * (c) Copyright Ascensio System Limited 2010-2017
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
?>

<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);

    include('exec.php');
?>
<!DOCTYPE html>
<html>
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width"/>
    <title>ONLYOFFICE Document Builder</title>
    <link href="images/favicon.ico" rel="shortcut icon" type="image/x-icon"/>
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans:900,800,700,600,500,400,300&subset=latin,cyrillic-ext,cyrillic,latin-ext"/>
    <link rel="stylesheet" type="text/css" href="css/style.css"/>
    <script type="text/javascript" src="js/jquery-1.9.0.min.js"></script>
    <script type="text/javascript" src="js/jquery-ui.min.js"></script>
    <script type="text/javascript" src="js/jquery.fileupload.js"></script>


    <!--<link rel="stylesheet" type="text/css" href="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.css"/>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>-->

</head>
<body>
    <header>
        <a href="/">
            <img src="images/logo.png" alt="ONLYOFFICE"/>
        </a>
    </header>
    <div class="main-panel">
        <span class="portal-name">ONLYOFFICE Document Builder – Welcome!</span>
        <span class="portal-descr">Get started with a demo-sample of ONLYOFFICE Document Builder. You may upload your own script for documents using the <b>Upload script</b> button and selecting the necessary file on your PC.</span>

        <div class="help-block">
            <span>Generate a document from the script below, edit it or upload your own script</span>
            <p>Use the script in the textarea below as is to generate the document or you edit it in the textarea window. Or, in case you have a script of your own, use the button under the textarea to upload it.</p>
            <div class="clearFix">

                <form action="" name="load_and_build" method="post" enctype="multipart/form-data">
                    <div class="error-message"><?php echo $ErrorMessage; ?></div>
                    <textarea id="predefinedScript" name="predefinedScript"><?php echo file_get_contents('assets/sample.docbuilder'); ?></textarea>
                    <div class="upload-panel clearFix">
                        <a id="builderFileLink" class="file-upload">Upload your own script </a>
                        <input type="file" id="builderFile" name="files" data-url="upload.php" />
                        <div class="generate-button-upload">
                            <a class="button-white" onclick="jq('#sample').click()">Generate document</a>
                            <input type="submit" id="sample" name="sample" class="hidden" value="Generate Document">
                        </div>


                        <p>Visit <a target="_blank" href="http://helpcenter.onlyoffice.com/developers/document-builder/index.aspx">ONLYOFFICE Document Builder documentation</a> for more script examples.</p>
                    </div>
                </form>


                <div class="create-panel clearFix">
                    <span>Or create a new file from a sample script with your own data</span>
                    Fill the data into the text areas below so that it could appear in the output document. Or leave it blank, in
                    this case the default values (now shown as watermarks in the text area) will be added to the resulting document.

                    <form action="" method="post">
                        <ul class="try-editor-list clearFix">
                            <li>
                                <a class="try-editor document reload-page" target="_blank" onclick="jq('#docx').click()">Create
                                  <br/>
                                  Document</a>
                                <input type="submit" id="docx" name="docx" class="hidden" value="docx">
                            </li>
                            <li>
                                <a class="try-editor spreadsheet reload-page" target="_blank" onclick="jq('#xlsx').click()">Create
                                  <br/>
                                  Spreadsheet</a>
                                <input type="submit" id="xlsx" name="xlsx" class="hidden" value="xlsx">
                            </li>
                            <li>
                                <a class="try-editor presentation reload-page" target="_blank" onclick="jq('#pdf').click()">Create
                                  <br/>
                                  PDF</a>
                                <input type="submit" id="pdf" name="pdf" class="hidden" value="pdf">
                            </li>
                        </ul>
                        <div class="own-data-enter">
                            <label>Name: </label>
                            <input type="text" name="input_name" placeholder="John Smith">
                            <label>Company: </label>
                            <input type="text" name="input_company" placeholder="ONLYOFFICE">
                            <label>Position/Title: </label>
                            <input type="text" name="input_title" placeholder="Commercial director">
                        </div>
                    </form>
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
    <footer>&copy; Ascensio Systems Inc <?php echo date("Y"); ?>. All rights reserved.</footer>

    <script type="text/javascript" src="js/jscript.js"></script>
</body>
</html>
