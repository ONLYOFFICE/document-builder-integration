<?php
    /**
     *
     * (c) Copyright Ascensio System SIA 2023
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