function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

class Stage {
	constructor(canvas, mini){
		this.canvas = canvas;
		this.mini = mini;

		mini.width = 200;
		mini.height = 200;
	
	
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		this.enemies=[];
		this.player=null; // a special actor, the player
	
		// the logical width and height of the stage
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		
		// set up terrain 
		this.addActor(new Water(this, 1000, 1000));
		this.addActor(new Water(this, 1000, 1100));
		this.addActor(new Water(this, 1200, 1100));
		this.addActor(new Water(this, 1200, 900));

		this.addActor(new Water(this, 1860, 100));
		this.addActor(new Water(this, 1860, 300));
		this.addActor(new Water(this, 1860, 200));
		this.addActor(new Water(this, 1860, 600));
		this.addActor(new Water(this, 1860, 800));
		this.addActor(new Water(this, 1700, 100));

		
		this.addActor(new Water(this, 190, 1800));
		this.addActor(new Water(this, 170, 1700));
		this.addActor(new Water(this, 400, 1800));
		this.addActor(new Water(this, 400, 1600));



		var trees = 11;
		var ammo = 20;
		var cent = 3;
		var bug = 5;

		// Add trees
		for(var i = 0; i < trees; i++){
			this.createTree();

		}

		//this.createCent();

		// Add ammo





		// have some ammo
		// this.addActor(new Ammo(this, 600,600,10));
		// this.addActor(new Ammo(this, 700,600,10));
		// put in some tress
		// this.addActor(new Tree(this, 200,400));
		// this.addActor(new Tree(this, 400,100));
		// this.addActor(new Tree(this, 500,900));
		// this.addActor(new Tree(this, 1200, 500));
		// this.addActor(new Tree(this, 1860, 1200));

		//this.addActor(new Tree(this, 200,2000));



		// add an ememy 
		

		this.width=canvas.width;
		this.height=canvas.height;

		// Add the player to the center of the stage
		this.addPlayer(new Person(this, Math.floor(this.width/2), Math.floor(this.height/2)));

		this.addActor(new gun(this,600,100));
		this.addActor(new crossbow(this, 600,600));
		this.addActor(new axe(this, 700,600));


		for(var i = 0; i < cent; i++){
			this.createCent();

		}

		for(var i = 0; i < bug; i++){
			this.createBug();

		}

		for(var i = 0; i < ammo; i++){
			this.createAmmo();

		}

		// enemy must be made after player, enemy needs to know where player is 
		// this.createBug();
		// this.createCent();
		// var enemy1 = new EvilBug(this,300,300);
		// var enemy2 = new EvilBug(this,300,700);

		// var enemy3 = new EvilCent(this, 500, 500);
		// this.addActor(enemy3);
		// this.addEnemy(enemy3);
		// this.addActor(enemy1);
		// this.addEnemy(enemy1);
		// this.addActor(enemy2);
		// this.addEnemy(enemy2);




		var conX = 0;
		var conY = 0;
		this.conX = conX;
		this.conY = conY;



	}

	createBug(){
		var enemy = new EvilBug(this,randint(2000),randint(2000));
		this.addActor(enemy);
		this.addEnemy(enemy);

	}
	createCent(){
		var enemy = new EvilCent(this,randint(2000),randint(2000));
		this.addActor(enemy);
		this.addEnemy(enemy);


	}
	createTree(){
		this.addActor(new Tree(this, randint(2000), randint(2000)));

	}
	createAmmo(){
		this.addActor(new Ammo(this, randint(2000),randint(2000),10));

	}

	dead(){
		alert("YOU DIED! HIGH SCORE: " + this.player.points);
		this.removePlayer();
		var x = Math.floor(Math.random()*Math.floor(800)); 
		var y = Math.floor(Math.random()*Math.floor(800)); 
		this.addPlayer(new ghost(this, x, y));
	}
	addPlayer(player){
		this.addActor(player);
		this.player=player;
	}

	removePlayer(){
		this.removeActor(this.player);
		this.player=null;
	}

