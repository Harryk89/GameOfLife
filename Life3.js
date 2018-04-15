
var CELL_SIZE = 10; 
var cells = [], buffCells = [];
var canvas, game;

function init() {
    
    canvas = document.getElementById('canvas').getContext('2d');
    canvas.width =  document.getElementById('canvas').width;
    canvas.height =  document.getElementById('canvas').height;
    
    game = document.getElementById('game').getContext('2d');

    function gameOver() {
        console.log('hello');
    }

    function Grid() {
        this.size = { x : 0, y : 0 };
        this.width = canvas.width;
        this.height = canvas.height;
                
        this.size.x = parseInt(canvas.width / CELL_SIZE, 10); 
        this.size.y = parseInt(canvas.height / CELL_SIZE, 10);        
        
        this.fill = function () {
            var i, j;
            for (i = 0; i < this.size.x; i += 1) {
                cells[i] = [];
                buffCells[i] = [];
                for (j = 0; j < this.size.y; j += 1) {
                    cells[i][j] = false; 
                    buffCells[i][j] = false;
                }
            }
        };
       
        this.draw = function () {
            var i;            
            canvas.translate(0.5, 0.5);
            canvas.beginPath();
            for (i = 0; i <= this.size.x; i += 1) {
                canvas.moveTo(0, i * CELL_SIZE);
                canvas.lineWidth = 1;
                canvas.lineTo(this.width, i * CELL_SIZE);
                canvas.strokeStyle = "#ddd"; 
            }
            
            for (i = 0; i <= this.size.x; i += 1) {
                canvas.lineWidth = 1;
                canvas.moveTo(i * CELL_SIZE, 0);
                canvas.lineTo(i * CELL_SIZE, canvas.height);
                canvas.strokeStyle = "#ddd"; 
            }            
            canvas.stroke();
        };
    }        
    
    function Update() {
       
        this.clear = function () {
            game.clearRect(0, 0, canvas.width, canvas.height);
        };        
        
        this.fillCell = function (x, y) {
            game.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE + 1, CELL_SIZE + 1);   
        };    
  
        this.fill = function () {
            var i, j, grid = new Grid(), upd = new Update();
                        
            upd.clear();
            
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    if (cells[i][j] === true) {
                        upd.fillCell(i, j);
                    }
                }
            }            
            
            upd.cells();
        };        
        
        this.randomFill = function () {
            var i, j, fill, fillRnd, grid = new Grid(), upd = new Update();           
            
            upd.clear();
            
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {                    
                    fill = [true, false][Math.round(Math.random())];
                    cells[i][j] = Boolean(fill);
                }
            }
            
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    fill = cells[i][j];
                    if (fill === true) {                        
                        fillRnd = new Update();
                        fillRnd.fillCell(i, j);
                    }
                }
            }
        };        
        
        this.autoplay = function () {
            var upd = new Update();
            upd.fill();
            setTimeout(function () { upd.autoplay(); },);
        };        
        
        this.getLivingNeighbors = function (x, y) {
            var grid = new Grid(), count = 0, sx = grid.size.x, sy = grid.size.y;
           
            if (x !== 0 && y !== 0) {
                if (cells[x - 1][y - 1] === true) {
                    count += 1;
                }
            }            
            
            if (y !== 0) {
                if (cells[x][y - 1] === true) {
                    count += 1;
                }
            }            
            
            if (x !== sx - 1 && y !== 0) {
                if (cells[x + 1][y - 1] === true) {
                    count += 1;
                }
            }            
            
            if (x !== 0) {
                if (cells[x - 1][y] === true) {
                    count += 1;
                }
            }            
            
            if (x !== sx - 1) {
                if (cells[x + 1][y] === true) {
                    count += 1;
                }
            }            
            
            if (x !== 0 && y !== sy - 1) {
                if (cells[x - 1][y + 1] === true) {
                    count += 1;
                }
            }
                      
            if (y !== sy - 1) {
                if (cells[x][y + 1] === true) {
                    count += 1;
                }
            }            
            
            if (x !== sx - 1 && y !== sy - 1) {
                if (cells[x + 1][y + 1] === true) {
                    count += 1;
                }
            }
            
            return count;
            
        };        
        
        this.cells = function () {
            var i, j, isAlive, count, resul = 0, res, result = false, gameUpd = new Update(), grid = new Grid();
                        
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    
                    result = false;                    
                    
                    isAlive = cells[i][j];                    
                    
                    count = gameUpd.getLivingNeighbors(i, j);
                    
                    if (isAlive && count < 2) {
                        result = false;
                    }
                    if (isAlive && (count === 2 || count === 3)) {
                        result = true;
                    }
                    if (isAlive && count > 3) {
                        result = false;
                    }
                    if (!isAlive && count === 3) {
                        result = true;
                    }
                    if (isAlive=== true) {
                        resul += 1;
                    }
                    
                    buffCells[i][j] = result;                                                                    
                    res = resul;
                }
            }

            console.log(res)  
                        
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    cells[i][j] = buffCells[i][j];
                }
            }            
        };        
        
        this.newUnit = function (unit) {
            var i, j, grid = new Grid(), off_x = parseInt(grid.size.x / 2, 10), off_y = parseInt(grid.size.y / 2, 10);
            
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    cells[i][j] = false;
                }
            }            
            
            switch (unit) {
                case 'glider':
                    cells[off_x + 1][off_y + 2] = true;
                    cells[off_x + 2][off_y + 3] = true;
                    cells[off_x + 3][off_y + 1] = true;
                    cells[off_x + 3][off_y + 2] = true;
                    cells[off_x + 3][off_y + 3] = true;
                    break;
                        
                case 'exploder':
                    cells[off_x + 1][off_y + 1] = true;
                    cells[off_x + 1][off_y + 2] = true;
                    cells[off_x + 1][off_y + 3] = true;
                    cells[off_x + 1][off_y + 4] = true;
                    cells[off_x + 1][off_y + 5] = true;
                        
                    cells[off_x + 3][off_y + 1] = true;
                    cells[off_x + 3][off_y + 5] = true;
                        
                    cells[off_x + 5][off_y + 1] = true;
                    cells[off_x + 5][off_y + 2] = true;
                    cells[off_x + 5][off_y + 3] = true;
                    cells[off_x + 5][off_y + 4] = true;
                    cells[off_x + 5][off_y + 5] = true;
                    break;
                        
                case 'gosper':
                    cells[off_x + 1][off_y + 5] = true;
                    cells[off_x + 1][off_y + 6] = true;
                    cells[off_x + 2][off_y + 5] = true;
                    cells[off_x + 2][off_y + 6] = true;
                    
                    cells[off_x + 12][off_y + 5] = true;
                    cells[off_x + 12][off_y + 6] = true;
                    cells[off_x + 12][off_y + 7] = true;
                        
                    cells[off_x + 13][off_y + 4] = true;
                    cells[off_x + 13][off_y + 8] = true;
                        
                    cells[off_x + 14][off_y + 3] = true;
                    cells[off_x + 14][off_y + 9] = true;
                        
                    cells[off_x + 15][off_y + 4] = true;
                    cells[off_x + 15][off_y + 8] = true;
                        
                    cells[off_x + 16][off_y + 5] = true;
                    cells[off_x + 16][off_y + 6] = true;
                    cells[off_x + 16][off_y + 7] = true;
                        
                    cells[off_x + 17][off_y + 5] = true;
                    cells[off_x + 17][off_y + 6] = true;
                    cells[off_x + 17][off_y + 7] = true;
                        
                    cells[off_x + 22][off_y + 3] = true;
                    cells[off_x + 22][off_y + 4] = true;
                    cells[off_x + 22][off_y + 5] = true;
                        
                    cells[off_x + 23][off_y + 2] = true;
                    cells[off_x + 23][off_y + 3] = true;
                    cells[off_x + 23][off_y + 5] = true;
                    cells[off_x + 23][off_y + 6] = true;
                        
                    cells[off_x + 24][off_y + 2] = true;
                    cells[off_x + 24][off_y + 3] = true;
                    cells[off_x + 24][off_y + 5] = true;
                    cells[off_x + 24][off_y + 6] = true;
                        
                    cells[off_x + 25][off_y + 2] = true;
                    cells[off_x + 25][off_y + 3] = true;
                    cells[off_x + 25][off_y + 4] = true;
                    cells[off_x + 25][off_y + 5] = true;
                    cells[off_x + 25][off_y + 6] = true;
                        
                    cells[off_x + 26][off_y + 1] = true;
                    cells[off_x + 26][off_y + 2] = true;
                    cells[off_x + 26][off_y + 6] = true;
                    cells[off_x + 26][off_y + 7] = true;
             
                    cells[off_x + 35][off_y + 3] = true;
                    cells[off_x + 35][off_y + 4] = true;
                        
                    cells[off_x + 36][off_y + 3] = true;
                    cells[off_x + 36][off_y + 4] = true;
                    break;                  
            }             
             
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                }
            }           
        };
    }

    var gameGrid = new Grid(), gameUpd = new Update(), clearBtn, randBtn, stepBtn, gliderBtn;
    gameGrid.draw();
    gameGrid.fill();
    
    stepBtn = document.getElementById('autoplay');
    stepBtn.onclick = function () {        
        var upd = new Update();
        upd.autoplay();
        
    };    
    
    gliderBtn = document.getElementById('glider');
    gliderBtn.onclick = function () {
        gameGrid.fill();
        gameUpd.newUnit('glider');
        gameUpd.fill();

    };    
    
    gliderBtn = document.getElementById('exploder');
    gliderBtn.onclick = function () {
        gameGrid.fill();
        gameUpd.newUnit('exploder');
        gameUpd.fill();
    };    
   
    gliderBtn = document.getElementById('gosper');
    gliderBtn.onclick = function () {
        gameGrid.fill();
        gameUpd.newUnit('gosper');
        gameUpd.fill();
    };
        
    randBtn = document.getElementById('rand');
    randBtn.onclick = function () { gameUpd.randomFill(); };
}
    
window.onload = init();