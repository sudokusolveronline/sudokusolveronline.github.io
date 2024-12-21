const sudokuGrid = document.getElementById("sudoku-grid");
const gridButtons = document.querySelectorAll(".grid-buttons button");
const difficultyButtons = document.querySelectorAll(".difficulty-buttons button");
const startGameButton = document.getElementById("start-game");

let selectedGridSize = 9;
let selectedDifficulty = "medium";

// Update active grid size button
gridButtons.forEach((button) => {
    button.addEventListener("click", () => {
        gridButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        selectedGridSize = parseInt(button.getAttribute("data-size"));
    });
});

// Update active difficulty button
difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
        difficultyButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        selectedDifficulty = button.getAttribute("data-difficulty");
    });
});

// Generate Sudoku Grid
function generateSudokuGrid(size) {
    sudokuGrid.innerHTML = ""; // Clear the grid
    sudokuGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    sudokuGrid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");

        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = "1";

        tile.appendChild(input);
        sudokuGrid.appendChild(tile);
    }
}

// Fill Random Numbers Based on Difficulty
function fillRandomNumbers(size, difficulty) {
    const tiles = document.querySelectorAll(".tile input");
    const numberOfHints = calculateHints(size, difficulty);

    const filledIndices = new Set();
    while (filledIndices.size < numberOfHints) {
        const randomIndex = Math.floor(Math.random() * (size * size));
        if (!filledIndices.has(randomIndex)) {
            const randomNumber = Math.ceil(Math.random() * size);
            tiles[randomIndex].value = randomNumber;
            tiles[randomIndex].disabled = true;
            filledIndices.add(randomIndex);
        }
    }
}

// Calculate Number of Hints
function calculateHints(size, difficulty) {
    const baseHints = (size * size) / 4;
    switch (difficulty) {
        case "very-easy":
            return Math.ceil(baseHints * 1.5);
        case "easy":
            return Math.ceil(baseHints * 1.2);
        case "medium":
            return Math.ceil(baseHints);
        case "hard":
            return Math.ceil(baseHints * 0.8);
        case "extra-hard":
            return Math.ceil(baseHints * 0.5);
        default:
            return Math.ceil(baseHints);
    }
}

// Start Game Event Listener
startGameButton.addEventListener("click", () => {
    generateSudokuGrid(selectedGridSize);
    fillRandomNumbers(selectedGridSize, selectedDifficulty);
});