	addActor(actor){
		this.actors.push(actor);
	}

	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}

	addEnemy(enemy){
		this.enemies.push(enemy);
	}

	removeEnemy(enemy){
		var index=this.enemies.indexOf(enemy);
		if(index!=-1){
			this.enemies.splice(index,1);
		}
	}

	// Take one step in the animation of the game.  Do this by asking each of the actors to take a single step. 
	// NOTE: Careful if an actor died, this may break!
	step(){

		for(var i=0;i<this.actors.length;i++){


			//console.log(this.actors[i].name);
			this.actors[i].step();
			// check if this bullet hit any of the enemies (or players later)
			if(this.actors[i].name == "Bullet" || this.actors[i].name == "arrow"){

				//console.log(this.actors[i]);
				for(var j=0;j<this.enemies.length;j++){
					if(this.actors[i] != null){

					
					//console.log(this.actors[i]);
					this.actors[i].position.x = Math.round(this.actors[i].position.x);
					this.actors[i].position.y = Math.round(this.actors[i].position.y );

					this.enemies[j].position.x = Math.round(this.enemies[j].x);
					this.enemies[j].position.y = Math.round(this.enemies[j].y );
					//console.log("bullet",this.actors[i].position);
					//console.log("enemy", this.enemies[j].position);
					var hit = this.contact(this.enemies[j], this.actors[i]);

					if(hit == true){
						//console.log(this.actors[i].user);
						if(this.actors[i].user == "player"){
							//console.log("hit");
							this.enemies[j].attacked(this.actors[i]);
					}
					}
				}					


				}


			 }
			var crash = this.contact(this.actors[i], this.player);
			if(crash == true){
				//console.log(this.actors[i].name);
				this.player.contact = true;
				this.player.crash(this.actors[i]);
				if(this.actors[i] != null){
					if(this.actors[i].name == "Bullet"){
						if(this.actors[i].user == "enemy"){

							this.player.attacked(this.actors[i]);

						}
						

					}
			}
				
			}
			else{
				this.player.contact = false;
			}
			//this.player.contact = false;

		}
		if (this.player != null){
			this.player.step();
		}
	}

	draw(){
		var back = document.getElementById("back");
		var space = document.getElementById("space");
		//space.src = "./images/untitled.png";
		
		var spacew = space.width;
		var spaceh = space.height;
		
		// this.width = spacew;
		// this.height = spaceh
		this.width = 2000;
		this.height = 2000;		
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		var context = this.canvas.getContext('2d');
		context.imageSmoothingEnabled = false;

		//context.save();

		this.update();
		context.drawImage(back, 0,0);
		context.drawImage(space,0,0);

		//var crash = false;
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
			//console.log(crash);
			
		}

		var con = this.mini.getContext('2d');
		con.imageSmoothingEnabled = false;
		con.drawImage(document.getElementById("stage"), 0,0, 2000,2000,0,0,200,200);
		context.drawImage(document.getElementById("miniview"),this.conX,this.conY);
	



		
		//console.log(crash);
		//context.restore();
		

	}



	update(){

		var conX = this.player.position.x - (window.innerWidth /2);
		var conY = this.player.position.y - (window.innerHeight /2);
		var context = this.canvas.getContext('2d');
		context.imageSmoothingEnabled = false;

		//console.log(this.player.position);

		// comparing player position to set context transformation X and Y
		if(this.player.position.x > this.canvas.width - window.innerWidth/2){
			conX = this.canvas.width-window.innerWidth;

		}
		if(this.player.y > this.canvas.height - window.innerHeight/2){
			conY = this.canvas.height - window.innerHeight;

		}

		if(this.player.y >= 2880){
			conY = this.canvas.height - window.innerHeight - 320;

		}
	
		if(this.player.position.x < window.innerWidth / 2 ){
			conX = 0;

		}
		if(this.player.position.y < window.innerHeight / 2){
			conY = 0;

		}
		context.setTransform(1,0,0,1, -conX, -conY);
		this.conX = conX;
		this.conY = conY;




	}

	// return the first actor at coordinates (x,y) return null if there is no such actor
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;
	}

	contact(actor, player){
		// check actor's position to see if player is in contact with the actor 
		var crash = false;

		var playerleft = player.position.x;
	    var playerright = player.position.x ;

	    if(actor == null){
	    	return crash;

	    }


	    var actorleft = actor.position.x;
	    var actorright = actor.position.x + actor.width;
	    
	    var actortop = actor.position.y;
	    var actorbottom = actor.position.y + actor.height;


	    if(actor.name == "enemy"){
	    	actorleft = actor.position.x - actor.width/2;
	    	actorright = actor.position.y - actor.height/2;
	    	//actortop = actor.position.y + actor.height/2;
	    	//actorbottom = actor.position.y - actor.

	    }

	     else if(actor.name == "Tree" ||  actor.name == "Water"){
	    	//console.log("tree");
	    	actorleft = actor.x - actor.width/2;
	    	actorright = actor.x + actor.width/2;
	    	actortop = actor.y - actor.height/2;
	    	actorbottom = actor.y +  actor.height/2;


	    	var checkx = ((this.player.position.x >= actorleft) && (this.player.position.x <= actorright));
	    	var checky = ((this.player.position.y >= actortop) && (this.player.position.y <= actorbottom));
	    	
	    	//console.log(checkx, checky);

	    	if(checkx && checky){
	    		crash = true;
	    		//console.log(actor.width, actor.height);
	    		//console.log(this.player.x, this.player.y);
	    		//console.log("in bound");
	    		return crash;
	    		//console.log("in bound");

	    	}

	    }
	     else if(actor.name == "Ammo" || actor.name == "Coins"){
	    	actorleft = actor.x - actor.width/2;
	    	actorright = actor.x + actor.width/2;
	    	actortop = actor.y - actor.height/2;
	    	actorbottom = actor.y +  actor.height/2;

	    	var playerleft = this.player.position.x - this.player.width/2;
	    	var playerright = this.player.position.x + this.player.width/2;
	    	var playertop = this.player.position.y - this.player.height/2;
	    	var playerbottom = this.player.position.y + this.player.height/2;

	    	var checkx = ((actor.x >= playerleft) && (actor.x <= playerright));
	    	var checky = ((actor.y >= playertop) && (actor.y <= playerbottom));
	    	if(checkx && checky){
	    		crash = true;
	    		//console.log("in bound");
	    		return crash;
	    		//console.log("in bound");

	    	}




	    } 

	    else if(actor.name == "Bullet"){
	    	var bullx = actor.x;
	    	var bully = actor.y;

	    	var pw = this.player.position.x + 50;
	    	var ph = this.player.position.y +50;

	    	var checkx = ((bullx >= this.player.position.x) && (bullx<= pw));
	    	var checky = ((bully >= this.player.position.y) && (bully <= ph));

	    	if(checkx && checky){
	    		crash = true;
	    		return crash;

	    	}

	    } 

	    if(actor.width != null && actor.height != null){

			 if((player.position.x > actorleft && player.position.x < actorright) &&
			 	(player.position.y > actortop && player.position.y < actorbottom)){

			 	crash = true;

			 }

	    }
	   
	    return crash;



	}

} // End Class Stage



