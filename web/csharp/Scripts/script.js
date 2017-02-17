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

        $("#builderFileLink").on("click", function (e) {
            e.preventDefault();
            $("#builderFile").click();
        });

        $("#builderFile").on("change", function (e) {
            var input = e.target;

            var reader = new FileReader();
            reader.onload = function () {
                var text = reader.result;
                $("#PredefinedScript").text(text);
            };
            reader.readAsText(input.files[0]);
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