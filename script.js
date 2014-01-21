var rects = [];

var keyPressed = {}
document.onkeydown = function (e) { keyPressed[e.which] = true }
document.onkeyup = function (e) { keyPressed[e.which] = false }


// Player is a rectangle with extra properties
var player = rect(290, 190, 26, 34)
player.velocity = { x: 0, y: 0 }


// set initial player img
var img = document.getElementById("player_r");


function rect(x, y, w, h) {
	return { x: x, y: y, w: w, h: h }
}



// horizontal blocks
for(var i = 0; i < 620; i+=20) {
	rects.push(rect(i, 0, 20, 20));
	rects.push(rect(i, 380, 20, 20));
}


// vertical blocks
for(var i = 0; i < 380; i+=20) {
	rects.push(rect(0, i, 20, 20));
	rects.push(rect(580, i, 20, 20));
}


// Returns true iff a and b overlap
function overlapTest(a, b) {
	return a.x < b.x + b.w && a.x + a.w > b.x &&
		 a.y < b.y + b.h && a.y + a.h > b.y
}


// Move the rectangle p along vx then along vy, but only move
// as far as we can without colliding with a solid rectangle
function move(p, vx, vy) {
    // Move rectangle along x axis
	for (var i = 0; i < rects.length; i++) {
		var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h }
		if (overlapTest(c, rects[i])) {
			if (vx < 0) vx = rects[i].x + rects[i].w - p.x
			else if (vx > 0) vx = rects[i].x - p.x - p.w
		}
	}
	p.x += vx

	// Move rectangle along y axis
	for (var i = 0; i < rects.length; i++) {
		var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h }
		if (overlapTest(c, rects[i])) {
			if (vy < 0) vy = rects[i].y + rects[i].h - p.y
			else if (vy > 0) vy = rects[i].y - p.y - p.h
		}
	}
	p.y += vy
}


// Updates the state of the game for the next frame
function update() {
	player.velocity.x = 3 * (!!keyPressed[68] - !!keyPressed[65]) // right - left
	player.velocity.y = 3 * (!!keyPressed[83] - !!keyPressed[87])

	move(player, player.velocity.x, player.velocity.y)
}


// Renders a frame
function draw() {
	var c = document.getElementById('screen').getContext('2d');

	// draw background
	c.fillStyle = '#000';
	c.fillRect(0, 0, c.canvas.width, c.canvas.height);
	
	// draw player
	if(keyPressed[68])
		img = document.getElementById("player_r");
	else
		if(keyPressed[65])
			img = document.getElementById("player_l");
	c.drawImage(img, player.x - 6, player.y - 5);

	// draw level with blocks
	var blImg = document.getElementById("block");
	for (var i = 0; i < rects.length; i++) {
		var r = rects[i];
		c.drawImage(blImg, r.x, r.y);
	}
}


// Set up the game loop
window.onload = function() {
	setInterval(function() {
		update();
		draw();
	}, 1000 / 60);
}