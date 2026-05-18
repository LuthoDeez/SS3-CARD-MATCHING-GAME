// loadinggggggggg data from launcherrr
let playerName = localStorage.getItem("playerName");
let difficulty = localStorage.getItem("difficulty");
let boardSize = localStorage.getItem("boardSize");
let pairType = localStorage.getItem("pairType");
let enableHints = localStorage.getItem("enableHints") === "true";
let showTimerSetting = localStorage.getItem("showTimer") === "true";

//Change 2
// improvements
let difficultySettings = {
    easy:   { startTime: 90, flipBackDelay: 800, pointsPerMatch: 10 },
    medium: { startTime: 75, flipBackDelay: 800,  pointsPerMatch: 15 },
    hard:   { startTime: 60,  flipBackDelay: 400,  pointsPerMatch: 25 }
};
//end change 2
// improvements

let settings = difficultySettings[difficulty] || difficultySettings["medium"];


//these two store the values of teh chosen cards
let firstCard = null;
let secondCard = null;

let lockBoard = false;
let score = 0;
let attempts = 0;
let matches = 0;
let timeLeft = settings.startTime;
let timerInterval = null;
let timeoutId = null;
let hintCard = null;
let gameStarted = false;

// game values idk if i still need this but the code works right now might remove later
let values = [];


// connecting all da buttons we gonna be using
let gameBoard = document.getElementById("gameBoard");
let startBtn = document.getElementById("startBtn");
let resetBtn = document.getElementById("resetBtn");
let saveBtn = document.getElementById("saveBtn");
let loadBtn = document.getElementById("loadBtn");
let hintBtn = document.getElementById("hintBtn");
let backBtn = document.getElementById("backBtn");

// event listeners basically wait for th euser to do something and then executes an action
//these are connected to the buttons from before and the functions being executed one is used to go back to the home page
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
hintBtn.addEventListener("click", showHint);

backBtn.addEventListener("click", function () {
    window.location.href = "index.html";
});

saveBtn.addEventListener("click", saveSession);
loadBtn.addEventListener("click", loadSession);


function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    let cookieName = name + "=";
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(cookieName) === 0) {
            return c.substring(cookieName.length);
        }
    }
    return null;
}


