$(document).ready(function() {
    runOnLoad();

    // enlarge on clicking card (if never clicked before)
    $(".card").click(function(){ 
        let enlargeStatus = checkClassClick();

        // if the card has not been clicked before: status = false
        if (enlargeStatus === false) {
            $(this).addClass("cardclick"); //changing feature
            $("#questions").addClass("clicked noDetect");
            $(this).parent().addClass("forward")
        }
        $("#background").show();
    });

    // deflate when clicking body (if clicked before) go back to normal =>"works"
    $("html").click(function(){ 
        let enlargeStatus = checkClassClick();
        let noDetectPresence = checknoDetect4BG();

        // if the card has been clicked before: status = true
        if (enlargeStatus && !noDetectPresence) {
            $(".cardclick").removeClass("cardclick");
            $("#questions").removeClass("clicked");
            $(".container").removeClass("forward")
            $("#background").hide();
        } else{
            $("#questions").removeClass("noDetect");
        }
    });
});


function checkClassClick() {
    return $("#questions").attr("class").includes("clicked");
}

function checknoDetect4BG() {
    return $("#questions").attr("class").includes("noDetect");
}

function runOnLoad() {
    $("#background").hide(); //hides the bg automatically.

}
