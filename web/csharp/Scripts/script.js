var DocumentBuilder = (function () {

    function init() {

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
    }

    return {
        init: init
    };

})();