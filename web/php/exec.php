<?php
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