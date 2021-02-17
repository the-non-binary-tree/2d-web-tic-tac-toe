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
var userChoseX = false;

// canvas.addEventListener(
//     'click', function(evt) {
//         var cursorPos = getCursorPosition(canvas, evt);
//         console.log(cursorPos);
//         var centerPos = getCenterPosition(cursorPos, cellSide);
//         console.log(centerPos);
//         makeUserMove(userChoseX, canvas, centerPos, radius);
//     }, false
// );


//game logic
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
            if (totalCount >= 5) {
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
    for (var i = 0; i < game.width; i++) {
        for (var j = 0; j < game.height; j++) {
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

//main
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

