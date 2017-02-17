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

        var errorMsg = $("#ErrorHiddenField").val();
        
        if (errorMsg){
            toastr.error(errorMsg, "An error has occurred.");
            $("#ErrorHiddenField").val("");
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

            if (!$("#PredefinedScript").val().trim()) {
                toastr.error("Empty Script", "An error has occurred.");
                return;
            }

            $("#GenerateButton").click();
        });

        $(".try-editor").on("click", function () {

            var data = {
                Type: $(this).attr("data-value").trim(),
                Name: $("#NameText").val().trim(),
                Company: $("#CompanyText").val().trim(),
                Title: $("#TitleText").val().trim()
            };

            if (!data.Type) {
                toastr.error("Empty Document Type", "An error has occurred.");
                return;
            } else {
                $("#DocumentTypeHiddenField").val(data.Type);
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

            $("#CreateButton").click();
        });
    }

    return {
        init: init
    };

})();