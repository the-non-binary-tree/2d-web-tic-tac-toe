function drawGrid(canvas, padding, cellSide){
    var ctx = canvas.getContext("2d");
    for (var x = 0; x <= canvas.width; x += cellSide) {
        ctx.moveTo(x + padding, padding);
        ctx.lineTo(x + padding, canvas.height + padding);
        
    }

    for (var x = 0; x <= canvas.height; x += cellSide) {
        ctx.moveTo(padding, x + padding);
        ctx.lineTo(canvas.width + padding, x + padding);
    }
    ctx.lineWidth = 1
    ctx.strokeStyle = 'gray';
    ctx.stroke();
}

function getCursorPosition(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function getCellPosition(cursorPos, cellSide) {
    return {
        x: Math.floor(cursorPos.x / cellSide),
        y: Math.floor(cursorPos.y / cellSide)
    };
}

function getCenterPosition(cellPos, cellSide) {
    return {
        x: cellPos.x * cellSide + (cellSide / 2),
        y: cellPos.y * cellSide + (cellSide / 2)
    };
}

function clearCanvas(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
}

function drawO(canvas, cellPos, cellSide, radius) {
    var ctx = canvas.getContext('2d');
    centerPos = getCenterPosition(cellPos, cellSide);
    ctx.beginPath();
    ctx.arc(centerPos.x,centerPos.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawX(canvas, cellPos, cellSide, radius) {
    var ctx = canvas.getContext('2d');
    centerPos = getCenterPosition(cellPos, cellSide);
    ctx.beginPath();
    ctx.moveTo(centerPos.x - radius, centerPos.y - radius);
    ctx.lineTo(centerPos.x + radius, centerPos.y + radius);
    ctx.moveTo(centerPos.x + radius, centerPos.y - radius);
    ctx.lineTo(centerPos.x - radius, centerPos.y + radius);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function makeUserMove(userChoseX, canvas, centerPos, radius) {
    if (userChoseX) {
        drawX(canvas, centerPos, radius);
    } else {
        drawO(canvas, centerPos, radius);
    }
}

var canvas = document.getElementById("myCanvas");
var padding = 0;
var cellSide = 40;
var radius = 10;
var winningRequirement = 5;
var userChoseX = false;

const Winner = {"cross": 1, "naught": 2, "tie": 3, "unidentified": 4};
Object.freeze(Winner);

const Player = {"cross": 1, "naught": 2};
Object.freeze(Player);

function Game(boardWidth, boardHeight) {
    this.width = boardWidth;
    this.height = boardHeight;
    this.board = [];
    this.winner = Winner.unidentified;
    for (var i = 0; i < this.width; i++) {
        this.board[i] = [];
    }
    this.currentMover = Player.cross;
    
    this.move = function(mover, x, y) {
        if (!this.board[x][y]) {
            this.board[x][y] = mover;
            this.checkWinner(mover, x, y);
            this.currentMover = 1 + (mover%2);
        } 
        
    };

    this.getBoard = function() {
        return this.board;
    };

    this.checkWinner = function(mover, x, y) {
        const directions = [[-1, 0], [-1, -1], [0, -1], [-1, 1]];
        var board = this.getBoard();
        
        for (var i = 0; i < directions.length; i++) {
            var currentX = x + directions[i][0];
            var currentY = y + directions[i][1];
            var count1 = 0;
            while (currentX >= 0 && currentX < this.height && currentY >= 0 && currentY < this.width) {
                if (board[currentX][currentY] == mover) {
                    count1++;
                    currentX += directions[i][0];
                    currentY += directions[i][1];
                } else {
                    break;
                }
            }

            currentX = x - directions[i][0];
            currentY = y - directions[i][1];
            var count2 = 0;
            while (currentX >= 0 && currentX < this.height && currentY >= 0 && currentY < this.width) {
                if (board[currentX][currentY] == mover) {
                    count2++;
                    currentX -= directions[i][0];
                    currentY -= directions[i][1];
                } else {
                    break;
                }
            }

            var totalCount = count1 + 1 + count2;
            if (totalCount >= winningRequirement) {
                this.winner = mover;
            }
        }
    };
    
    this.getCurrentMover = function () {
        return this.currentMover;
    };

    this.getWinner = function() {
        return this.winner;
    };
}

function drawGame(canvas, game) {
    drawGrid(canvas, padding, cellSide);
    var currentBoard = game.getBoard();
    for (var i = 0; i < game.height; i++) {
        for (var j = 0; j < game.width; j++) {
            var cellPos = {
                x: i,
                y: j
            };
            if (currentBoard[i][j] == Player.cross) {
                drawX(canvas, cellPos, cellSide, radius);
            } else if (currentBoard[i][j] == Player.naught) {
                drawO(canvas, cellPos, cellSide, radius);
            }
        }
    }
}

var game = new Game(15, 15);
drawGame(canvas, game);
canvas.addEventListener(
    'click', function main(evt) {
        var cursorPos = getCursorPosition(canvas, evt);
        var cellPos = getCellPosition(cursorPos, cellSide);
        // mover = game.currentMover;
        game.move(game.currentMover, cellPos.x, cellPos.y);
        // game.checkWinner(mover, cellPos.x, cellPos.y);
        // makeUserMove(userChoseX, canvas, centerPos, radius);
        machineMove = getAutoMove(game);
        console.log(machineMove);
        game.move(game.currentMover, machineMove[0], machineMove[1]);
        clearCanvas(canvas);
        drawGame(canvas, game);
        
        var winner = game.getWinner();
        if (winner != Winner.unidentified) {
            // remove event listener function `main`
            canvas.removeEventListener('click', main);
        }
    }, false
);

document.getElementById("newGame").addEventListener(
    "click", function newGame(){
        game = new Game(15, 15);
        clearCanvas(canvas);
        drawGame(canvas, game);
    }, false
); 

//AIMOve
function calculateCellScore(game, x, y, mover) {
    var board = game.getBoard();
    const directions = [[-1, 0], [-1, -1], [0, -1], [-1, 1]];
    var cellScore = 0;
    
    for (var i = 0; i < directions.length; i++) {
        var currentX = x + directions[i][0];
        var currentY = y + directions[i][1];
        var score1 = 0;

        while (currentX >= 0 && currentX < game.height && currentY >= 0 && currentY < game.width) {
            if (board[currentX][currentY] == mover) {
                score1++;
                currentX += directions[i][0];
                currentY += directions[i][1];
            } else {
                break;
            }
        }

        currentX = x - directions[i][0];
        currentY = y - directions[i][1];
        var score2 = 0;
        while (currentX >= 0 && currentX < game.height && currentY >= 0 && currentY < game.width) {
            if (board[currentX][currentY] == mover) {
                score2++;
                currentX -= directions[i][0];
                currentY -= directions[i][1];
            } else {
                break;
            }
        }
        var totalScore = score1 + score2;
        if (totalScore > cellScore) {
            cellScore = totalScore;
        }
    }
    if (board[x][y]) {
        cellScore = -1;
    }

    return cellScore;
}

//function checked
function playerPotentialCellScores(game, player) {
    playerCellScores = [];
    for (var i = 0; i < game.height; i++) {
        playerCellScores[i] = [];
    }
    for (var i = 0; i < game.height; i++) {
        for (var j = 0; j < game.width; j++) {
            var cellScore = calculateCellScore(game, i, j, player);
            playerCellScores[i][j] = cellScore;
        }
    }
    return playerCellScores;
}

//function checked
function getMaxPotentialScores(playerCellScores) {
    var maxScoreCells = [];
    var maxCellScore = 0;
    for (var i = 0; i < playerCellScores.length; i++) {
        for (var j = 0; j < playerCellScores[0].length; j++) {
            var cellScore = playerCellScores[i][j];
            var cell = [i, j];
            if (cellScore > maxCellScore) {
                maxCellScore = cellScore;
                maxScoreCells.length = 0;
                maxScoreCells.push(cell);
            } else if (cellScore == maxCellScore) {
                maxScoreCells.push(cell);
            }
        }
    }
    return {
        score: maxCellScore,
        cells: maxScoreCells
    };
}

//function checked
function getCellTotalScores(game, selfCellScores, oppCellScores) {
    var cellTotalScores = [];
    for (var i = 0; i < game.height; i++) {
        var rowTotalScores = [];
        for (var j = 0; j < game.width; j++) {
            var selfScore = selfCellScores[i][j];
            var oppScore = oppCellScores[i][j];
            var cellTS = selfScore + oppScore;
            rowTotalScores.push(cellTS);
        }
        cellTotalScores.push(rowTotalScores);
    }
    return cellTotalScores;
}

//function checked
function getMaxTotalScoreCells(nextMoveCells, cellTotalScores) {
    var maxTotalScore = 0;
    var maxTSCells = [];
    for (var id in nextMoveCells) {
        var cell = nextMoveCells[id];
        var x = cell[0];
        var y = cell[1];
        var cellTS = cellTotalScores[x][y];

        if (cellTS > maxTotalScore) {
            maxTotalScore = cellTS;
            maxTSCells.length = 0;
            maxTSCells.push(cell);
        } else if (cellTS == maxTotalScore) {
            maxTSCells.push(cell);
        }
    }
    return maxTSCells;
}

function calculateDistance(x1, y1, x2, y2) {
    var xDistance = Math.abs(x1 - x2)
    var yDistance = Math.abs(y1 - y2);
    var distance = Math.max(xDistance, yDistance);
    return distance;
}

function getNearCenterCells(game, nextMoveCells) {
    var centerX = Math.floor(game.height / 2);
    var centerY = Math.floor(game.width / 2);
    var nearCenterCells = [];
    var minDistance = Math.max(centerX, centerY);
    for (var id in nextMoveCells) {
        var cell = nextMoveCells[id];
        var x = cell[0];
        var y = cell[1];
        var distance = calculateDistance(x, y, centerX, centerY);
        if (distance < minDistance) {
            nearCenterCells.length = 0;
            minDistance = distance;
            nearCenterCells.push(cell);
        } else if (distance == minDistance) {
            nearCenterCells.push(cell);
        }
    }
    return nearCenterCells;
}

function getAutoMove(game) {
    var nextMoveCells = [];

    var self = game.getCurrentMover();
    var selfCellScores = playerPotentialCellScores(game, self);
    var selfMPT = getMaxPotentialScores(selfCellScores);
    var selfScore = selfMPT.score;
    var selfCells = selfMPT.cells;

    var opponent = (game.getCurrentMover() % 2) + 1;
    var oppCellScores = playerPotentialCellScores(game, opponent);
    var oppMPT = getMaxPotentialScores(oppCellScores);
    var oppScore = oppMPT.score;
    var oppCells = oppMPT.cells;

    // first elimination
    (selfScore >= oppScore) ? nextMoveCells = selfCells : nextMoveCells = oppCells;


    var cellTotalScores = getCellTotalScores(game, selfCellScores, oppCellScores);
    // second elimination
    var maxTSCells = getMaxTotalScoreCells(nextMoveCells, cellTotalScores);
    nextMoveCells = maxTSCells;

    
    //third elimination
    var nearCenterCells = getNearCenterCells(game, nextMoveCells);
    nextMoveCells = nearCenterCells;

    //last elimination: randomization
    // var random = items[Math.floor(Math.random()*items.length)]
    var chosenMove = nextMoveCells[Math.floor(Math.random() * nextMoveCells.length)];
    return chosenMove;
}


