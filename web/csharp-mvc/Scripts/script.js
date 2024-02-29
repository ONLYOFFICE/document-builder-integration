/**
 *
 * (c) Copyright Ascensio System SIA 2024
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