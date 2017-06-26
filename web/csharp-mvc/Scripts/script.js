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

var ActionUrl = {
    Upload: null,
    Generate: null,
    Create: null,
    Download: null
};

var DocumentBuilder = (function () {

    function init() {
        setBindings();
    }

    function setBindings() {

        $("#fileUploadBtn").on("change", function () {
            var data = new window.FormData();

            var error = false;

            $.each(this.files, function () {
                if (!this.name) {
                    toastr.error("Error File Name Is Empty", "An error has occurred.");
                    error = true;
                }

                var parts = this.name.split(".");
                var extension = parts[parts.length - 1];

                if (!extension || extension.toLowerCase() != "docbuilder") {
                    toastr.error("Error Invalid File Extension", "An error has occurred.");
                    error = true;
                }

                data.append(this.name, this);
            });

            if (error) return;

            fileChange(data);
        });

        $("#generateBtn").on("click", function() {

            var data = {
                Script: $("#predefinedScript").val().trim()
            };

            if (!data.Script) {
                toastr.error("Empty Script", "An error has occurred.");
                return;
            }

            generateDocument(data);
        });

        $(".try-editor").on("click", function () {

            var data = {
                Type: $(this).attr("data-value").trim(),
                Name: $("#name").val().trim(),
                Company: $("#company").val().trim(),
                Title: $("#title").val().trim()
            };

            if (!data.Type) {
                toastr.error("Empty Document Type", "An error has occurred.");
                return;
            }
            
            if (!data.Name) {
                toastr.error("Empty Name Field", "An error has occurred.");
                return;
            }
            
            if (!data.Company) {
                toastr.error("Empty Company Field", "An error has occurred.");
                return;
            }
            
            if (!data.Title) {
                toastr.error("Empty Title Field", "An error has occurred.");
                return;
            }

            createDocument(data);
        });
    }

    function fileChange(postedData) {
        $.ajax({
            url: ActionUrl.Upload,
            type: "POST",
            data: postedData,
            dataType: "json",
            contentType: false,
            processData: false,
            error: function (error) {
                toastr.error(error.message, "An error has occurred.");
            },
            success: function (data) {
                if (data.success) {
                    $("#predefinedScript").val(data.message);
                } else {
                    $("#predefinedScript").val("");
                    toastr.error(data.message, "An error has occurred.");
                }
            }
        });

        return false;
    }

    function generateDocument(postedData) {
        $.ajax({
            url: ActionUrl.Generate,
            type: "POST",
            data: postedData,
            dataType: "json",
            error: function (error) {
                toastr.error(error.message, "An error has occurred.");
            },
            success: function (data) {
                if (data.success) {
                    window.location = ActionUrl.Download + "?filePath=" + data.message;
                } else {
                    toastr.error(data.message, "An error has occurred.");
                }
            }
        });
    }

    function createDocument(postedData) {
        $.ajax({
            url: ActionUrl.Create,
            type: "POST",
            data: postedData,
            dataType: "json",
            error: function (error) {
                toastr.error(error.message, "An error has occurred.");
            },
            success: function (data) {
                if (data.success) {
                    window.location = ActionUrl.Download + "?filePath=" + data.message;
                } else {
                    toastr.error(data.message, "An error has occurred.");
                }
            }
        });
    }

    return {
        init: init
    };

})();