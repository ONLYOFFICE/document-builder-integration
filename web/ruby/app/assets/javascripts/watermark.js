$(document).ready(function () {
    $(":input[data-watermark]").each(function () {
        $(this).val($(this).attr("data-watermark"));
        $(this).css("color","#a8a8a8");
        $(this).bind("focus", function () {
            if ($(this).val() == $(this).attr("data-watermark")) $(this).val('');
            $(this).css("color","#000000");
        });
        $(this).bind("blur", function () {
            if ($(this).val() == '') 
            {
                $(this).val($(this).attr("data-watermark"));
                $(this).css("color","#a8a8a8");
            }
            else
            {
                $(this).css("color","#000000");
            }
        });
    });
});