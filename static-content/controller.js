stage=null;
view = null;
interval=null;
function setupGame(){
	stage=new Stage(document.getElementById('stage'), document.getElementById('miniview'));

	//var reader = new FileReader();

	// get the world json file

	
	//reader.readAsText(document.getElementById('file'));
	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', keyDown);
	document.addEventListener('keyup', keyUp);
	document.addEventListener("mousemove", mouseMove);
	document.addEventListener("click", fire_weapon_clk);
	//document.addEventListener();

}

function startGame(){
	interval=setInterval(function(){ stage.step(); stage.draw();  },20);
}
function pauseGame(){
	clearInterval(interval);
	interval=null;
}

function fire_weapon_clk(event){
	//console.log("bullet fired");
	//console.log(event.clientX, event.clientY);
	stage.player.fire();
}

//stackoverflow
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
		x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function mouseMove(event){
	//canvas = document.getElementById('stage');
	//var mouseposition = getMousePos(canvas, event);
	var mosx = event.clientX + stage.conX ;
	var mosy = event.clientY + stage.conY;
	//console.log(mosx, mosy);
	//stage.player.focus(mouseposition.x, mouseposition.y);
	stage.player.focus(mosx, mosy);
}

function moveByKey(event){
	var key = event.key;
	var moveMap = { 
		'a': { "dx": -1, "dy": 0},
		's': { "dx": 0, "dy": 1},
		'd': { "dx": 1, "dy": 0},
		'w': { "dx": 0, "dy": -1}
	};
	if(key in moveMap){
		//stage.player.move(stage.player, moveMap[key].dx, moveMap[key].dy);
	}
}
function keyDown(e){
	// {a} LEFT:(Dx -1) code: 64
	// {s} DOWN: (Dy 1) code: 83
	// {d} RIGHT: (Dx 1) code: 68
	// {w} UP: (Dy -1) code: 87
	//console.log("");
	//console.log(e.key);
	switch(e.key){

		case 'a':
			stage.player.a = true;
			break;
		case 's':
			stage.player.s = true;
			break;
		case 'd':
			stage.player.d = true;
			break;
		case 'w':
			stage.player.w = true;
			break;
		
	}
	
	if(e.keyCode == 32){
		stage.player.switchWeapon();
		//console.log("space");
	}
	if(e.keyCode == 13){
		//console.log("treetouch");
		stage.player.hack();

	}
	stage.player.step();

}

function keyUp(e){
	switch(e.key){
		case 'a':
			stage.player.a = false;
			break;
		case 's':
			stage.player.s = false;
			break;
		case 'd':
			stage.player.d = false;
			break;
		case 'w':
			stage.player.w = false;
			break;



	}
	stage.player.step();



}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------


