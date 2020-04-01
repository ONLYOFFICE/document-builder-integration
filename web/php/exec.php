<?php
/*
 *
 * (c) Copyright Ascensio System SIA 2020
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
    include('functions.php');

    $ErrorMessage = NULL;

    try {
        if (isset($_POST['docx'])) {

            Create("docx");

        } else if (isset($_POST['xlsx'])) {
            
            Create("xlsx");

        } else if (isset($_POST['pdf'])) {

            Create("pdf");

        } else if (isset($_POST['sample'])) {

            Generate();

        }
    } catch (Exception $e) {
        $ErrorMessage = json_encode($e->getMessage());
    }

    function Create($format) {
        $input_name = 'John Smith';
        if (isset($_POST['input_name'])) {
            $input_name = $_POST['input_name'];
            if ($input_name == '') {
                $input_name = 'John Smith';
            }
        }

        $input_company = 'ONLYOFFICE';
        if (isset($_POST['input_company'])) {
            $input_company = $_POST['input_company'];
            if ($input_company == '') {
                $input_company = 'ONLYOFFICE';
            }
        }
        $input_title = 'Commercial director';
        if (isset($_POST['input_title'])) {
            $input_title = $_POST['input_title'];
            if ($input_title == '') {
                $input_title = 'Commercial director';
            }
        }

        $filePath = CreateDocument($input_name, $input_company, $input_title, $format);

        $fileName = basename($filePath);
        $fileName = "Sample" . substr($fileName, strpos($fileName, ".", 7));

        ReturnFile($filePath, $fileName);
    }

    function Generate() {
        $builderScript = $_POST['predefinedScript'];

        $filePath = GenerateDocument($builderScript);

        $fileName = basename($filePath);
        $fileName = substr($fileName, 1 + strpos($fileName, ".", 7));

        ReturnFile($filePath, $fileName);
    }

    function ReturnFile($filePath, $fileName) {
        $docType = pathinfo($fileName, PATHINFO_EXTENSION);

        $doctypeHeader = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        if ($doctype == 'xlsx') {
            $doctypeHeader = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } else if ($doctype == 'pdf') {
            $doctypeHeader = 'application/x-pdf';
        } else if ($doctype == 'pptx') {
            $doctypeHeader = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        }

        header('Content-Description: File Transfer');
        header('Content-Type: ' . $doctypeHeader);
        header('Content-Disposition: attachment; filename="'. $fileName .'"');
        header('Content-Length: ' . filesize($filePath));

        ob_clean();
        flush();
        readfile($filePath);
        exit;
    }
?>