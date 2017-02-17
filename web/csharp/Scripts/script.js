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
            $("#GenerateButton").click();
        });

        $(".try-editor").on("click", function () {
            $("#DocumentTypeHiddenField").val($(this).attr("data-value"));

            $("#CreateButton").click();
        });
    }

    return {
        init: init
    };

})();