class Pair {
	constructor(x,y){
		this.x=x; this.y=y;
	}

	toString(){
		return "("+this.x+","+this.y+")";
	}

	normalize(){
		var magnitude=Math.sqrt(this.x*this.x+this.y*this.y);
		this.x=this.x/magnitude;
		this.y=this.y/magnitude;
	}
}



class Actor{
	constructor(stage, x, y){
		this.stage = stage;
		this.position = new Pair(x,y);
		var name;
		this.name = name;
	}
	
	step(){
		return;
	}
	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}
	setName(name){
		this.name = name;

	}
}


class Person extends Actor {
	constructor(stage, x,y){
		super(stage, x, y);
		super.intPosition();
		this.health = 100;
		var colour= 'rgba(0,0,0,1)';
		this.colour = colour;
		//this.gun = new gun();
		//this.stage.addActor(gun);
		this.bullet_size = 2;
		this.center = new Pair(x + this.bullet_size , y+this.bullet_size);
		this.mouse = new Pair(x,y);
		//var contact = false;
		this.contact = false;
		super.setName("player");
		this.a = false;
		this.s = false;
		this.d = false;
		this.w = false;
		this.multiples = 4;
		
		this.nextx;
		this.nexty;
		this.points = 0;
		this.treetouch = false;
		this.width = 0;
		this.height =0;
		var img = document.getElementById("player");
		this.x = this.x - img.width/2;
		this.y = this.y - img.height/2;
		this.inventory = [];
		this.index = -1;


	}
	focus(newX, newY){
		this.mouse = new Pair(newX, newY);
	}


	addWeapon(actor){

		this.inventory.push(actor);
		//console.log(this.index);

		if(this.index < 0){
			this.index = this.inventory.length -1;
			this.gun = this.inventory[this.index];
			this.gun.pickedup = true;
			this.gun.inventory = false;

		} else{
			this.switchWeapon();
		}
		//this.index += 1;
	}


	dropweapon(){

		if(this.gun != null){
			this.gun.pickedup = false;

		}
		this.gun = null;

	}

	switchWeapon(){

		console.log(this.inventory);
		this.index += 1;
		console.log(this.index);
		if(this.index >= this.inventory.length || this.index < 0){
			this.index = 0;
		}
		if(this.inventory.length == 0){
			return;
		}else{
			this.gun = this.inventory[this.index];
			this.gun.pickedup = true;
			this.gun.inventory = false;

		}

		for(var i = 0; i < this.inventory.length; i++){
			if(i != this.index){
				this.inventory[i].inventory = true;


			}

		}


	}
	hack(){
		this.treetouch = true;

	}

	step(){
		//this.treetouch = false;
		//var multiples = 10;

		if(this.a == true){
			this.position.x = this.position.x - 1 * this.multiples;

		}
		if(this.d == true){
			this.position.x = this.position.x + 1 * this.multiples;

		}
		if(this.s == true){
			this.position.y = this.position.y + 1 * this.multiples;

		}
		if(this.w == true){
			this.position.y = this.position.y - 1 * this.multiples;

		}


		if (this.position.x < 0){
			this.position.x = 0;
		}
		
		if(this.position.x > this.stage.width){
			
			this.position.x = this.stage.width;
		}
		if (this.position.y < 0){
			this.position.y = 0;
		}
		if (this.position.y > this.stage.height){
			this.position.y = this.stage.height;
		}
		this.intPosition();
		this.center = new Pair(this.x + this.bullet_size , this.y+this.bullet_size);

		if (this.position.x - this.radius/2 < 0) {
      			this.position.x = this.radius/2;
    	} 

    	if(this.position.y - this.radius/2 < 0) {
      			this.position.y = this.radius/2;
    	}
    	//this.multiples = 4;

	}

	fire(){

		if (this.gun != null){
			if(this.gun.pickedup == true){

				if (this.gun.fire_wapon()){
					var x = this.mouse.x-this.position.x ;
					var y = this.mouse.y-this.position.y;
					var length = Math.sqrt((x*x)+y*y); 
					var multiples = this.gun.shootingSpeed;
					var speed = new Pair((x/length)*multiples, (y/length)*multiples);
					var bullet_size = 4;
					if(this.gun.name == "Gun"){
						var position = new Pair(this.position.x, this.position.y);
						var bullets = new Bullet(this, this.stage, position, speed, bullet_size, this.gun.maxDistance);
						bullets.setUser("player");
						this.stage.addActor(bullets);

					}
					if(this.gun.name == "crossbow"){
						var position = new Pair(this.position.x, this.position.y);
						var arrows = new arrow(this, this.stage, position, speed, bullet_size, this.gun.maxDistance);
						arrows.setUser("player");
						arrows.mousex = this.mouse.x;
						arrows.mousey = this.mouse.y;
						this.stage.addActor(arrows);
					}

				
				}

			}


		}		
	}



