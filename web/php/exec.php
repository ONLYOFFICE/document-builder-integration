<?php
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