// this decides the game size and pair type based on the choice from the userr in index.html
//if statements are used to sort between the board sizes aswell as pairtype to get the right combination
function generateValues() {
    values = [];

    if (boardSize === "4x4") {

        if (pairType === "numberWord") {
            values = [
                { type: "number", value: "5",    pairnum: 1 },
                { type: "word",   value: "five",  pairnum: 1 },
                { type: "number", value: "2",    pairnum: 2 },
                { type: "word",   value: "two",   pairnum: 2 },
                { type: "number", value: "7",    pairnum: 3 },
                { type: "word",   value: "seven", pairnum: 3 },
                { type: "number", value: "9",    pairnum: 4 },
                { type: "word",   value: "nine",  pairnum: 4 }
            ];
        }

        else if (pairType === "sumAnswer") {
            values = [
                { type: "sum",    value: "3 + 4", pairnum: 1 },
                { type: "answer", value: "7",     pairnum: 1 },
                { type: "sum",    value: "1 + 1", pairnum: 2 },
                { type: "answer", value: "2",     pairnum: 2 },
                { type: "sum",    value: "2 + 3", pairnum: 3 },
                { type: "answer", value: "5",     pairnum: 3 },
                { type: "sum",    value: "4 + 4", pairnum: 4 },
                { type: "answer", value: "8",     pairnum: 4 }
            ];
        }

        else {
            values = [
                { type: "number", value: "5",    pairnum: 1 },
                { type: "word",   value: "five",  pairnum: 1 },
                { type: "sum",    value: "3 + 4", pairnum: 2 },
                { type: "answer", value: "7",     pairnum: 2 },
                { type: "number", value: "2",    pairnum: 3 },
                { type: "word",   value: "two",   pairnum: 3 },
                { type: "sum",    value: "1 + 1", pairnum: 4 },
                { type: "answer", value: "2",     pairnum: 4 }
            ];
        }
    }

    else if (boardSize === "4x5") {

        if (pairType === "numberWord") {
            values = [
                { type: "number", value: "1",     pairnum: 1 },
                { type: "word",   value: "one",   pairnum: 1 },
                { type: "number", value: "2",     pairnum: 2 },
                { type: "word",   value: "two",   pairnum: 2 },
                { type: "number", value: "3",     pairnum: 3 },
                { type: "word",   value: "three", pairnum: 3 },
                { type: "number", value: "4",     pairnum: 4 },
                { type: "word",   value: "four",  pairnum: 4 },
                { type: "number", value: "5",     pairnum: 5 },
                { type: "word",   value: "five",  pairnum: 5 }
            ];
        }

        else if (pairType === "sumAnswer") {
            values = [
                { type: "sum",    value: "1 + 1", pairnum: 1 },
                { type: "answer", value: "2",     pairnum: 1 },
                { type: "sum",    value: "2 + 2", pairnum: 2 },
                { type: "answer", value: "4",     pairnum: 2 },
                { type: "sum",    value: "3 + 2", pairnum: 3 },
                { type: "answer", value: "5",     pairnum: 3 },
                { type: "sum",    value: "4 + 2", pairnum: 4 },
                { type: "answer", value: "6",     pairnum: 4 },
                { type: "sum",    value: "3 + 3", pairnum: 5 },
                { type: "answer", value: "6",     pairnum: 5 }
            ];
        }

        else {
            values = [
                { type: "number", value: "5",    pairnum: 1 },
                { type: "word",   value: "five",  pairnum: 1 },
                { type: "sum",    value: "3 + 4", pairnum: 2 },
                { type: "answer", value: "7",     pairnum: 2 },
                { type: "number", value: "2",    pairnum: 3 },
                { type: "word",   value: "two",   pairnum: 3 },
                { type: "sum",    value: "1 + 1", pairnum: 4 },
                { type: "answer", value: "2",     pairnum: 4 },
                { type: "number", value: "9",    pairnum: 5 },
                { type: "word",   value: "nine",  pairnum: 5 }
            ];
        }
    }

    else if (boardSize === "6x6") {

        if (pairType === "numberWord") {
            values = [
                { type: "number", value: "1",     pairnum: 1 },
                { type: "word",   value: "one",   pairnum: 1 },
                { type: "number", value: "2",     pairnum: 2 },
                { type: "word",   value: "two",   pairnum: 2 },
                { type: "number", value: "3",     pairnum: 3 },
                { type: "word",   value: "three", pairnum: 3 },
                { type: "number", value: "4",     pairnum: 4 },
                { type: "word",   value: "four",  pairnum: 4 },
                { type: "number", value: "5",     pairnum: 5 },
                { type: "word",   value: "five",  pairnum: 5 },
                { type: "number", value: "6",     pairnum: 6 },
                { type: "word",   value: "six",   pairnum: 6 },
                { type: "number", value: "7",     pairnum: 7 },
                { type: "word",   value: "seven", pairnum: 7 },
                { type: "number", value: "8",     pairnum: 8 },
                { type: "word",   value: "eight", pairnum: 8 },
                { type: "number", value: "9",     pairnum: 9 },
                { type: "word",   value: "nine",  pairnum: 9 }
            ];
        }

        else if (pairType === "sumAnswer") {
            values = [
                { type: "sum",    value: "1 + 1", pairnum: 1 },
                { type: "answer", value: "2",     pairnum: 1 },
                { type: "sum",    value: "2 + 2", pairnum: 2 },
                { type: "answer", value: "4",     pairnum: 2 },
                { type: "sum",    value: "3 + 3", pairnum: 3 },
                { type: "answer", value: "6",     pairnum: 3 },
                { type: "sum",    value: "4 + 4", pairnum: 4 },
                { type: "answer", value: "8",     pairnum: 4 },
                { type: "sum",    value: "5 + 5", pairnum: 5 },
                { type: "answer", value: "10",    pairnum: 5 },
                { type: "sum",    value: "6 + 6", pairnum: 6 },
                { type: "answer", value: "12",    pairnum: 6 },
                { type: "sum",    value: "7 + 7", pairnum: 7 },
                { type: "answer", value: "14",    pairnum: 7 },
                { type: "sum",    value: "8 + 8", pairnum: 8 },
                { type: "answer", value: "16",    pairnum: 8 },
                { type: "sum",    value: "9 + 9", pairnum: 9 },
                { type: "answer", value: "18",    pairnum: 9 }
            ];
        }

        else {
            values = [
                { type: "number", value: "5",    pairnum: 1 },
                { type: "word",   value: "five",  pairnum: 1 },
                { type: "sum",    value: "3 + 4", pairnum: 2 },
                { type: "answer", value: "7",     pairnum: 2 },
                { type: "number", value: "2",    pairnum: 3 },
                { type: "word",   value: "two",   pairnum: 3 },
                { type: "sum",    value: "1 + 1", pairnum: 4 },
                { type: "answer", value: "2",     pairnum: 4 },
                { type: "number", value: "9",    pairnum: 5 },
                { type: "word",   value: "nine",  pairnum: 5 },
                { type: "sum",    value: "4 + 4", pairnum: 6 },
                { type: "answer", value: "8",     pairnum: 6 },
                { type: "number", value: "6",    pairnum: 7 },
                { type: "word",   value: "six",   pairnum: 7 },
                { type: "sum",    value: "3 + 3", pairnum: 8 },
                { type: "answer", value: "6",     pairnum: 8 },
                { type: "number", value: "4",    pairnum: 9 },
                { type: "word",   value: "four",  pairnum: 9 }
            ];
        }
    }
}