	draw(context){
		this.multiples = 4;
		context.save();

		var initX = this.position.x;
		var initY = this.position.y;

		

		context.translate(initX, initY);
		var mouse_x = this.mouse.x;
		var mouse_y = this.mouse.y;
		context.restore();
		//context.save();
		context.restore();
		// context.fillStyle = this.colour;
		//context.rotate(Math.atan2(mouse_y - initY, mouse_x - initX));
		var img = document.getElementById("player");
		//img.src = "./images/player.png";
		var imgx = img.width /2;
		var imgy = img.height/2;

		this.width = 50;
		this.height = 50;





    	context.save();
		context.translate(initX, initY);
		//context.setTransform(1,0,0,1,initX, initY);
		context.rotate(Math.atan2(mouse_y - initY, mouse_x - initX)-55);
		context.drawImage(img, 0, 0, img.width, img.height,-32, -37, 50, 50);
		//context.drawImage(img,img.width, img.height);
		//ctx.setTransform(1, 0, 0, 1, 0, 0);
		context.beginPath(); 
		context.fill();
		context.restore();
		
		this.display_onscreen(context);
	
		
	}

	display_onscreen(context){

		var type ;
		var curAmmo;
		var totalAmmo;
		if(this.gun){
			
			type =  this.gun.name;
			curAmmo = this.gun.init_ammo;
			totalAmmo = this.gun.totalAmmo;

		}else{
			type = "None"
			curAmmo = 0;
			totalAmmo = 0;
		}


		context.font = 'normal 16px Arial';
		context.fillStyle = 'rgba(255,0,0,1)';
		//context.fillRect(800/2 - 390 + this.stage.conX , 800 - 40 + this.stage.conY, 250, 25);
		context.fillRect(800/2 + this.stage.conX ,this.stage.conY + 25, 250, 25);
		context.fillStyle = 'rgba(0,255,0,1)';
		//context.fillRect(800/2 - 390 + this.stage.conX, 800+this.stage.conY-40, 250*(curAmmo/25), 25);
		context.fillRect(800/2  + this.stage.conX, this.stage.conY + 25, 250*(curAmmo/25), 25);

		//var type =  this.gun.name;
		var display = " - Ammunition"; 
		var res = type.concat(display);

		
		//--------------------------- Ammo display


		context.fillStyle = 'rgba(0,0,0,1)';
		context.fillText(res.toUpperCase(), 405 +this.stage.conX ,this.stage.conY +45);

		context.fillStyle = 'rgba(0,0,0,1)';
		context.fillText(totalAmmo, 625+this.stage.conX , this.stage.conY +45);

		//--------------------------- Health display

		context.fillStyle = 'rgba(255,0,0,1)';
		context.fillRect(700 + this.stage.conX, 25 +this.stage.conY, 250, 25);

		context.fillStyle = 'rgba(0,255,0,1)';
		context.fillRect(700+ this.stage.conX, 25 + this.stage.conY, 250*(this.health/100), 25);

		context.fillStyle = 'rgba(0,0,0,1)';
		context.fillText("HEALTH", 710+ this.stage.conX ,45+ this.stage.conY);

		context.fillStyle = 'rgba(0,0,0,1)';
		context.fillText(this.health, 800+ this.stage.conX , 45+ this.stage.conY);
		
		//--------------------------- points display

		context.fillStyle = 'rgba(0,0,0,1)';
		context.globalAlpha = 0.4;
		context.fillRect(this.stage.conX +1000,25 + this.stage.conY,100,25 );
		context.globalAlpha = 1;
		var coins = document.getElementById("coins");
		context.drawImage(coins, this.stage.conX +1000,25+ this.stage.conY);
		
		context.fillStyle = 'rgba(255,255,255,1)';
		context.fillText(this.points,this.stage.conX +1050, 45+ this.stage.conY);

		//--------------------------- inventory display
		context.fillStyle = 'rgba(0,0,0,1)';
		context.globalAlpha = 0.4;
		context.fillRect(this.stage.conX +1200, 25+ this.stage.conY,310,25 );
		context.globalAlpha = 1;
		var bag = "inventory:  ";
		context.fillStyle = 'rgba(255,255,255,1)';
		context.fillText(bag.toUpperCase(),this.stage.conX +1210, 45+ this.stage.conY);		
		for(var i =0; i < this.inventory.length; i++){
			//bag += this.inventory[i].name + "   ";
			if(this.inventory[i].name.toUpperCase() == "AXE"){
				var img = document.getElementById("axe");
				var scale = 0.14;
				context.drawImage(img,0,0,img.width, img.height, this.stage.conX + 1290, this.stage.conY +3, img.width*scale, img.height*scale);
			} else if(this.inventory[i].name.toUpperCase() == "CROSSBOW"){
				var scale = 0.5;
				var img = document.getElementById("before");
				context.drawImage(img,0,0,img.width, img.height, this.stage.conX + 1350, this.stage.conY+25, img.width*scale, img.height*scale);
			

			} else{
				var img = document.getElementById("gun");
				var scale = 0.05;
				context.drawImage(img,0,0,img.width, img.height, this.stage.conX + 1425, this.stage.conY+25, img.width*scale, img.height*scale);
			

			}
			

		}






	}
	attacked(actor){

		if(actor.user == "player"){
			return;

		}
		this.health -= 10;
		if(this.health <= 0){
			//this.stage.removePlayer();
			//this.stage.addPlayer(new ghost(this.stage, 0,0));
			if(this.gun){
				this.gun.pickedup = false;

			}
			this.stage.dead();
		}
		this.stage.removeActor(actor);

	}
	crash(actor){

		if(actor.name == "Gun" || actor.name == "crossbow" || actor.name == "axe"){
			// if(this.gun != null){
			// 	return;
			// }
			this.gun = actor;
			this.gun.inventory = true;
			this.addWeapon(actor);
			
			
			
			actor.pickedup = true;
			actor.position.x = this.position.x;
			actor.position.y = this.position.y;

		}
		if(actor.name == "Water"){
			this.multiples=1;
		}else{
			this.multiples=4;
		}
		if(actor.name == "Tree"){
			this.contact = true;
			if(this.gun != null){
				if(this.treetouch == true && this.gun.name == "axe"){
					
					actor.hack();
				}

			}


	    	var actorleft = actor.x - actor.width/2;
	    	var actorright = actor.x + actor.width/2;
	    	var actortop = actor.y - actor.height/2;
	    	var actorbottom = actor.y +  actor.height/2;


	    	var posx = Math.ceil(this.position.x /10)*10;
	    	var posy = Math.ceil(this.position.y/10)*10;

	    	if(posx+10 >= actorright){
	    		this.position.x += 10;

	    	}
	    	if(posx-10 <= actorleft){
	    		this.position.x -= 10;

	    	}

	    	if(posy+10 >= actorbottom){
	    		this.position.y += 10;
	    	}
	    	if(posy-10 <= actortop){
	    		this.position.y -=10;

	    	}
		}
		if(actor.name == "Ammo"){
			
			if(this.gun != null){
				var curAmmo = this.gun.init_ammo;
				var totalAmmo = this.gun.totalAmmo;
				
				if(actor.amount != null){
					
					var add = actor.amount;
					curAmmo = curAmmo + add;
					if(curAmmo > totalAmmo){
						curAmmo = totalAmmo;
					}
					this.gun.init_ammo= curAmmo;
				}
				this.stage.removeActor(actor);
				this.stage.createAmmo();
			}
		} if(actor.name == "Coins"){
			this.points += actor.amount;
			sessionStorage.setItem("points",this.points);
			this.stage.removeActor(actor);

		}
		this.treetouch = false;


	}



}


