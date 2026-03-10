// 🔊 AUDIO SYSTEM
const bgMusic = document.getElementById("bgMusic");
const winSound = document.getElementById("winSound");
const clickSound = document.getElementById("clickSound");

const toggleSoundBtn = document.getElementById("toggleSound");
const volumeUpBtn = document.getElementById("volumeUp");
const volumeDownBtn = document.getElementById("volumeDown");

let masterVolume = 0.5;
let soundEnabled = true;

// Apply volume to all sounds
function updateVolume(){
    bgMusic.volume = masterVolume * 0.6;
    winSound.volume = masterVolume;
    clickSound.volume = masterVolume;
}

updateVolume();
//start music after first click by user
document.addEventListener("click", function () {
    bgMusic.play();
}, { once: true });
// Start background music after first interaction (browser rule)
document.addEventListener("click", () => {
    if (bgMusic.paused && soundEnabled) {
        bgMusic.play();
    }
}, { once: true });

// 🔊 Toggle Sound
if(toggleSoundBtn){
    toggleSoundBtn.onclick = () => {
        soundEnabled = !soundEnabled;

        if(soundEnabled){
            bgMusic.play();
            toggleSoundBtn.textContent = "🔊 Sound ON";
        } else {
            bgMusic.pause();
            toggleSoundBtn.textContent = "🔇 Sound OFF";
        }
    };
}

// 🔼 Volume Up
if(volumeUpBtn){
    volumeUpBtn.onclick = () => {
        if(masterVolume < 1){
            masterVolume += 0.1;
            masterVolume = Math.min(masterVolume, 1);
            updateVolume();
        }
    };
}

// 🔽 Volume Down
if(volumeDownBtn){
    volumeDownBtn.onclick = () => {
        if(masterVolume > 0){
            masterVolume -= 0.1;
            masterVolume = Math.max(masterVolume, 0);
            updateVolume();
        }
    };
}

// Safe play function
function playSound(sound){
    if(soundEnabled){
        sound.currentTime = 0;
        sound.play();
    }
}


// ================= GAME LOGIC =================

// Pages
const startPage = document.getElementById("startPage");
const gamePage = document.getElementById("gamePage");
const winnerPage = document.getElementById("winnerPage");

const startPVP = document.getElementById("startPVP");
const startAI = document.getElementById("startAI");
const playAgainBtn = document.getElementById("playAgain");
const backToMenu = document.getElementById("backToMenu");

const board = document.getElementById("board");
const statusText = document.getElementById("status");
const winnerText = document.getElementById("winnerText");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let state = Array(9).fill("");
let currentPlayer = "X";
let gameActive = false;
let vsAI = false;
let scores = { X: 0, O: 0 };
let cells = [];

const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function showPage(page){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    page.classList.add("active");
}

function createBoard(){
    board.innerHTML = "";
    cells = [];
    state = Array(9).fill("");

    for(let i=0;i<9;i++){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleClick);
        board.appendChild(cell);
        cells.push(cell);
    }
}

function handleClick(e){
    const index = e.target.dataset.index;
    if(state[index] !== "" || !gameActive) return;

    playSound(clickSound);
    makeMove(index, currentPlayer);

    if(vsAI && gameActive && currentPlayer === "O"){
        setTimeout(()=>{
            const move = getBestMove();
            makeMove(move, "O");
        }, 400);
    }
}

function makeMove(index, player){
    state[index] = player;
    cells[index].textContent = player;

    if(checkWinner(player)){
        scores[player]++;
        updateScore();
        gameActive = false;

        playSound(winSound);

        winnerText.textContent = `🏆 Player ${player} Wins!`;
        showPage(winnerPage);
        return;
    }

    if(!state.includes("")){
        winnerText.textContent = "🤝 It's a Draw!";
        showPage(winnerPage);
        return;
    }

    currentPlayer = player === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s Turn`;
}

function checkWinner(player){
    return winCombos.some(combo =>
        combo.every(i=>state[i]===player)
    );
}
//create stop function
function stopWinMusic() {
    winSound.pause();
    winSound.currentTime = 0;
}
function updateScore(){
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function getBestMove(){
    const empty = state.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    return empty[Math.floor(Math.random()*empty.length)];
}

function startGame(aiMode){
    playSound(clickSound);

    vsAI = aiMode;
    currentPlayer = "X";
    gameActive = true;
    createBoard();
    statusText.textContent = `${currentPlayer}'s Turn`;
    showPage(gamePage);
}

startPVP.onclick = ()=> startGame(false);
startAI.onclick = ()=> startGame(true);

playAgainBtn.onclick = ()=> {
    stopWinMusic();        // 👈 STOP winner music
    playSound(clickSound);
    startGame(vsAI);
};

// backToMenu.onclick = ()=> {
//     playSound(clickSound);
//     showPage(startPage);
// };
backToMenu.onclick = ()=> {
    stopWinMusic();        // 👈 STOP winner music
    playSound(clickSound);
    showPage(startPage);
};

showPage(startPage);
