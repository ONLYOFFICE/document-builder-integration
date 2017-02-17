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

        var errorMsg = $("#MainContent_ErrorHiddenField").val();
        
        if (errorMsg){
            toastr.error(errorMsg, "An error has occurred.");
            $("#MainContent_ErrorHiddenField").val("");
        }

        $("#MainContent_FileUpload").on("change", function () {

            var error = false;

            $.each(this.files, function () {
                if (!this.name) {
                    toastr.error("Error File Name Is Empty", "An error has occurred.");
                    error = true;
                    return;
                }

                var parts = this.name.split(".");
                var extension = parts[parts.length - 1];

                if (!extension || extension.toLowerCase() != "docbuilder") {
                    toastr.error("Error Invalid File Extension", "An error has occurred.");
                    error = true;
                }
            });

            if (error) return;

            $("#MainContent_UploadButton").click();

        });

        $("#GenerateBtn").on("click", function () {

            if (!$("#MainContent_PredefinedScript").val().trim()) {
                toastr.error("Empty Script", "An error has occurred.");
                return;
            }

            $("#MainContent_GenerateButton").click();
        });

        $(".try-editor").on("click", function () {

            var data = {
                Type: $(this).attr("data-value").trim(),
                Name: $("#MainContent_NameText").val().trim(),
                Company: $("#MainContent_CompanyText").val().trim(),
                Title: $("#MainContent_TitleText").val().trim()
            };

            if (!data.Type) {
                toastr.error("Empty Document Type", "An error has occurred.");
                return;
            } else {
                $("#MainContent_DocumentTypeHiddenField").val(data.Type);
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

            $("#MainContent_CreateButton").click();
        });
    }

    return {
        init: init
    };

})();