class weapon extends Actor{
	constructor(name, damage, init_ammo, totalAmmo, maxDistance, shootingSpeed, stage, position){
		super(stage, position.x, position.y);
		super.intPosition();
		this.stage = stage;
		//this.position = position;

		this.name = name;
		this.damage = damage;
		this.init_ammo = init_ammo;
		this.totalAmmo = totalAmmo;
		this.maxDistance = maxDistance;
		this.shootingSpeed = shootingSpeed;
		this.pickedup = false;
	}
	draw(context){
		return;
	}
	fire_wapon(){
		if (this.init_ammo <= 0){
			return false;
		}else{
			this.init_ammo -= 1;
			if (this.init_ammo <= 0){
			}
		}
		return true;
	}
	step(){

		this.position.x=this.position.x;
		this.position.y=this.position.y;
		
		this.intPosition();

	}
}

class gun extends Actor{
	constructor(stage,x,y){
		super(stage,x,y);
		this.intPosition();

		this.stage = stage;
		this.pickedup = false;
		super.setName("Gun");
		this.width = 0;
		this.height =0;

		this.mouse_x;
		this.mouse_y;

		this.damage = 50;
		this.init_ammo = 25;
		this.totalAmmo = 25;
		this.maxDistance = 100;
		this.shootingSpeed = 5;
		this.inventory = false;


	}

	enemySet(enemy){
		this.init_ammo = 200;
		this.totalAmmo = 200;

	}
	draw(){
		var g = document.getElementById("gun");
		//g.src = "./images/gun.png";
		
		this.h = g.width;
		this.w= g.height;

		var context = this.stage.canvas.getContext('2d');
		context.save();
		var scale = 0.2;

		this.height = this.h*scale;
		this.width = this.w*scale;


		context.imageSmoothingEnabled = false;
		if (this.pickedup == false){
			context.drawImage(g, this.position.x, this.position.y, this.w*scale*scale, this.h*scale);	
		} else if(this.inventory){
			

		}
		else{
		
			var mouse_x = this.mouse_x;
			var mouse_y = this.mouse_y;
		
			var initX = this.position.x;
			var initY = this.position.y;

			context.translate(initX,initY);

			context.rotate(Math.atan2(mouse_y - initY, mouse_x - initX)-55);
			context.drawImage(g, -32, -37, this.w*scale*scale, this.h*scale);	
			context.setTransform(1,0,0,1,0,0);
			context.beginPath(); 
			context.fill();
			context.restore();

		}	
		context.restore();

		return;
	}
	step(){	
		if(this.pickedup == true){
			this.mouse_x = this.stage.player.mouse.x;
			this.mouse_y = this.stage.player.mouse.y;
			this.position.x = this.stage.player.position.x;
			this.position.y = this.stage.player.position.y;
		}
		else{
			this.position.x=this.position.x;
			this.position.y=this.position.y;

		}	

		
		this.intPosition();
	}
		fire_wapon(){
		if (this.init_ammo <= 0){
			return false;
		}else{
			this.init_ammo -= 1;
			if (this.init_ammo <= 0){
			}
		}
		return true;
	}


}


class Bullet extends Actor{

	constructor(player, stage, position, velocity, size, duration){
		super(stage,position.x, position.y);
		this.stage = stage;
		this.position.x=position.x;
		this.position.y =position.y;
		this.intPosition();
		this.duration = duration;
		this.velocity=velocity;
		this.size = size;
		this.player = player
		//this.name = "Bullet"
		super.setName("Bullet");
		this.user = null;
		this.cent = false;
			}
	

	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}
	setUser(user){
		this.user = user;

	}

	step(){
		
		this.duration=this.duration-1;
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;
		//this.intPosition();
		
		this.intPosition();
		// this.point();
	}
	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}
	point(position){
		this.velocity.normalize();
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
	}
	draw(context){
		if (this.duration > 0){
			if(this.cent){
				context.fillStyle = 'rgba(0,255,0,1)';
		   		// context.fillRect(this.x, this.y, this.radius,this.radius);
				context.beginPath(); 
				context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false); 
				context.fill();
				return;


				

			}
			context.fillStyle = 'rgba(0,0,0,1)';
	   		// context.fillRect(this.x, this.y, this.radius,this.radius);
			context.beginPath(); 
			context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false); 
			context.fill();


		}
		else{
			this.stage.removeActor(this);
		}
	}
}

