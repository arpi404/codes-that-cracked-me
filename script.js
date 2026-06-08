let modebtn = document.querySelector("#mode");
let gameModeBtn = document.querySelector("#game-mode-btn"); // Added
let currMode = "light";
let body = document.querySelector("body");
let box = document.querySelectorAll(".box");
let NewGamebtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let resetBtn = document.querySelector("#reset");

let vsBot = false; // Tracks if we are playing against the computer
let turnx = true;  // True = X (Player 1), False = O (Player 2 or Bot)
let isGameOver = false;
let wcondition = [
    [0,1,2], [3,4,5], [6,7,8], // Rows
    [0,3,6], [1,4,7], [2,5,8], // Columns
    [0,4,8], [2,4,6]           // Diagonals
];

// Switch Game Modes (PvP vs PvBot)
gameModeBtn.addEventListener("click", () => {
    vsBot = !vsBot;
    if (vsBot) {
        gameModeBtn.innerText = "Game Mode: Vs Bot (You are X)";
    } else {
        gameModeBtn.innerText = "Game Mode: Player vs Player";
    }
    reset(); // Reset game when mode changes
});

// Main click handler for the game grid
box.forEach((singleBox, index) => {
    singleBox.addEventListener("click", () => {
        if (isGameOver) return;

        if (turnx === true) {
            singleBox.innerText = "X";
            singleBox.classList.add("x-color"); // Red or default
            singleBox.disabled = true;
            turnx = false;
            
            if (!checkw() && vsBot) {
                // If game isn't over and it's Vs Bot mode, let the bot play after a small delay
                setTimeout(botTurn, 400); 
            }
        } else if (!vsBot) { 
            // This only triggers manually if playing Local Player vs Player
            singleBox.innerText = "O";
            singleBox.classList.add("o-color"); // Blue or default
            singleBox.disabled = true;
            turnx = true;
            checkw();
        }
    });
});

// Automated Bot Logic (Plays 'O')
const botTurn = () => {
    if (isGameOver) return;

    // 1. Gather all empty boxes that are left
    let availableBoxes = [];
    box.forEach((singleBox, index) => {
        if (singleBox.innerText === "") {
            availableBoxes.push(singleBox);
        }
    });

    // 2. If there are available spaces, choose a random one
    if (availableBoxes.length > 0) {
        let randomChoice = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
        randomChoice.innerText = "O";
        randomChoice.classList.add("o-color");
        randomChoice.disabled = true;
        turnx = true; // Hand turn back over to player X
        checkw();
    }
};

// Check Winner Condition
const checkw = () => {
    for (let p of wcondition) {
        let p1 = box[p[0]].innerText;
        let p2 = box[p[1]].innerText;
        let p3 = box[p[2]].innerText;
        
        if (p1 !== "" && p2 !== "" && p3 !== "") {
            if (p1 === p2 && p2 === p3) {
                showwinner(p1);
                return true; // Match found
            }
        }
    }

    // Check for a Tie Game
    let allFilled = Array.from(box).every(b => b.innerText !== "");
    if (allFilled && !isGameOver) {
        showTie();
        return true;
    }
    return false;
};

const showwinner = (winner) => {
    isGameOver = true;
    
    // Prints the specific winner clearly to the screen!
    if (vsBot) {
        msg.innerText = winner === "X" ? "🎉 Congratulations! You Beat The Bot! 🎉" : "🤖 The Bot Wins! Try Again! 🤖";
    } else {
        msg.innerText = `🎉 Congratulations!, Winner is ${winner} 🎉`;
    }
    
    msgContainer.classList.remove("hide");
    disableboxes();
};

const showTie = () => {
    isGameOver = true;
    msg.innerText = "(p≧w≦q) It's a Tie Game! (p≧w≦q)";
    msgContainer.classList.remove("hide");
    disableboxes();
};

const reset = () => {
    turnx = true;
    isGameOver = false;
    enableboxes();
    msgContainer.classList.add("hide");
};

const disableboxes = () => {
    for (let b of box) {
        b.disabled = true;
    }
};

const enableboxes = () => {
    for (let b of box) {
        b.disabled = false;
        b.innerText = "";
        b.classList.remove("x-color", "o-color");
    }
};

// Background Theme Logic
modebtn.addEventListener("click", () => {
    if (currMode === "light") {
        currMode = "dark";
        body.classList.add("dark");
        body.classList.remove("white");
    
    } else if (currMode === "dark") {
        currMode = "light";
        body.classList.add("white");
        body.classList.remove("dark");
    }
});

NewGamebtn.addEventListener("click", reset);
resetBtn.addEventListener("click", reset);
