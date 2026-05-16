// get all the buttons and inputs we need
let openGameBtn = document.getElementById("openGameBtn");
let saveSettingsBtn = document.getElementById("saveSettingsBtn");
let loadSettingsBtn = document.getElementById("loadSettingsBtn");
let resetSettingsBtn = document.getElementById("resetSettingsBtn");

// update the live preview text whenever any input changes
function updatePreview() {
    let name = document.getElementById("playerName").value || "No name";
    let size = document.getElementById("boardSize").value;
    let diff = document.getElementById("difficulty").value;
    let pairType = document.querySelector('input[name="pairType"]:checked').value;

    document.getElementById("previewText").innerText =
        "Player: " + name + " | Board: " + size + " | Difficulty: " + diff + " | Pair Type: " + pairType;
}

// listen for changes on all inputs and updatee
document.getElementById("playerName").addEventListener("input", updatePreview);
document.getElementById("boardSize").addEventListener("change", updatePreview);
document.getElementById("difficulty").addEventListener("change", updatePreview);
document.querySelectorAll('input[name="pairType"]').forEach(function (radio) {
    radio.addEventListener("change", updatePreview);
});

// run once on load so preview shows default values straight away
updatePreview();


// open game button - save settings then go to game page
openGameBtn.addEventListener("click", function () {
    let playerName = document.getElementById("playerName").value.trim();

    // make sure the player has typed a name before starting
    if (playerName === "") {
        alert("Please enter a player name before starting.");
        return;
    }

    let difficulty = document.getElementById("difficulty").value;
    let boardSize = document.getElementById("boardSize").value;
    let selectedPairType = document.querySelector('input[name="pairType"]:checked').value;
    let showTimer = document.getElementById("showTimer").checked;
    let enableHints = document.getElementById("enableHints").checked;

    // save everything to localStorage so game.js can read it
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("difficulty", difficulty);
    localStorage.setItem("boardSize", boardSize);
    localStorage.setItem("pairType", selectedPairType);
    localStorage.setItem("showTimer", showTimer);
    localStorage.setItem("enableHints", enableHints);

    window.location.href = "game.html";
});


// save settings button saves the current form values
saveSettingsBtn.addEventListener("click", function () {
    let playerName = document.getElementById("playerName").value;
    let difficulty = document.getElementById("difficulty").value;
    let boardSize = document.getElementById("boardSize").value;
    let pairType = document.querySelector('input[name="pairType"]:checked').value;
    let showTimer = document.getElementById("showTimer").checked;
    let enableHints = document.getElementById("enableHints").checked;

    localStorage.setItem("savedPlayerName", playerName);
    localStorage.setItem("savedDifficulty", difficulty);
    localStorage.setItem("savedBoardSize", boardSize);
    localStorage.setItem("savedPairType", pairType);
    localStorage.setItem("savedShowTimer", showTimer);
    localStorage.setItem("savedEnableHints", enableHints);

    alert("Settings saved!");
});


// load settings button fills the form with valuees saved bfore
loadSettingsBtn.addEventListener("click", function () {
    let playerName = localStorage.getItem("savedPlayerName");
    let difficulty = localStorage.getItem("savedDifficulty");
    let boardSize = localStorage.getItem("savedBoardSize");
    let pairType = localStorage.getItem("savedPairType");
    let showTimer = localStorage.getItem("savedShowTimer");
    let enableHints = localStorage.getItem("savedEnableHints");

    // only load if there are actually saved settings
    if (!playerName) {
        alert("No saved settings found.");
        return;
    }

    document.getElementById("playerName").value = playerName;
    document.getElementById("boardSize").value = boardSize;
    document.getElementById("difficulty").value = difficulty;

    // check the right radio button for pair type
    let radios = document.querySelectorAll('input[name="pairType"]');
    radios.forEach(function (radio) {
        if (radio.value === pairType) {
            radio.checked = true;
        }
    });

    // restore checkboxes the string "true" means it was checked
    document.getElementById("showTimer").checked = (showTimer === "true");
    document.getElementById("enableHints").checked = (enableHints === "true");

    updatePreview();
    alert("Settings loaded!");
});


// reset settings button - clears the form back to defaults
resetSettingsBtn.addEventListener("click", function () {
    document.getElementById("playerName").value = "";
    document.getElementById("boardSize").value = "4x4";
    document.getElementById("difficulty").value = "medium";

    // reset radio to first option
    document.querySelector('input[name="pairType"][value="numberWord"]').checked = true;

    document.getElementById("showTimer").checked = true;
    document.getElementById("enableHints").checked = false;

    updatePreview();
});