class Tree extends Actor{
	constructor(stage, x,y){
		super(stage, x, y);
		super.intPosition();
		this.height = 0;
		this.width = 0;
		super.setName("Tree");
		this.size = 200;


	}

	draw(){
		var tree = document.getElementById("tree");
		//tree.src = "./images/tree.png";
		
		this.height= this.size;
		this.width= this.size;
		var context = this.stage.canvas.getContext('2d');
		
		
		context.imageSmoothingEnabled = false;
		context.drawImage(tree, this.x-this.width/2, this.y-this.height/2, this.width,this.height);



	}
	hack(){
		this.size -= 50;
		if(this.size <= 0){
			this.stage.removeActor(this);
			var coins = new Coins(this.stage,this.x, this.y,5);
			this.stage.addActor(coins);
			console.log("creating new tree");
			this.stage.createTree();


		}


	}


}

class EvilBug extends Actor{
	constructor(stage, x,y){
		super(stage, x, y);
		super.intPosition();
		this.stage = stage;
		this.height = 0;
		this.width = 0;
		super.setName("Enemy");
		var player = this.stage.player;
		this.player = player;
		this.life = 10;
		this.gun = new gun(this.stage, this.position.x, this.position.y);
		this.gun.enemySet();
		this.shoot = true;
		this.firetime = 0;

	}


	fire(){

		if (this.gun.fire_wapon()){
			var x = this.player.position.x-this.x-50;
			var y = this.player.position.y-this.y-50;
			
			var length = Math.sqrt((x*x)+y*y); 
			var multiples = this.gun.shootingSpeed;

			var speed = new Pair((x/length)*multiples, (y/length)*multiples);
			
			var bullet_size = 4;
			
			var position = new Pair(this.x+this.width, this.y+this.height);
			
			var bullets = new Bullet(this, this.stage, position, speed, bullet_size, this.gun.maxDistance);
			bullets.setUser("enemy");
			
			this.stage.addActor(bullets);
		
		}
	}
	step(){

		// we want enemy to fire every 1 second, step gets called every 20 mili s so count to 50 and then call fire
		this.firetime += 1;
		var inrange = false;
		

		var difX = this.player.position.x - this.x;
		var difY = this.player.position.y - this.y;

		var step = 0.5;
		if(difX > 0 && difX < 500){

			this.x += step;
			inrange = true;
		}
		if (difX < 0 && Math.abs(difX) < 500){
			this.x -= step;
			inrange = true;
		}
		if(difY > 0  && difY < 500){
			this.y += step;
			inrange = true;

		}
		if (difY < 0 && Math.abs(difY) < 500){
			this.y -= step;
			inrange = true;
		} 
		if(inrange == false){
			this.shoot = false;
		}
		if(inrange == true){
			this.shoot = true;
		}

		
		if(this.firetime == 50){
			if(this.shoot){
				this.fire();

			}
			
			this.firetime = 0;

		}

	}

	draw(){
		var bug = document.getElementById("bug");
		

		var context = this.stage.canvas.getContext('2d');
		var scale = 2;
		this.height = bug.width*scale;
		this.width= bug.height*scale;
		context.imageSmoothingEnabled = false;
		context.drawImage(bug, this.x+this.width/2, this.y+this.height/2, this.width, this.height);	

		context.fillStyle = 'rgba(255,0,0,1)';
		context.fillRect(this.x+this.width/2, this.y+20, this.width, 5);

		context.fillStyle = 'rgba(0,255,0,1)';
		context.fillRect(this.x+this.width/2 ,this.y+20, this.width*(this.life*10/100), 5);

	}

	attacked(actor){
		this.life -= 1;
		if(this.life == 0){
			this.stage.removeActor(this);
			var coins = new Coins(this.stage,this.x, this.y,10);

			this.stage.addActor(coins);
			this.stage.createBug();

		}
		this.stage.removeActor(actor);
		

	}

}

class EvilCent extends Actor{
	constructor(stage, x,y){
		super(stage, x, y);
		super.intPosition();
		this.stage = stage;
		this.height = 0;
		this.width = 0;
		super.setName("Enemy");
		var player = this.stage.player;
		this.player = player;
		this.life = 20;
		this.gun = new gun(this.stage, this.position.x, this.position.y);
		this.gun.enemySet();
		this.shoot = true;
		this.firetime = 0;
		var bug = document.getElementById("cent");
		this.width = bug.width;
		this.height = bug.height;

		this.x = this.x - this.width/2;
		this.y = this.y - this.height/2;

	}


