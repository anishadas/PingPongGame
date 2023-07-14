let rod1 = document.getElementById("user1rod");
let rod2 = document.getElementById("user2rod");
let game = document.getElementById("game");
let ball = document.getElementById("ball");
let user1score = document.getElementById("user1score");
let user2score = document.getElementById("user2score");
let counter = document.getElementById("time");
let count = 15;
let interval;
let requestId;
let record = JSON.parse(localStorage.getItem("record")) || [];
let apressed = false;
let dpressed = false;
document.addEventListener('keydown', handlekeydown);
document.addEventListener('keyup', handlekeyUp);
function handlekeydown(e) {
    if (e.key == "Enter") {
        count = 15;
        console.log("local", record.length);
        record.length == 0 ? alert("you are playing the first time") : alert(`${record[0].name} has scored highest: ${record[0].maxScore}`);
        interval = setInterval(() => {
            count -= 1;
            counter.innerHTML = count;
        }, 1000);
        continuousGameLoop();
    }
    if (e.key == "a") {
        apressed = true;
    } else if (e.key == "d") {
        dpressed = true
    }
}

function handlekeyUp(e) {
    if (e.key == "a") {
        apressed = false;
    } else if (e.key == "d") {
        dpressed = false
    }
}

function reset() {
    ball.style.top = "50%";
    ball.style.left = "50%";
    Vx = 0;
    Vy = 0;
    if (count) {
        const timer = setTimeout(() => {
            Vx = -Math.ceil(Math.random() * 5);
            Vy = -Math.ceil(Math.random() * 5);
            V = Math.sqrt(Math.pow(Vx, 2) + Math.pow(Vy, 2));
            clearTimeout(timer);
        }, 2000);
    }
    else {
        result();
    }

}
function result() {
    let maxScore = Math.max(parseInt(user1score.innerHTML), parseInt(user2score.innerHTML));
    let name = parseInt(user1score.innerHTML) > parseInt(user2score.innerHTML) ? "rod1" : "rod2";
    let text = `Match Ended! Winner:${name}, score: ${maxScore} `;
    alert(text);
    let scoredetails = {
        name,
        maxScore,
    }
    console.log(scoredetails, record);
    if (record.length > 0) {
        record[0].maxScore < maxScore ? localStorage.setItem("record", JSON.stringify([scoredetails])) : null;
    }
    else {
        console.log(scoredetails)
        localStorage.setItem("record", JSON.stringify([scoredetails]))
    }
}

let Vx = -5;
let Vy = -5;
let V = Math.sqrt(Math.pow(Vx, 2) + Math.pow(Vy, 2));

function checkCollision(rod) {
    // cancelAnimationFrame(requestId);
    // all measurements of ball
    let ballTop = ball.offsetTop;
    let ballBottom = ball.offsetTop + ball.offsetHeight;
    let ballLeft = ball.offsetLeft;
    let ballRight = ball.offsetLeft + ball.offsetWidth;

    // all measurements of rod
    let rodTop = rod.offsetTop;
    let rodBottom = rod.offsetTop + rod.offsetHeight;
    let rodLeft = rod.offsetLeft;
    let rodRight = rod.offsetLeft + rod.offsetWidth;
    // console.log("rod", rodLeft, ballRight, rodRight,ballLeft)
    if (rodLeft < ballRight && rodRight > ballLeft && rodBottom >= ballTop && rodTop <= ballBottom) {
        // console.log("rod",rodLeft, ballRight)
        console.log("collision")
        return true
    }
    else {

        return false
    }
}
function continuousGameLoop() {
    if (count == 0) {
        clearInterval(interval);
        reset();
        cancelAnimationFrame(requestId);
        requestId = undefined;
        return;

    }
    if (ball.offsetTop < 0) {
        user2score.innerHTML = parseInt(user2score.innerHTML) + 1;
        reset();
        // Vy = -Vy;
    }
    if (ball.offsetTop >= game.offsetHeight - ball.offsetHeight) {
        user1score.innerHTML = parseInt(user1score.innerHTML) + 1;
        reset();
        // Vy = -Vy;
    }

    if (ball.offsetLeft < 0) {
        Vx = -Vx
    }
    if (ball.offsetLeft > game.offsetWidth - ball.offsetWidth) {
        Vx = -Vx
    }
    // find ball is on which side
    let rod = ball.offsetTop < game.offsetHeight / 2 ? rod1 : rod2;
    let ballCenterX = ball.offsetLeft + ball.offsetWidth / 2;
    let RodCenterX = rod.offsetLeft + rod.offsetWidth / 2;



    let angle = 0;
    if (checkCollision(rod)) {
        if (rod == rod1) {
            if (ballCenterX < RodCenterX) {
                angle = Math.PI / 4;
                // console.log(angle)
            }
            else if (ballCenterX > RodCenterX) {
                angle = -Math.PI / 4;
                // console.log(angle)
            }
            else {
                angle = 0;
                // console.log(angle)
            }

            // console.log(angle)
        }
        else if (rod == rod2) {
            if (ballCenterX < RodCenterX) {
                angle = -3 * Math.PI / 4
            }
            else if (ballCenterX > RodCenterX) {
                angle = 3 * Math.PI / 4
            }
            else {
                angle = 0
            }
        }
        V = V + 0.5;
        // console.log(V)
        Vx = V * Math.cos(angle);
        Vy = V * Math.sin(angle);

    }

    // let aidelay = 0.2;
    // rod2.style.left =
    //     rod2.offsetLeft + (ball.offsetLeft - rod2.offsetLeft - rod2.offsetWidth / 2) * aidelay + "px";

    ball.style.top = ball.offsetTop + Vy + "px";
    ball.style.left = ball.offsetLeft + Vx + "px";

    if (apressed && rod1.offsetLeft > 80) {
        rod1.style.left = rod1.offsetLeft - 10 + "px"
        rod2.style.left = rod2.offsetLeft - 10 + "px"
    }

    if (dpressed && rod1.offsetLeft < game.offsetWidth - rod1.offsetWidth + 45) {
        rod1.style.left = rod1.offsetLeft + 10 + "px"
        rod2.style.left = rod2.offsetLeft + 10 + "px"
    }
    requestId = requestAnimationFrame(continuousGameLoop);
}
