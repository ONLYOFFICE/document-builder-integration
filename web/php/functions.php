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
    require_once('config.php' );

    function GenerateDocument($builderScript) {

        preg_match('/builder.SaveFile\s*\(\s*"(.*)"\s*,\s*"(.*)"\s*\)/', $builderScript, $matches);
        $pieces = explode('"', $matches[0]);
        $filePath = $matches[2];
        $fileName = basename($filePath);
        $doctype = $matches[1];

        $hash = rand();
        $inputFilePath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'input.' . $hash . ".docbuilder";
        $outputFilePath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'output.' . $hash . "." . $fileName;

        $builderScript = str_replace($filePath, $outputFilePath, $builderScript);

        $inputFile = fopen($inputFilePath, "w+");
        fwrite($inputFile, $builderScript);
        fclose($inputFile);

        BuildFile($inputFilePath, $outputFilePath);

        return $outputFilePath;
    }

    function CreateDocument($name, $company, $title, $format) {
        $hash = rand();
        $inputFilePath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'input.' . $hash . ".docbuilder";
        $outputFilePath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'output.' . $hash . "." . $format;

        $templatePath = $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . $format . '.docbuilder';
        $templateText = file_get_contents($templatePath);

        $templateText = str_replace('${Name}', $name, $templateText);
        $templateText = str_replace('${Company}', $company, $templateText);
        $templateText = str_replace('${Title}', $title, $templateText);
        $templateText = str_replace('${DateTime}', date("Y/m/d"), $templateText);
        $templateText = str_replace('${OutputFilePath}', $outputFilePath, $templateText);

        $inputFile = fopen($inputFilePath, "w+");
        fwrite($inputFile, $templateText);
        fclose($inputFile);

        BuildFile($inputFilePath, $outputFilePath);

        return $outputFilePath;
    }

    function BuildFile($inputFilePath, $outputFilePath) {
        if (!isset($inputFilePath) || !file_exists($inputFilePath)) {
            throw new Exception ("An error has occurred. Source File not found");
        }

        exec($GLOBALS['builder_path'] . " " . $inputFilePath . " 2>&1", $output);
        if (count($output) !== 0) {
            throw new Exception (json_encode($output));
        }

        if (!file_exists($outputFilePath)) {
            throw new Exception ("An error has occurred. Result File not found :" . $outputFilePath);
        }
    }
?>