	fire(){
	
		if (this.gun.fire_wapon()){
			var x = this.player.position.x-this.x-50;
			var y = this.player.position.y-this.y-50;
			
			var length = Math.sqrt((x*x)+y*y); 
			var multiples = this.gun.shootingSpeed;

			var speed = new Pair((x/length)*multiples, (y/length)*multiples);
			
			var bullet_size = 6;
			
			var position = new Pair(this.x+this.width, this.y+this.height);
	
			
			var bullets = new Bullet(this, this.stage, position, speed, bullet_size, this.gun.maxDistance);
			bullets.setUser("enemy");
			bullets.cent = true;
			
			this.stage.addActor(bullets);
		
		}
	}
	step(){

		// we want enemy to fire every 1 second, step gets called every 20 mili s so count to 50 and then call fire
		this.firetime += 1;
		var inrange = false;
		

		var difX = this.player.position.x - this.x;
		var difY = this.player.position.y - this.y;

		var step = 0.5;
		if(difX > 0 && difX < 500){

			this.x += step;
			inrange = true;
		}
		if (difX < 0 && Math.abs(difX) < 500){
			this.x -= step;
			inrange = true;
		}
		if(difY > 0  && difY < 500){
			this.y += step;
			inrange = true;

		}
		if (difY < 0 && Math.abs(difY) < 500){
			this.y -= step;
			inrange = true;
		} 
		if(inrange == false){
			this.shoot = false;
		}
		if(inrange == true){
			this.shoot = true;
		}

		
		if(this.firetime == 50){
			if(this.shoot){
				this.fire();

			}
			
			this.firetime = 0;

		}

	}

	draw(){
		var bug = document.getElementById("cent");
		

		var context = this.stage.canvas.getContext('2d');
		var scale = 1;
		this.height = bug.height*scale;
		this.width= bug.width*scale;
		context.imageSmoothingEnabled = false;
		context.drawImage(bug, this.x, this.y, this.width, this.height);	

		context.fillStyle = 'rgba(255,0,0,1)';
		context.fillRect(this.x-this.width/2, this.y-this.height/4, this.width*2, 5);

		context.fillStyle = 'rgba(0,255,0,1)';
		context.fillRect(this.x - this.width/2 ,this.y-this.height/4, this.width*(this.life*10/100), 5);

	}

	attacked(actor){
		this.life -= 1;
		if(this.life == 0){
			this.stage.removeActor(this);
			var coins = new Coins(this.stage,this.x, this.y,10);
			var coins2 = new Coins(this.stage,this.x+10, this.y,10);
			this.stage.addActor(coins);
			this.stage.addActor(coins2);
			this.stage.createCent();
			

		}
		this.stage.removeActor(actor);
		

	}

}






class Ammo extends Actor{

	constructor(stage, x,y, amount){
		super(stage, x, y);
		super.intPosition();
		this.amount = amount;
		this.actor = null;
		super.setName("Ammo");
		this.width = amount *2;
		this.height = amount *2;


	}

	draw(context){
		if(this.actor == null){
			context.fillStyle = 'rgba(0,0,0,1)';
			context.beginPath(); 
			context.arc(this.x, this.y, this.amount, 0, 2 * Math.PI, false); 
			context.fill();
		
			}
		else{
			this.stage.removeActor(this);
			this.stage.createAmmo();
		}
	}






}
class ghost extends Actor{

	constructor(stage, x,y){
		super(stage, x, y);
		super.intPosition();
		this.health = 100;
		var colour= 'rgba(0,0,0,1)';
		this.colour = colour;
		this.bullet_size = 2;
		this.center = new Pair(x + this.bullet_size , y+this.bullet_size);
		this.mouse = new Pair(x,y);

		this.contact = false;
		super.setName("player");
		this.a = false;
		this.s = false;
		this.d = false;
		this.w = false;
		this.multiples = 10;


	}

	draw(){
		var img = document.getElementById("ghost");
		var context = this.stage.canvas.getContext('2d');

		var scale = 0.1;
		this.width = img.width*scale;
		this.height = img.height*scale;

		context.drawImage(img,this.position.x, this.position.y, this.width, this.height);
	}
	focus(x,y){
		return;
	}
	step(){

		if(this.position.y < 100 && !this.contact){
			this.position.y += 1;

		}else{
			this.contact = true;
			this.position.y -=1;
		}
		if(this.position.x < 100 && !this.contact){
			this.position.x += 1;

		} else{
			this.contact = true;
			this.position.x -=1;
		}

		if(this.position.x < 0){
			this.contact = false;
			this.position.x = 0;
			//check = -check;


		}
		if(this.position.y < 0){
			this.contact = false;
			this.position.y = 0;
			//check = -check;

		}		
		return;
	}
	fire(){
		return;
	}
	move(){
		return;
	}
	attacked(a){
		return;
	}
	crash(a){
		return;
	}


}

class crossbow extends Actor{
	constructor(stage,x,y){
		super(stage,x,y);
		this.intPosition();

		this.stage = stage;
		this.pickedup = false;
		super.setName("crossbow");
		this.width = 0;
		this.height =0;

		this.mouse_x;
		this.mouse_y;

		this.damage = 20;
		this.init_ammo = 25;
		this.totalAmmo = 25;
		this.maxDistance = 50;
		this.shootingSpeed = 5;
		this.inventory = false;


	}

