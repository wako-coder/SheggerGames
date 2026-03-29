// Game variables
let gridSize = 5;
let grid = [];
let moves = 0;
let currentColor = '';
let timerInterval;
let seconds = 0;
let isGameRunning = false;
let adTimerInterval;
let adSeconds = 5;
let selectedLevel = 5;

// Color options
const colors = [
    {light: '#FFEB3B', name: 'Yellow'},
    {light: '#4CAF50', name: 'Green'},
    {light: '#F44336', name: 'Red'},
    {light: '#2196F3', name: 'Blue'},
    {light: '#FF9800', name: 'Orange'},
    {light: '#9C27B0', name: 'Purple'},
    {light: '#E91E63', name: 'Pink'},
    {light: '#00BCD4', name: 'Cyan'},
    {light: '#FF5722', name: 'Deep Orange'},
    {light: '#8BC34A', name: 'Light Green'}
];

// Sound effects
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const loadingProgress = document.getElementById('loading-progress');
const adScreen = document.getElementById('ad-screen');
const adTimer = document.getElementById('ad-timer');
const skipAdBtn = document.getElementById('skip-ad-btn');
const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');
const winScreen = document.getElementById('win-screen');
const easyBtn = document.getElementById('easy-btn');
const normalBtn = document.getElementById('normal-btn');
const hardBtn = document.getElementById('hard-btn');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const closeHelp = document.querySelector('.close-help');

// Event Listeners
easyBtn.addEventListener('click', () => showAd(3));
normalBtn.addEventListener('click', () => showAd(5));
hardBtn.addEventListener('click', () => showAd(8));
skipAdBtn.addEventListener('click', closeAd);
helpBtn.addEventListener('click', () => {
    helpModal.style.display = 'flex';
});
closeHelp.addEventListener('click', () => {
    helpModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        helpModal.style.display = 'none';
    }
});

// Show loading screen first
window.onload = function() {
    helpBtn.style.display = 'none'; // Hide help button during loading
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(showMainMenu, 500);
        }
        loadingProgress.style.width = `${progress}%`;
    }, 200);
};

function showMainMenu() {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainMenu.style.display = 'flex';
        helpBtn.style.display = 'flex'; // Show help button only on main menu
    }, 1000);
}

function showAd(size) {
    selectedLevel = size;
    mainMenu.style.display = 'none';
    helpBtn.style.display = 'none'; // Hide help button when ad shows
    adScreen.style.display = 'flex';
    adSeconds = 5;
    adTimer.textContent = adSeconds;
    
    // Disable skip button
    skipAdBtn.disabled = true;
    skipAdBtn.style.backgroundColor = '#666';
    skipAdBtn.style.color = '#999';
    skipAdBtn.style.cursor = 'not-allowed';
    
    // Start ad countdown
    clearInterval(adTimerInterval);
    adTimerInterval = setInterval(() => {
        adSeconds--;
        adTimer.textContent = adSeconds;
        
        if (adSeconds <= 0) {
            closeAd();
        }
    }, 1000);
}

function closeAd() {
    clearInterval(adTimerInterval);
    adScreen.style.display = 'none';
    startGame(selectedLevel);
}

function returnToMenu() {
    clearInterval(timerInterval);
    isGameRunning = false;
    gameScreen.style.display = 'none';
    winScreen.style.display = 'none';
    mainMenu.style.display = 'flex';
    helpBtn.style.display = 'flex'; // Show help button when returning to menu
}

function playAgain() {
    winScreen.style.display = 'none';
    showAd(gridSize);
}

// Initialize the game
function startGame(size) {
    gridSize = size;
    moves = 0;
    seconds = 0;
    document.getElementById('moves').textContent = moves;
    document.getElementById('timer').textContent = '00:00';
    
    // Update win screen level info
    document.getElementById('win-level').textContent = 
        `${size === 3 ? 'Easy' : size === 5 ? 'Normal' : 'Hard'} (${size}×${size})`;
    
    // Select a random color for this game
    currentColor = colors[Math.floor(Math.random() * colors.length)];
    document.title = `Lights Out - ${currentColor.name} Theme`;
    
    // Create the grid
    createGrid();
    
    // Randomize the grid to create a solvable puzzle
    randomizeGrid();
    
    // Show game screen
    gameScreen.style.display = 'flex';
    winScreen.style.display = 'none';
    helpBtn.style.display = 'none'; // Hide help button during gameplay
    
    // Start timer
    clearInterval(timerInterval);
    isGameRunning = true;
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (!isGameRunning) return;
    
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Create the grid HTML elements
function createGrid() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    
    const gridElement = document.createElement('div');
    gridElement.className = 'grid';
    gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    // Initialize the grid array
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
    
    // Create cells
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell dark';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => toggleCell(row, col));
            gridElement.appendChild(cell);
        }
    }
    
    container.appendChild(gridElement);
}

// Randomize the grid to create a solvable puzzle
function randomizeGrid() {
    // Start with all lights on
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            grid[row][col] = true;
            updateCellAppearance(row, col);
        }
    }
    
    // Make random moves to scramble the grid
    const movesToMake = gridSize * gridSize * 2;
    for (let i = 0; i < movesToMake; i++) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        toggleLights(row, col, false);
    }
    
    // Reset moves counter
    moves = 0;
    document.getElementById('moves').textContent = moves;
}

// Toggle a cell and its adjacent cells
function toggleCell(row, col) {
    if (!isGameRunning) return;
    
    toggleLights(row, col, true);
    
    // Play click sound
    clickSound.currentTime = 0;
    clickSound.play();
    
    // Check for win
    if (checkWin()) {
        showWinScreen();
    }
}

// Toggle lights with optional move counting
function toggleLights(row, col, countMove) {
    // Toggle the clicked cell
    grid[row][col] = !grid[row][col];
    updateCellAppearance(row, col);
    
    // Toggle adjacent cells
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // up, down, left, right
    
    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
            grid[newRow][newCol] = !grid[newRow][newCol];
            updateCellAppearance(newRow, newCol);
        }
    }
    
    if (countMove) {
        moves++;
        document.getElementById('moves').textContent = moves;
    }
}

// Update the appearance of a cell
function updateCellAppearance(row, col) {
    const cells = document.querySelectorAll('.cell');
    const index = row * gridSize + col;
    const cell = cells[index];
    
    if (grid[row][col]) {
        cell.style.backgroundColor = currentColor.light;
        cell.classList.remove('dark');
    } else {
        cell.style.backgroundColor = '';
        cell.classList.add('dark');
    }
}

// Check if all lights are on (win condition)
function checkWin() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (!grid[row][col]) {
                return false;
            }
        }
    }
    return true;
}

// Show win screen
function showWinScreen() {
    isGameRunning = false;
    clearInterval(timerInterval);
    
    document.getElementById('win-moves').textContent = moves;
    document.getElementById('win-time').textContent = document.getElementById('timer').textContent;
    winScreen.style.display = 'flex';
    helpBtn.style.display = 'none';
    
    // Play win sound
    winSound.currentTime = 0;
    winSound.play();
}