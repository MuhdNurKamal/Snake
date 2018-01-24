directions = ["up", "down", "left", "right"];
oppDirections = ["down", "up", "right", "left"];

// Canvas context
var canvas = document.querySelector("canvas");


// Vector for coordinates
function Vector(x, y) {
	this.x = x; this.y = y;
}

Vector.prototype.add = function(otherVector) {
	return new Vector(this.x + otherVector.x, this.y + otherVector.y);
}

Vector.prototype.minus = function(otherVector) {
	return new Vector(this.x - otherVector.x, this.y - otherVector.y);
}

// World Constructor
function World(plan, canvas) {
	this.width = 20;
	this.height = 20;
	this.grid = [];
	var world = this;
	// Instantiate empty grid
	for(var y = 0; y < this.height; y++) {
		var line = [];
		for(var x = 0; x < this.height; x++) {
			line.push(0);
		}
		this.grid.push(line);
	}
	
	// Instantiate snake at center
	this.snake = new Snake(this, this.width >> 1, this.height >> 1);
	this.grid[this.height >> 1][this.width >> 1] = 1;
	
	this.display = new Display(this, canvas);
	
	// Define snake controls
	addEventListener("keydown", function(event) {
		console.log(event.keyCode);
		switch(event.keyCode) {
			case 40:
				this.changeDirection("down");
				break;
			case 37:
				this.changeDirection("left");
				break;
			case 39:
				this.changeDirection("right");
				break;
			case 38:
				this.changeDirection("up");
				break;
		}
	}.bind(this.snake))
	
	// Set up food
	this.setUpFood();
	
	setInterval(world.update, 300);
}

// Updates the world including the snake and draws the result on canvas
World.prototype.update = function() {
	world.snake.move();
	world.display.draw();
}

// Returns array of Vector positions of block with value n in grid
// 0 -- space, 1 -- body, 2 -- food
World.prototype.findBlock = function(type) {
	var arr = [];
	for(var y = 0; y < this.grid.length; y++) {
		for(var x = 0; x < this.grid[0].length; x++)
			if(this.grid[y][x] == type)
				arr.push(new Vector(x, y));
	}
	return arr;
}

// Randomly spawns food at empty location
World.prototype.setUpFood = function() {
	var emptySpaces = this.findBlock(0);
	var foodSpace = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
	this.grid[foodSpace.y][foodSpace.x] = 2;
}

// Snake Constructor
function Snake(world, startX, startY) {
	this.world = world;
	this.direction = "up";
	this.body = [new Vector(startX, startY)]
}

// Moves snake by 1 unit in its direction
Snake.prototype.move = function() {
	// curr head location
	var currX = nextX =this.body[0].x, currY = nextY = this.body[0].y;
	switch(this.direction) {
		case "up":
			nextY = (currY - 1 + this.world.height) % this.world.height;
			break;
		case "down":
			nextY = (currY + 1) % this.world.width;
			break;
		case "left":
			nextX = (currX - 1 + this.world.width) % this.world.width;
			break;
		case "right":
			nextX = (currX + 1) % this.world.width;
			break;
	}
	var nextBlock = this.world.grid[nextY][nextX];
	
	// No obstruction
	if(nextBlock == 0) {
		// Add head 
		this.body.unshift(new Vector(nextX, nextY));
		this.world.grid[nextY][nextX] = 1;
		// Remove tail
		var tailVector = this.body.pop();
		this.world.grid[tailVector.y][tailVector.x] = 0;
		console.log(this.body.length);
	}
	
	// Body
	if(nextBlock == 1) {
		
	}
	
	// Food
	if(nextBlock == 2) {
		// Add head
		this.body.unshift(new Vector(nextX, nextY));
		this.world.grid[nextY][nextX] = 1;
		this.world.setUpFood();
	}
}

// Changes direction of Snake to newDirection if appropriate
Snake.prototype.changeDirection = function(newDirection) {
	// If already in the same direction
	if(newDirection == this.direction)
		return;
	//Can go opposite if length is 1
	if(newDirection == oppDirections[directions.indexOf(this.direction)]) {
		if(this.body.length == 1) 
			this.direction = newDirection;
		console.log(this.direction);
		return;
	}
	// Length more than 1 or going not opposite direction
	this.direction = newDirection;
}

// Display Constructor
function Display(world, canvas) {
	this.world = world;
	this.blockWidth = canvas.width / world.width;
	this.blockHeight = canvas.height / world.height;
	this.cx = canvas.getContext("2d");
}

Display.prototype.draw = function() {
	// Paint canvas
	var canvasY = 0;
	for(var y = 0; y < this.world.height; y++, canvasY += this.blockHeight) {
		var canvasX = 0;
		for(var x = 0; x < this.world.width; x++, canvasX += this.blockWidth) {
			// 0 for background, 1 for snakeBody
			var block = world.grid[y][x];
			// SnakeBody
			if(block == 1)
				this.cx.fillStyle = "black";
			// BackGround
			else if(block == 0)
				this.cx.fillStyle = "white";
			// Food
			else if(block == 2)
				this.cx.fillStyle = "red";
			
			// Paint block
			this.cx.fillRect(canvasX, canvasY, this.blockWidth, this.blockHeight);
		}
	}
}
var world = new World("", canvas);