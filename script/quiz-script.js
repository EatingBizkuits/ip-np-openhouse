let questionList = 0; 
let Scores = [0, 0, 0, 0];
let changeX;
let changeY;
let scoresArray = [];
let display;
let question;   // holds questions
let answers;
let points;

const APIKEY = "6211293b34fd62156585881b";
const url = "https://ipproj-40b5.restdb.io/rest/accounts";
const halfX = window.innerWidth/2;
const halfY = window.innerHeight/2;
const courseName = ["IM", "CSF", "DS", "IT"]
const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]



$(document).ready(function() {   
    runOnLoad();

    $(".submit").click(function(){
        const chosen = JSON.stringify($(".container .cardclick").html());
        runOnSubmit(chosen[22]);
    });

    // enlarge on clicking card (if never clicked before)
    $(document).on("click", ".card", function(){ 
        let enlargeStatus = checkClassClick();

        // if the card has not been clicked before: status = false
        if (enlargeStatus === false) {
            // $(this).addClass("cardclick"); //changing feature
            $(this).addClass("cardclick")
            

            $("#questions").addClass("clicked noDetect");
            $(this).parent().addClass("forward");
        }
        $("#background").show();
        $(".submit").show();
    });

    // deflate when clicking body (if clicked before) go back to normal =>"works"
    $(document).on("click", "html", function(){ 
        let enlargeStatus = checkClassClick();
        let noDetectPresence = checknoDetect4BG();

        // if the card has been clicked before: status = true
        if (enlargeStatus && !noDetectPresence) {
            $(".cardclick").removeClass("cardclick");

            $("#questions").removeClass("clicked");
            $(".container").removeClass("forward");
            $("#background").hide();
            $(".submit").hide();
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

function readTextFile(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function runOnLoad() {
    $("#background").hide(); //hides the bg automatically.
    $(".submit").hide();
    
    runOnSubmit(false);
}

function runOnSubmit(cardSelected) {
    readTextFile("assets/quizQn.json", function(text){
        const data = JSON.parse(text);
        
        questionList ++;
        console.log("qnnum" + questionList);
        
        if (questionList >= 11) {  // handles end of quiz
            console.log("fini" + Scores)
            let topScore = arrayMax(Scores);
                    
            $(".cards").hide();
            // $(".question").hide();

            const bestCourse = courseName[Scores.indexOf(topScore)];

            //display test result

            // $("#answer").html("<h1 class = 'answer'> Your Course is: " 
            //         + bestCourse 
            //         +"</h1>")
            // push into db

            insertIntoDB(bestCourse);
        } else {

            // insert score calc here start
            scoreCalc(cardSelected);
            // insert score calc here end

            console.log(Scores);  // recorded scores
            display = "question" + questionList;
            question = data[0][display][0];
            answers = data[0][display][1];
            points = data[0][display][2];

            // console.log(cardSelected + " <==> " + typeof(cardSelected))
            // for scoring system, IM, CSF, DS, IT

            $("main").empty();
            $("#questions").empty();
            $("#questions").append(question)
            
            for (let counting=0; counting<Object.keys(answers).length; counting++){          
                $("main").append("<div class='container'><div class='card'><div class='content "
                + (counting + 1)
                + "'><h2>"
                + "0" + (counting + 1)
                +"</h2><h3>" 
                + answers["Answer" + String(counting + 1)]
                + "</h3></div></div></div>")
            }
        }
    });
}

function arrayRemove(array, toRemove) 
{ 
    return array.filter(function(element){ 
        return element != toRemove; 
    });
}

function scoreCalc(cardSelected) 
{
    if (typeof(cardSelected) == "string") { // after second round
        scoresArray = [];

        console.log("ptd" + JSON.stringify(points))

        let dictn = JSON.stringify(points).split("\"");
        let posAccept;

        console.log(dictn);

        for (let i = 0; i < 2; i++) {  // run again to prevent issues
            for (let counter = 0; counter < dictn.length; counter++) {  // accepts scores only
                posAccept = dictn[counter].indexOf(":");
                if (posAccept == -1) {    
                    dictn = arrayRemove(dictn, dictn[counter]);
                }
            }
        }
        
        console.log("dd" + dictn);

        let tempArray = [];
        let ptElem = "";
        for (counter = 0; counter < dictn.length; counter++) {
            for (let ele = 0; ele < dictn[counter].length; ele++) {
                if (dictn[counter][ele] in nums){
                    ptElem += String(dictn[counter][ele]);
                } else if (dictn[counter][ele] === ",") {
                    tempArray.push(ptElem);
                    ptElem = "";
                } else if (dictn[counter][ele] === "]") {
                    tempArray.push(ptElem)
                    scoresArray.push(tempArray);
                    tempArray = [];
                    ptElem = "";
                    break;
                }
            }
        }


        console.log("s3 == " + scoresArray);

        const answerSelected = parseInt(cardSelected);
        console.log(answerSelected + " selected == " + scoresArray[answerSelected - 1]);
        const chosenScoresFINAL = scoresArray[answerSelected - 1]
        let tempFinalScore = [];  // no refresh needed as tempArray is destroyed after iteration
        let tempNum = 0;
        for (let i = 0; i < chosenScoresFINAL.length; i++) {
            tempNum += parseInt(Scores[i]);
            tempNum += parseInt(chosenScoresFINAL[i]);

            console.log(tempNum);
            tempFinalScore.push(tempNum);
            tempNum *= 0;
        }
        
        Scores = tempFinalScore;  // replaces recorded score with newly calculated
    }
}

function arrayMax(numArray) {
    return Math.max.apply(null, numArray);
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

function insertIntoDB(quizResult) {
    lottieAnim();
    let cookies = getCookie("loginID");
    console.log(cookies);
    if (cookies == "") {
        console.log("no stored cookies");
        return 0
    } else {
        cookies = cookies.split(",")
    }

    let jsondata = {
        "course": quizResult
    };

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": url + "/" + String(cookies[0]),
        "method": "PUT",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
    }
    
    $.ajax(settings).done(function (response) {
        // lottieFade(); return to main page
        $(location).attr("href", "./profile_completed.html");
    });    
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