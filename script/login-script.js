let loginStatus = true; // true is login, false is register
let swapButtonClick = true;
let submitAllowed = true; // true submit activated, false submit deactivated
let returnResponse = false;

const url = "https://ipproj-40b5.restdb.io/rest/accounts";
const APIKEY = "6211293b34fd62156585881b";

$(document).ready(function() {
    startAnims();
    
    checkCookie();

    $(document).on("click", ".btn-p", function(){
        
        if (swapButtonClick) {  // prevents animation click error
            swapButtonClick = false;
            // opens the register page or vice versa
            let innerCard = $(this).parents(".inner-box");
            if (loginStatus) {
                innerCard.css("transition", "transform 1s").css("transform", "rotateY(-180deg)").css("animation", "bg-animation 2s forwards");
                loginStatus = false;
                window.setTimeout(function() { 
                    swapButtonClick = true;  // reactivates button after anim
                }, 1000);
            } else {
                innerCard.css("transition", "transform 3.5s").css("animation", "bg-animation 3s reverse").css("transform", "rotateY(360deg)");
                $(".register").addClass("tempColor");

                loginStatus = true;
                window.setTimeout(function() { 
                    innerCard.removeAttr("style");
                    $(".register").removeClass("tempColor");
                    swapButtonClick = true; // reactivates button after anim
                }, 3020);
            }
        }
    });
    
    // prevents the usage of spaces
    $("input").on({
        keydown: function(e) {
          if (e.which === 32)
            return false;
        },
        change: function() {
          this.value = this.value.replace(/\s+/g, "");

        //   replaces spaces with empty
        }
    });
    // prevents the usage of spaces


    // submit for login start
    $(document).on("click", "#submit-button", function(e) {
        
        // check if the input params are empty

        let inputUN = $("#username").val();
        let inputPW = $("#password").val();

        if (inputUN.length === 0 || inputPW.length === 0) {
            alertShow("alert: inputs are empty", 2000)
            return false
        }

        // input param checker false

        let detailsChecked = false;
        
        if (submitAllowed) {
            submitAllowed = false;
            
            loadingAnim();

            e.preventDefault(); 

            let settings = {
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "GET",
                "headers": {
                "content-type": "application/json",
                "x-apikey": APIKEY,
                "cache-control": "no-cache"
                },
            }

            $.ajax(settings).done(function (response) {
                for (let i = 0; i < response.length; i++) {
                    extractedUN = `${response[i].username}`;
                    extractedPW = `${response[i].password}`;

                    let result = comparison(inputUN, extractedUN)

                    if (result) {
                        // if username has been validated
                        result = comparison(inputPW, extractedPW)
                        if (result) {
                            // if password has been validated, allow access
                            detailsChecked = true;
                            $(location).attr("href", "./profile_completed.html");

                            // store a cookie
                            let rememberStatus = $("#chkbox").prop("checked")
                            setCookie("loginID", response[i]._id + "," + String(rememberStatus), 1);
                            console.log("baked a cookie!");

                        } else {
                            alertShow("alert: Wrong Username/Password", 5000) // show error message when ready
                        }
                    } else {
                        alertShow("alert: Wrong Username/Password", 5000) // show error message when ready
                    }
                }

                // handle animation 
                window.setTimeout(function() {
                    $(".lottie").fadeOut(1500);
                    if (!detailsChecked) {  // prevents screen refresh when logged in
                        window.setTimeout(function(){
                            $(".bg-login").removeAttr("style");
                        }, 500);  // timeout used as style does not get removed sometimes
                        window.setTimeout(function(){
                            $(".bg-login").removeAttr("style");  // safety
                            submitAllowed = true;
                        }, 2500);
                    }
                }, 700);

                if (detailsChecked) {  // hides login screen when logged in
                    $(".bg-login").hide();
                }
            });
        }
    });
     // submit for login end

    // submit for register start
    $(document).on("click", ".register .submit-btn", function(e) {
        // check input params start

        // get inputs
        let registerUN = $(".input-box.UN").val();
        let registerPW = $(".input-box.PW").val();
        let registerRPW = $(".input-box.RPW").val();

        //check if input points are empty
        if (registerUN.length === 0 || registerPW.length === 0 || registerRPW.length === 0) {
            alertShow("alert: inputs are empty", 2000)
            return false
        } // no empty inputs allowed

        if (registerPW != registerRPW) {
            alertShow("alert: passwords are not same", 2000)
            return false
        } // passwords should be the same

        // check input params end
        
        let detailsChecked = false;

        if (submitAllowed) {
            submitAllowed = false;
            
            e.preventDefault(); 
            
            loadingAnim();

            let settings = {
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "GET",
                "headers": {
                "content-type": "application/json",
                "x-apikey": APIKEY,
                "cache-control": "no-cache"
                },
            }
        

            $.ajax(settings).done(function getCall(response) {
                for (let i = 0; i < response.length; i++) {
                    if (registerUN == (`${response[i].username}`)) {
                        returnResponse = false;
                        break // username is already used
                    } else {
                        returnResponse = true; // username free to use
                    }
                } 
            }).done(function(){
                if (returnResponse) {
                    let jsondata = {
                        "username": registerUN,
                        "password": registerPW,
                        "course": "none"
                    };

                    let settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": url,
                        "method": "POST",
                        "headers": {
                            "content-type": "application/json",
                            "x-apikey": APIKEY,
                            "cache-control": "no-cache"
                        },
                        "processData": false,
                        "data": JSON.stringify(jsondata),
                        "beforeSend": function(){
                            console.log("db pushed");
                            // $("#contact-submit").prop( "disabled", true);
                            // $("#add-contact-form").trigger("reset");
                        },
                        "processData": false,
                        "data": JSON.stringify(jsondata)
                    }
                    
                    $.ajax(settings).done(function (response) {
                        detailsChecked = true;
                    });


                } else {
                    // if username is already used
                    alertShow("alert: Username has already been taken", 5000);
                }

                // handle animation 
                window.setTimeout(function() {
                    $(".lottie").fadeOut(1500);
                    window.setTimeout(function(){
                        $(".bg-login").removeAttr("style");
                        submitAllowed = true;
                        
                        // switch to login screen when bg returns
                        if (detailsChecked) {  
                            window.setTimeout(function(){
                                returnResponse = false;
                                $(".inner-box").css("transition", "transform 3.5s").css("animation", "bg-animation 3s reverse").css("transform", "rotateY(360deg)");
                                $(".register").addClass("tempColor");
                                swapButtonClick = true;
                            }, 400);
                        }  // switch to login screen when bg returns
                    }, 500);
                }, 700);
            });
        }
    });
    // submit for register end
});