// i mean pretty simple this starts the game calls all the necessary info from the html to fill in
//and calls functions needed to start the game
function startGame() {
    clearInterval(timerInterval);
    clearTimeout(timeoutId);

    score = 0;
    attempts = 0;
    matches = 0;
    gameStarted = true;

    settings = difficultySettings[difficulty] || difficultySettings["medium"];
    timeLeft = settings.startTime;

    document.getElementById("displayPlayer").innerText = playerName;
    document.getElementById("displayDifficulty").innerText = difficulty;
    document.getElementById("displayBoardSize").innerText = boardSize;
    document.getElementById("displayPairType").innerText = pairType;

    let timeBox = document.getElementById("displayTime").parentElement;
    timeBox.style.display = showTimerSetting ? "" : "none";

    let bestScore = getCookie("bestScore") || 0;
    document.getElementById("displayBestScore").innerText = bestScore;

    document.getElementById("logArea").innerHTML = "";

    setMessage("Game started! Good luck, " + playerName + "!");
    addLog("Game started. Board: " + boardSize + " | Difficulty: " + difficulty);

    generateValues();
    createBoard();
    updateDisplay();
    startTimer();
}


// makees a timer that calls updatetime every second
//and then update time runs every second once timer reaches zero calls the engame function
function startTimer() {
    document.getElementById("displayTime").innerText = timeLeft + "s";

    timerInterval = setInterval(function () {
        timeLeft--;
        document.getElementById("displayTime").innerText = timeLeft + "s";
        //change 1
        // improvements
        if (timeLeft <= 20) {
            document.getElementById("displayTime").style.color = "red";
            document.getElementById("displayTime").style.fontSize = "1.4rem";
            document.getElementById("displayTime").parentElement.style.background = "#fee2e2";
            document.getElementById("displayTime").parentElement.style.border = "2px solid red";
        }
        // improvements
        //end change 1
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}


// create da board
function createBoard() {
    gameBoard.innerHTML = "";

    gameBoard.className = "game-board";
    if (boardSize === "4x4")  gameBoard.classList.add("board-4x4");
    if (boardSize === "4x5")  gameBoard.classList.add("board-4x5");
    if (boardSize === "6x6")  gameBoard.classList.add("board-6x6");

    values.sort(function () { return Math.random() - 0.5; });

    values.forEach(function (cardData, index) {
        let card = document.createElement("div");
        card.classList.add("number-card");
        card.dataset.index = index;
        card.cardData = cardData;
        card.innerText = "";
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });
}


// flip card
function flipCard() {
    if (lockBoard) return;
    if (!gameStarted) return;
    if (this === firstCard) return;
    if (this.classList.contains("matched")) return;

    if (hintCard) {
        hintCard.classList.remove("hint");
        hintCard = null;
    }

    this.innerText = this.cardData.value;
    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    attempts++;
    updateDisplay();
    checkMatch();
}


// checks if the two cards actually have the same pair number if they do
//  match the function diable cards will run if not the function unflip cards will run
function checkMatch() {
    let isMatch = firstCard.cardData.pairnum === secondCard.cardData.pairnum;

    if (isMatch) {
        matchFound();
    } else {
        noMatch();
    }
}


// disable matched cards
function matchFound() {
    matches++;
    score += settings.pointsPerMatch;

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    addLog("Match! " + firstCard.cardData.value + " - " + secondCard.cardData.value + " (+" + settings.pointsPerMatch + " pts)");
    setMessage("Correct match! +" + settings.pointsPerMatch + " points");

    updateDisplay();
    ResetBoard();

    let totalPairs = values.length / 2;
    if (matches === totalPairs) {
        winGame();
    }
}


// flip back cards
function noMatch() {
    lockBoard = true;
    addLog("No match: " + firstCard.cardData.value + " - " + secondCard.cardData.value);
    setMessage("Not a match. Try again!");

    timeoutId = setTimeout(function () {
        firstCard.innerText = "";
        secondCard.innerText = "";
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        ResetBoard();
    }, settings.flipBackDelay);
}


//clears out the chosen cards and unlocks the board so the player can keep playing the game
function ResetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}


function winGame() {
    clearInterval(timerInterval);
    gameStarted = false;

    let timeBonus = timeLeft * 2;
    score += timeBonus;

    let bestScore = Number(getCookie("bestScore")) || 0;
    if (score > bestScore) {
        setCookie("bestScore", score, 30);
        document.getElementById("displayBestScore").innerText = score;
    }

    updateDisplay();
    setMessage("You won, " + playerName + "! Final score: " + score + " (Time bonus: +" + timeBonus + ")");
    addLog("Game won! Final score: " + score + " | Time bonus: +" + timeBonus);
}


// end da timer locks the board and displays the loseer message
function endGame() {
    clearInterval(timerInterval);
    lockBoard = true;
    gameStarted = false;

    setMessage("Times up, " + playerName + "! You matched " + matches + " of " + (values.length / 2) + " pairs.");
    addLog("Times up. Score: " + score + " | Matches: " + matches);
}


// reset game
function resetGame() {
    clearTimeout(timeoutId);
    clearInterval(timerInterval);

    score = 0;
    attempts = 0;
    matches = 0;
    gameStarted = false;

    settings = difficultySettings[difficulty] || difficultySettings["medium"];
    timeLeft = settings.startTime;

    gameBoard.innerHTML = "";
    gameBoard.className = "game-board";

    document.getElementById("displayTime").style.color = "";
    // improvements
    document.getElementById("displayTime").style.fontSize = "";
    document.getElementById("displayTime").parentElement.style.background = "";
    document.getElementById("displayTime").parentElement.style.border = "";
    // improvements
    document.getElementById("logArea").innerHTML = "";

    updateDisplay();
    setMessage("Game reset. Click Start Game when ready.");
    ResetBoard();
}


function showHint() {
    if (!enableHints) {
        setMessage("Hints are not enabled. Turn them on in settings.");
        return;
    }

    if (!gameStarted) {
        setMessage("Start the game first!");
        return;
    }

    if (hintCard) {
        hintCard.classList.remove("hint");
        hintCard = null;
    }

    let allCards = Array.from(gameBoard.querySelectorAll(".number-card"));
    let unmatched = allCards.filter(function (card) {
        return !card.classList.contains("matched") && !card.classList.contains("flipped");
    });

    if (unmatched.length === 0) {
        setMessage("No cards left to hint!");
        return;
    }

    let randomIndex = Math.floor(Math.random() * unmatched.length);
    hintCard = unmatched[randomIndex];
    hintCard.classList.add("hint");

    setTimeout(function () {
        if (hintCard) {
            hintCard.classList.remove("hint");
            hintCard = null;
        }
    }, 2000);

    addLog("Hint used.");
    setMessage("Hint: check the highlighted card!");
}


function saveSession() {
    if (!gameStarted && matches === 0) {
        setMessage("Nothing to save yet. Start a game first!");
        return;
    }

    localStorage.setItem("savedScore", score);
    localStorage.setItem("savedAttempts", attempts);
    localStorage.setItem("savedMatches", matches);
    localStorage.setItem("savedTimeLeft", timeLeft);

    let allCards = Array.from(gameBoard.querySelectorAll(".number-card"));
    let matchedIndexes = [];
    allCards.forEach(function (card) {
        if (card.classList.contains("matched")) {
            matchedIndexes.push(card.dataset.index);
        }
    });
    localStorage.setItem("savedMatchedIndexes", JSON.stringify(matchedIndexes));

    setMessage("Session saved!");
    addLog("Session saved. Score: " + score + " | Matches: " + matches);
}


function loadSession() {
    let savedScore = localStorage.getItem("savedScore");

    if (savedScore === null) {
        setMessage("No saved session found.");
        return;
    }

    score = Number(savedScore);
    attempts = Number(localStorage.getItem("savedAttempts")) || 0;
    matches = Number(localStorage.getItem("savedMatches")) || 0;
    timeLeft = Number(localStorage.getItem("savedTimeLeft")) || settings.startTime;

    document.getElementById("displayPlayer").innerText = playerName;
    document.getElementById("displayDifficulty").innerText = difficulty;
    document.getElementById("displayBoardSize").innerText = boardSize;
    document.getElementById("displayPairType").innerText = pairType;

    let savedIndexes = JSON.parse(localStorage.getItem("savedMatchedIndexes") || "[]");
    let allCards = Array.from(gameBoard.querySelectorAll(".number-card"));
    allCards.forEach(function (card) {
        if (savedIndexes.includes(card.dataset.index)) {
            card.classList.add("matched");
            card.innerText = card.cardData.value;
            card.removeEventListener("click", flipCard);
        }
    });

    updateDisplay();
    setMessage("Session loaded!");
    addLog("Session loaded. Score: " + score + " | Matches: " + matches);
}


//this displays the the new values for score , attempts and time in seconds
function updateDisplay() {
    let totalPairs = values.length / 2;
    let pairsLeft = totalPairs - matches;

    document.getElementById("displayScore").innerText = score;
    document.getElementById("displayMoves").innerText = attempts;
    document.getElementById("displayMatches").innerText = matches;
    document.getElementById("displayPairsLeft").innerText = pairsLeft >= 0 ? pairsLeft : 0;
    document.getElementById("displayTime").innerText = timeLeft + "s";
}


function setMessage(text) {
    document.getElementById("messageArea").innerText = text;
}


function addLog(text) {
    let logArea = document.getElementById("logArea");
    let entry = document.createElement("div");
    entry.classList.add("log-entry");

    let now = new Date();
    let time = now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0");
    entry.innerText = "[" + time + "] " + text;

    logArea.prepend(entry);
}


let bestScore = getCookie("bestScore") || 0;
document.getElementById("displayBestScore").innerText = bestScore;
setMessage("Welcome, " + (playerName || "Player") + "! Click Start Game when ready.");