	draw(){
		var g = document.getElementById("before");

		this.h = g.height;
		this.w= g.width;

		var context = this.stage.canvas.getContext('2d');
		context.save();
		var scale = 1;

		this.height = this.h*scale*scale;
		this.width = this.w*scale;

		context.imageSmoothingEnabled = false;
		if (this.pickedup == false){

			context.drawImage(g, this.position.x , this.position.y-40, this.w*scale*scale, this.h*scale);	
		} else if(this.inventory){
		}
		else{
			var mouse_x = this.mouse_x;
			var mouse_y = this.mouse_y;
			var initX = this.position.x;
			var initY = this.position.y;

			context.translate(initX,initY);
			context.rotate(Math.atan2(mouse_y - initY, mouse_x - initX)-55);
			context.drawImage(g, -32, -37, this.w*scale*scale, this.h*scale);	
			context.setTransform(1,0,0,1,0,0);
			context.beginPath(); 
			context.fill();
			context.restore();

		}	
		context.restore();

		return;
	}
	step(){	
		if(this.pickedup == true){
			this.mouse_x = this.stage.player.mouse.x;
			this.mouse_y = this.stage.player.mouse.y;
			this.position.x = this.stage.player.position.x;
			this.position.y = this.stage.player.position.y;
		}
		else{
			this.position.x=this.position.x;
			this.position.y=this.position.y;

		}	

		
		this.intPosition();
	}
		fire_wapon(){
		if (this.init_ammo <= 0){
			return false;
		}else{
			this.init_ammo -= 1;
			if (this.init_ammo <= 0){
			}
		}
		return true;
	}


}
class arrow extends Actor{

	constructor(player, stage, position, velocity, size, duration, mousex, mousey){
		super(stage,position.x, position.y);
		this.stage = stage;
		this.position.x=position.x;
		this.position.y =position.y;
		this.intPosition();
		this.initX = position.x;
		this.initY = position.y;
		this.duration = duration;
		this.velocity=velocity;
		this.size = size;
		this.player = player
		this.mousex;
		this.mousey;
		//this.name = "Bullet"
		super.setName("arrow");
		this.user = "player";
			}
	

	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}
	setUser(user){
		this.user = user;

	}

	step(){
		
		this.duration=this.duration-1;
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;
		//this.intPosition();
		
		this.intPosition();
		// this.point();
	}
	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}
	point(position){
		this.velocity.normalize();
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
	}
	draw(context){
		if (this.duration > 0){
			var img = document.getElementById("arrow");
			var context = this.stage.canvas.getContext('2d');

			context.save();
			 var scale = 0.01;
			 this.width = img.width*scale;
			 this.height = img.height*scale;

			var mouse_x = this.mousex;
			var mouse_y = this.mousey;

			context.translate(this.position.x,this.position.y);
	
			context.rotate(Math.atan2(mouse_y - this.initY, mouse_x - this.initX)-55);
			context.drawImage(img, -32, -37, this.width, this.height);	
			context.setTransform(1,0,0,1,0,0);

			context.restore();
		}
		else{
			this.stage.removeActor(this);
		}
	}
}

class Water extends Actor{
	constructor(stage, x,y){
		super(stage, x, y);
		super.intPosition();
		this.height = 0;
		this.width = 0;
		super.setName("Water");


	}

	draw(){
		var w = document.getElementById("water");
		this.height = w.height;
		this.width= w.width;
		var context = this.stage.canvas.getContext('2d');
		context.imageSmoothingEnabled = false;
		context.drawImage(w, this.x-this.width/2, this.y-this.height/2, this.width,this.height);


	}


}

class Coins extends Actor{

	constructor(stage, x,y, amount){
		super(stage, x, y);
		super.intPosition();
		this.amount = amount;
		this.actor = null;
		super.setName("Coins");
		this.width = amount *2;
		this.height = amount *2;


	}
	draw(context){
		var context = this.stage.canvas.getContext('2d');
		context.imageSmoothingEnabled = false;
		
		if(this.actor == null){
			var coins = document.getElementById("coins");
			context.drawImage(coins, this.x, this.y);

			}
		else{
			this.stage.removeActor(this);
		}
	}
	step(){
		return;
	}

}

class axe extends Actor{
	constructor(stage,x,y){
		super(stage,x,y);
		this.intPosition();

		this.stage = stage;
		this.pickedup = false;
		super.setName("axe");
		this.width = 0;
		this.height =0;

		this.mouse_x;
		this.mouse_y;

		this.damage = 20;
		this.init_ammo = 0;
		this.totalAmmo = 0;
		this.maxDistance = 1;
		this.shootingSpeed = 0;
		this.inventory = false;


	}

	draw(){
		var g = document.getElementById("axe");

		this.h = g.height;
		this.w= g.width;

		var context = this.stage.canvas.getContext('2d');
		context.save();
		var scale = 0.3;

		this.height = this.h*scale;
		this.width = this.w*scale;

		context.imageSmoothingEnabled = false;
		if (this.pickedup == false){

			context.drawImage(g, this.position.x - this.width/2 , this.position.y - this.height/2, this.w*scale, this.h*scale);	
		} else if (this.inventory){

		}
		else{
			var mouse_x = this.mouse_x;
			var mouse_y = this.mouse_y;

			var initX = this.position.x;
			var initY = this.position.y;

			context.translate(initX,initY);
			context.rotate(Math.atan2(mouse_y - initY, mouse_x - initX)-55);
			context.drawImage(g, -29 - this.width/2, -37-this.height/2, this.w*scale, this.h*scale);	
			context.setTransform(1,0,0,1,0,0);
			context.beginPath(); 
			context.fill();
			context.restore();

		}	
		context.restore();

		return;
	}
	step(){	
		if(this.pickedup == true){
			this.mouse_x = this.stage.player.mouse.x;
			this.mouse_y = this.stage.player.mouse.y;
			this.position.x = this.stage.player.position.x;
			this.position.y = this.stage.player.position.y;
		}
		else{
			this.position.x=this.position.x;
			this.position.y=this.position.y;

		}	

		this.intPosition();
	}
	
	fire_wapon(){
		if (this.init_ammo <= 0){
			return false;
		}else{
			this.init_ammo -= 1;
			if (this.init_ammo <= 0){
			}
		}
		return true;
	}


}








