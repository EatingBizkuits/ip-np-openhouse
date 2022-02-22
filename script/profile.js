const APIKEY = "6211293b34fd62156585881b";
const url = "https://ipproj-40b5.restdb.io/rest/accounts";
const courseRedirect = {
    "CSF" : "https://www.np.edu.sg/ict/Pages/csf.aspx",
    "DS" : "https://www.np.edu.sg/ict/Pages/ds.aspx#",
    "IM" : "https://www.np.edu.sg/ict/Pages/im.aspx#",
    "CICTP" : "https://www.np.edu.sg/ict/Pages/cictp.aspx#",
    "IT " : "https://www.np.edu.sg/ict/Pages/it.aspx#"
}

const courseTitle = {
    "CSF": "Cybersecurity & Digital Forensics",
    "DS" : "Data Science",
    "IM" : "Immersive Media",
    "CICTP" : "Common ICT Programme",
    "IT" : "Information Techology"
}

let keptLink;
let blankStatus = false; // disables the .click function

$(document).ready(function() {
    GETrequest();

    $(document).on("click", "a.cta", function(){
        if (blankStatus){
        window.open(keptLink, '_blank');
        }
    });

});

function GETrequest() {
    lottieAnim();
    let cookies = getCookie("loginID");
    console.log(cookies);
    if (cookies == "") {
        console.log("no stored cookies");
        return 0
    } else {
        cookies = cookies.split(",")
    }

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": url + "/" + String(cookies[0]),
        "method": "GET",
        "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
        },
    }

    $.ajax(settings).done(function getCall(response) {
        console.log(response);
        let courseShort = response.course;
        $("#main h3").html("").html(response.username)
        if (courseShort != "none") {
            let course = courseTitle[courseShort];
            $("#main h4").html("").html(course);
            $(".cta").html("").html("Learn More about " + courseShort)
            keptLink = courseRedirect[String(response.course)];
            blankStatus = true;
        } else {
            $("#main h4").html("").html("Discover your course!")
            $(".cta").attr("href", "./quiz.html");

        }
        lottieFade();
    });
}

function setCookie(cookieKey, value, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cookieKey + "=" + value + ";" + expires + ";path=/";
}

function getCookie(cookieKey) {
    let name = cookieKey + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function lottieFade() {
    window.setTimeout(function() {
        $(".lottie").fadeOut(1500);
        window.setTimeout(function(){
            $("nav").removeAttr("style");
            $("#navigation").removeAttr("style");
            $("#main").removeAttr("style");
            $(".loadAnims").removeClass("skewedFirst");
            submitAllowed = true;
        }, 500);
    }, 700);
}

function lottieAnim() {
    $(".lottie").show();
    $(".loadAnims").addClass("skewed");
    window.setTimeout(function(){
        $("nav").hide();
        $("#navigation").hide();
        $("#main").hide();
    }, 700);
}