// function calls 
function startAnims () {
    $("#alertHead").hide();
    $(".lottie").hide();
    let toCheck = $("form").children();
    let toCheck2 = $(".login").children();

    for (let i = 0; i < toCheck.length; i++) {
        let toHide = toCheck[i].id;
        $("#" + toHide).hide();
    }

    for (let i = 0; i < toCheck2.length; i++) {
        let toHide = toCheck2[i].id;
        $("#" + toHide).hide();
    }

    // cascading animation effect
    $("#title").show().addClass('fade-from-left');
    window.setTimeout(function() { 
        $("#username").show().addClass('fade-from-left');
        window.setTimeout(function() { 
            $("#password").show().addClass('fade-from-left');
            window.setTimeout(function() { 
                $("#submit-button").show().addClass('fade-from-right');
                window.setTimeout(function() { 
                    $("#chkbox").show().addClass('fade-from-right');
                    window.setTimeout(function() { 
                        $("#chkbox-txt").show().addClass('fade-from-left');
                        window.setTimeout(function() { 
                            $("#toRegister").show().addClass('fade-from-left');
                        }, 0);
                    }, 300);
                }, 200);
            }, 200);
        }, 200);
    }, 300);
}

function comparison(a, b) {
    return a == b
}

function loadingAnim() {
    $(".lottie").show();
    $(".loadAnims").addClass("skewed");
    window.setTimeout(function(){
        $(".bg-login").hide()
    }, 700);
}

function hideAlert() {
    $("#alertHead").fadeOut(1000);
}

function alertShow(displayText, timeOut) {
    $("#alertHead").show().addClass("drop-from-top");
    $("#alertHead").html(displayText);
    setTimeout(hideAlert, timeOut);
}

function checkCookie() {
    
    const rawCookie = getCookie("loginID");

    let cookie;
    // console.log(rawCookie);

    if (rawCookie == "") {
        console.log("no cookie")
        return 0
    } else {
        cookie = rawCookie.split(",");
    }

    if (cookie[1] === "true") {
        loadingAnim();

        let settings = {
            "async": true,
            "crossDomain": true,
            "url": url + "/" + cookie[0],
            "method": "GET",
            "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
            },
        }

        $.ajax(settings).done(function (response) {
            let extractedUN = `${response.username}`;
            let extractedPW = `${response.password}`;
            $("#username").attr("value", extractedUN);
            $("#password").attr("value", extractedPW);
            $("#chkbox").attr("checked", true);

            window.setTimeout(function() {
                $(".lottie").fadeOut(1500);
                window.setTimeout(function(){
                    $(".bg-login").removeAttr("style");
                    submitAllowed = true;
                }, 500);
            }, 700);
        });
    }
}

function setCookie(cookieKey, value, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cookieKey + "=" + value + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
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
