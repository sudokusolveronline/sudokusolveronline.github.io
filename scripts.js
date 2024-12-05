document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sudoku-grid');
    const solveButton = document.getElementById('solve-button');
    const undoButton = document.getElementById('undo-button');
    const clearButton = document.getElementById('clear-button');
    const gridButtons = document.querySelectorAll('.grid-button');
    let SIZE = 9;

    // Event listener for grid buttons to set the size
    gridButtons.forEach(button => {
        button.addEventListener('click', () => {
            SIZE = parseInt(button.getAttribute('data-size'));
            createGrid(SIZE);
        });
    });

    // Default grid creation (9x9)
    createGrid(SIZE);

    solveButton.addEventListener('click', () => {
        if (!validateGrid()) {
            alert('Invalid input detected! Fix errors and try again.');
            return;
        }

        const board = getBoard();
        if (SIZE === 3 || SIZE === 6) {
            if (solveSimpleSudoku(board)) {
                updateBoard(board);
            } else {
                alert('No solution exists for the given Sudoku!');
            }
        } else if (SIZE === 9) {
            if (solveSudoku(board)) {
                updateBoard(board);
            } else {
                alert('No solution exists for the given Sudoku!');
            }
        }
    });

    undoButton.addEventListener('click', () => {
        const cells = grid.querySelectorAll('input');
        cells.forEach(cell => {
            if (cell.classList.contains('user-input')) {
                cell.value = '';
                cell.classList.remove('user-input');
            }
        });
    });

    // Clear all inputs in the grid
    clearButton.addEventListener('click', () => {
        const cells = grid.querySelectorAll('input');
        cells.forEach(cell => {
            cell.value = ''; // Clear the input value
            cell.classList.remove('user-input', 'solved', 'invalid'); // Reset classes
        });
    });

    function createGrid(size) {
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${size}, 40px)`;

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 2;
            cell.addEventListener('input', () => {
                const value = parseInt(cell.value);
                if (isNaN(value) || value < 1 || value > size) {
                    cell.classList.add('invalid');
                } else {
                    cell.classList.remove('invalid');
                    cell.classList.add('user-input');
                }
            });
            grid.appendChild(cell);

            // Add bold subgrid borders for 6x6 and 9x9
            if ((size === 6 || size === 9) && Math.floor(i / size) % Math.sqrt(size) === 0 && i >= size) {
                cell.style.borderTop = '2px solid black';
            }
            if ((size === 6 || size === 9) && i % size % Math.sqrt(size) === 0 && i % size !== 0) {
                cell.style.borderLeft = '2px solid black';
            }
        }
    }

    function getBoard() {
        const cells = grid.querySelectorAll('input');
        const board = [];
        for (let row = 0; row < SIZE; row++) {
            const rowData = [];
            for (let col = 0; col < SIZE; col++) {
                const value = cells[row * SIZE + col].value;
                rowData.push(value === '' ? 0 : parseInt(value));
            }
            board.push(rowData);
        }
        return board;
    }

    function updateBoard(board) {
        const cells = grid.querySelectorAll('input');
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                const cell = cells[row * SIZE + col];
                if (!cell.classList.contains('user-input')) {
                    cell.value = board[row][col];
                    cell.classList.add('solved');
                }
            }
        }
    }

    function validateGrid() {
        const cells = grid.querySelectorAll('input');
        let isValid = true;

        cells.forEach(cell => {
            const value = parseInt(cell.value);
            if (cell.value && (isNaN(value) || value < 1 || value > SIZE)) {
                cell.classList.add('invalid');
                isValid = false;
            } else {
                cell.classList.remove('invalid');
            }
        });

        return isValid;
    }

    function isSafeSimple(board, row, col, num) {
        // Check row and column for 3x3 and 6x6
        for (let x = 0; x < SIZE; x++) {
            if (board[row][x] === num || board[x][col] === num) return false;
        }
        return true;
    }

    function solveSimpleSudoku(board) {
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= SIZE; num++) {
                        if (isSafeSimple(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveSimpleSudoku(board)) return true;
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function isSafe(board, row, col, num) {
        for (let x = 0; x < SIZE; x++) {
            if (board[row][x] === num || board[x][col] === num) return false;
        }

        const subgridSize = Math.sqrt(SIZE);
        const startRow = Math.floor(row / subgridSize) * subgridSize;
        const startCol = Math.floor(col / subgridSize) * subgridSize;

        for (let i = 0; i < subgridSize; i++) {
            for (let j = 0; j < subgridSize; j++) {
                if (board[startRow + i][startCol + j] === num) return false;
            }
        }
        return true;
    }

    function solveSudoku(board) {
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= SIZE; num++) {
                        if (isSafe(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveSudoku(board)) return true;
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
});
