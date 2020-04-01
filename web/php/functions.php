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