let hoverStatus = false; // transition state boolean
let clickStatus = true;  // clickable state boolean
let tabletSize = 800;
let secondCount = 2;
let firstTime = true;
let Counter = 0; // counter for course number

const courseRedirect = [
    "https://www.np.edu.sg/ict/Pages/cictp.aspx#",
    "https://www.np.edu.sg/ict/Pages/im.aspx#",
    "https://www.np.edu.sg/ict/Pages/ds.aspx#",
    "https://www.np.edu.sg/ict/Pages/csf.aspx",
    "https://www.np.edu.sg/ict/Pages/it.aspx#"
]

const courseInfo = [
    "<h2>Common ICT<br>programme (N98)</h2>\n<h3 class='aboutme'>Everything about IT</h3>\n<button class='submit CICTP'>Learn More about CICTP!</button>",
    "<h2>Immersive Media <br>(N55)<h2>\n<h3 class='aboutme'>UX/UI designing</h3>\n<button class='submit IM'>Learn More about IM!</button>",
    "<h2>Data science (N81)</h2>\n<h3 class='aboutme'>Data Analytics<br>and Statistics</h3>\n<button class='submit DS'>Learn More about DS!</button>",
    "<h2>Cybersecurity &<br>Digital forensics (N94)</h2>\n<h3 class='aboutme'>Protect your web</h3>\n<button class='submit CSF'>Learn More about CSF!</button>",
    "<h2>Information<br>technology (N54)</h2>\n<h3 class='aboutme'>Tech and Programming</h3>\n<button class='submit IT'>Learn More about IT!</button>"
];

$(document).ready(function() {
    cards_init();
    // for pc, hover event start

    $(document).on('click', "button.submit", function() {
        hoverStatus = true;
        clickStatus = false;
        let url = courseRedirect[Counter];

        window.open(url, '_blank');

        window.setTimeout(function() {
            hoverStatus = false;
            clickStatus = true;
        });
    })

    $(document).on("click", ".cards", function(){
        if (!hoverStatus) {  // if not in transition state
            $(".cards.focus").addClass("move")
            hoverStatus = true;
        } else {
            $("div.cards.focus").removeClass("move")
            hoverStatus = false
        }
    });
    
    // // for pc, hover event end

    $(document).on("click", ".back", function(){
        if (clickStatus) {
            clickStatus = false;
            $(".focus").addClass("shuffled").addClass("back").addClass("temp").removeClass("move").removeClass("focus")
            $(".back:not(.temp)").addClass("focus").removeClass("back")
            hoverStatus = true;
            window.setTimeout(function(){
                $(".shuffled").removeClass("shuffled");
            }, 200);
            
            if (Counter == 4) {
                Counter = 0
            } else {
                Counter += 1;
            }

            window.setTimeout(function (){
                hoverStatus = true;
                $(".temp").removeClass("temp");  
                swapData();
                $(".cards.focus").addClass("move")
                window.setTimeout(function (){
                    clickStatus = true;
                }, 200);
            }, 200)
        }
    });  
});

function cards_init() {
    let second = "course" + String(secondCount); //prevent animation from revealing

    $(".focus .img").addClass("course1");
    $(".back .img").addClass(second);
    $(".background .img").addClass("course3");

    $(".focus ins").html(courseInfo[0] + "<div class='instructions'> Click on Me to Start!</div>");
    $(".back ins").html(courseInfo[secondCount - 1]);
    // $(".background ins").html(courseInfo[5]);
}

function swapData() {

    if (firstTime) {
        secondCount += 1;
        firstTime = false;
    }

    let second = "course" + String(secondCount);
    let remove = "course" + String(secondCount -1);
    if (remove == "course0") {
        remove = "course5"
    }
    
    $(".back .contents .img").removeClass().addClass("img");
    
    $(".back .contents .img").addClass(second);
    $(".back ins").html("").html(courseInfo[secondCount - 1]);
    
    // console.log(secondCount + "w" + second)

    if (secondCount >= 5) {
        secondCount = 1;
    } else {
        secondCount += 1;
    }
}