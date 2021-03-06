const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const body = document.querySelector('body');

const width = 800,
			height = 600;

canvas.width = width;
canvas.height = height;

let inBlock = 'menu';
let question = '';
let answer = '';
let setIntervalForGame = null;
let PosHeroX = 200;
const PosHeroY = 389;
let PosEnemyX = 600;
const PosEnemyY = 419;
let trueAnswer = null;
let goAttack = null;
let moveAction = false; 
let dieBool = false;

let classIter = localStorage['classIter'] && localStorage['classIter'] <= data.length ? JSON.parse(localStorage['classIter']) : 0;
let lvlIter = 0;
let mark = 0;
let gold = localStorage['gold'] ? JSON.parse(localStorage['gold']) : 0;

function Persons (img, x, y, c, hp, atk) {
	this.hp = hp;
	this.fullHP = this.hp;
	this.atk = atk;
	this.img = loadImage(img, x, y, c);
}

Persons.prototype.setHP = function(num) {
	this.hp = num;
	this.fullHP  = num;
};

Persons.prototype.setAtk = function(num) {
	this.atk = num;
};

//creating a hero and an enemy
const hero = creatHero();
const enemy = new Persons('./img/enemies/1.png', 95, 64, 4, data[classIter].enemyHp, data[classIter].enemyAtc);
enemy.gold = data[classIter].gold;
enemy.imgCount = 1;

function creatHero() {
	let hp = localStorage['heroFullHP'] ? JSON.parse(localStorage['heroFullHP']): 3;
	let atk = localStorage['heroAtk'] ? JSON.parse(localStorage['heroAtk']): 1;

	return new Persons('./img/heroes/1.png', 74, 96, 10, hp, atk);
}

//event 'click'
canvas.onclick = function(e) {
	const mousePos = getMousePos(e);

	if (inBlock === 'menu') {
		if(mousePos.x > 250 && mousePos.x < 550){
			
			if (mousePos.y > 150 && mousePos.y < 220) { //new game
				inBlock = 'game';
				startGame(0);
			}
	
			if (mousePos.y > 275 && mousePos.y < 345) { //continue
				inBlock = 'game';
				startGame(1);
			}
	
			if (mousePos.y > 400 && mousePos.y < 470) { //shop
				inBlock = 'shop';
				shop();
			}
		}

		if (mousePos.x > 0 && mousePos.x < 68 && mousePos.y > 486 && mousePos.y < 557) { //music
				if (music.state === 'stop') {
					music.play();
				} else {
					music.stop();
				}
		}
	}

	if (inBlock === 'shop') {
		if (mousePos.y > 374 && mousePos.y < 405) {
			if (mousePos.x > 140 && mousePos.x < 271) {
				upHphero();
			}
			if (mousePos.x > 520 && mousePos.x < 650) {
				upAtkhero();
			}
		}
	}
};

//event 'keydown'
body.onkeydown = function(e) {
	if (e.keyCode === 27 ) { //Esc
		inBlock = 'menu';
		drawMenu();
		clearTimeout(setIntervalForGame); 
		save();
	}

	if (inBlock === 'game' && !moveAction) {
		switch (e.keyCode) { 
			case 13: { //enter
				if (answer !== '') { checkAnswer(); }
			}; break;
			case 8: { //backspace
				answer = answer.substring(0, answer.length-1);
			}; break;
			case 48: { //0
				addNumberToAns(0);
			}; break;
			case 97: //1
			case 49: { 
				addNumberToAns(1);
			}; break;
			case 98: //2
			case 50: {
				addNumberToAns(2);
			}; break;
			case 99: //3
			case 51: { 
				addNumberToAns(3);
			}; break;
			case 100: //4
			case 52: {
				addNumberToAns(4);
			}; break;
			case 101: //5
			case 53: {
				addNumberToAns(5);
			}; break;
			case 102: //6
			case 54: {
				addNumberToAns(6);
			}; break;
			case 103: //7
			case 55: {
				addNumberToAns(7);
			}; break;
			case 104: //8
			case 56: {
				addNumberToAns(8);
			}; break;
			case 105: //9
			case 57: {
				addNumberToAns(9);
			}; break;
			case 108: //point
			case 188: 
			case 190: 
			case 191: {
				addNumberToAns('.');
			}; break;
		}
	}
};

//getting coordinates mouse in canvas
function getMousePos(e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

//drawing rect
function fillRect(x, y, w, h) {
	context.fillRect(x, y, w, h);
}

//drawing empty rect
function strokeRect(x, y, w, h) {
	context.strokeRect(x, y, w, h);
}

//drawing main menu
function drawMenu() {
	inBlock = 'menu';

	let img = new Image();
	img.onload = function(){ run(); };
	img.src='./img/clouds1.png';

	function run(){
		context.drawImage(img ,0, 0);

		//draw rect
		context.strokeStyle = '#00007F';
		context.fillStyle = '#4C8BFF';

		//New game
    context.fillRect(250, 150, 300, 70);
    context.strokeRect(250, 150, 300, 70);
    
    //Continue
    context.fillRect(250, 275, 300, 70);
    context.strokeRect(250, 275, 300, 70);

    //shop
    context.fillRect(250, 400, 300, 70);
    context.strokeRect(250, 400, 300, 70);

    //draw text
    context.font = "50px Arial";
		context.fillStyle = 'white';

		context.fillText('New game', 280, 200);
		context.fillText('Continue', 300, 327);
		context.fillText('Shop', 345, 453);			
  }
}

// output of the number of correct answers 
function drawAnswerTrue() {
	clearTimeout(setIntervalForGame);

	let img = new Image();
	img.onload = function(){ run(); };
	img.src='./img/sky.png';

	function run(){
		context.drawImage(img ,0, 0);

   		context.font = "50px Arial";
		context.fillStyle = 'white';

		context.fillText('You answered correctly', 160, 227);
		context.fillText(`on ${mark} examples of ${data.reduce((sum, item) => sum + item.task.length, 0)}`, 200, 297);

		context.font = "30px Arial";
		context.fillText('Press ESC to enter the menu', 200, 597);
  }
}

//function of drawing of game objects
function drawGame() {
	if (classIter === data.length) { //if questions ended
		drawAnswerTrue();
		return;
	}

	question = data[classIter].task[lvlIter];

	let bgi = new Image();
	bgi.onload = function(){ run(); };
	bgi.src='./img/BG3.png';

	function run(){
		context.drawImage(bgi, 0, 0);

		//stuts
		showStuts();

		//lvl
		writeLvlInfo();

		//question
		drawBlockQuestion();
   		writeTextInBlock();

    	//massage
    	drawMessageBlock()

		if (trueAnswer === true) { //attack hero
			heroGoAttack();
		} else if (trueAnswer === false) {
			enemyGoAttack();
		} else {
			heroStop();	
			enemyStop();
		}
  }
}

//the function of drawing a block where will be the question and answer
function drawBlockQuestion() {
	let border = 'rgba(42, 252, 255, 0.78)';

	if (trueAnswer) { 
		border = 'green';
	} else if (trueAnswer === false) {
		border = 'red';
	}

	context.strokeStyle = border;
	context.fillStyle = 'rgba(255, 255, 255, .58)';

  context.fillRect(220, 90, 400, 70);
  context.strokeRect(220, 90, 400, 70);
}

//the function of drawing a text which will be displayed and which will be entered
function writeTextInBlock() {
	context.font = "24px Arial";
	context.fillStyle = '#3FBDBD';

	context.fillText(`${question} = ${answer}` , 250, 135);
}

function drawMessageBlock() {
	context.strokeStyle = 'rgba(99, 57, 27, 1.0)';
	context.fillStyle = 'rgba(175, 100, 46, .7)';

  context.fillRect(220, 500, 400, 70);
  context.strokeRect(220, 500, 400, 70);

  enterTextFromMessage();
}

function enterTextFromMessage() {
	let text = '';
	let x = 240;

	if (trueAnswer === null) {
		text = 'Heroes are waiting for an answer';
	} else if (trueAnswer) {
		text = 'Your answer is correct';
		x = 300;
	} else {
		text = 'Your answer is incorrect';
		x = 300;
	}

	 drawMessageText(text, x);
}

function drawMessageText(text, x) {
	context.font = "24px Arial";
	context.fillStyle = '#EC9';

	context.fillText(text , x, 545);
}

function writeLvlInfo() {
	context.font = "15px Arial";
	context.fillStyle = '#66BCB2';

	context.fillText(`lvl ${classIter+1}.${lvlIter+1}` , 380, 20);
}

function showStuts() {
	//hero
	context.font = "16px Arial";
	context.fillStyle = '#00BC06';

	context.fillText(`HP ${hero.hp}` , 10, 20);
	context.fillText(`ATK ${hero.atk}` , 10, 40);
	context.fillText(`Gold ${gold}` , 10, 60);

	//enemy
	context.font = "16px Arial";
	context.fillStyle = '#BC1F1F';
	
	let str = '';
	str = `${enemy.hp < 0 ? 0 : enemy.hp} HP`;
	context.fillText(str, 800 - (str.length*10), 20);
	str = `${enemy.atk} ATK`;
	context.fillText(str, 800 - (str.length*10), 40);
}

//adding answer in answer string
function addNumberToAns(num) {
	if (answer.length > 9) { return; }
	answer += num;
}

//check if the answer is true
function checkAnswer() {
	trueAnswer = eval(question) === eval(answer);
	goAttack = 1;
}

//initializations function
function startGame(bool) { // 1 - continue, 0 - new game
	inBlock = 'game';
	answer = '';	

	setIntervalForGame = setInterval(function() {	drawGame(); }, 90);
	
	if (bool) {
		if (classIter < data.length && localStorage['heroHp'] && localStorage['heroHp'] > 0) { //continue
			lvlIter = JSON.parse(localStorage['lvlIter']);
			mark = JSON.parse(localStorage['mark']);
			hero.hp = JSON.parse(localStorage['heroHp']);

			if (localStorage['enemyHp'] > 0) {
				enemy.hp = JSON.parse(localStorage['enemyHp']);
			} else {
				enemy.hp = enemy.fullHP;
			}

			enemy.atk = JSON.parse(localStorage['enemyATK']);
			enemy.imgCount = JSON.parse(localStorage['enemySkin']);
			enemy.img = loadImage(`./img/enemies/${enemy.imgCount}.png`, 95, 64, 4);
		} else {
			newGame();
		}
	} else { //new game
		newGame();
	}

	drawGame();
}

function newGame() {
	classIter = 0;
	lvlIter = 0;
	mark = 0;
	hero.hp = hero.fullHP;

	enemy.setHP(data[classIter].enemyHp);
	enemy.setAtk(data[classIter].enemyAtc);
	enemy.gold = data[classIter].gold;
	enemy.img = loadImage('./img/enemies/1.png', 95, 64, 4);
	enemy.imgCount = 1;
}

//a function for downloading images that will be displayed as a hero and an enemy
function loadImage(path, width, height, count) {
	const img = document.createElement('img');
	const result = {
		dom: img,
		width: width,
		height: height,
		count: count,
		loaded: false,
		num: 0
	};

	img.onload = function() {
		result.loaded = true;	
	};

	img.src = path;
	return result;
}

//the function of drawing the hero and the enemy
/*
	type
	1 - stop
	2 - move
	3 - attack
	4 - back
*/

function drawImage(img, x, y, type, person) {
	if (!img.loaded) { return; }

	let mx = 45,
			my = 0;

	if (person === 'hero') {
		checkHeroType(img, type);
		my = 60;
	} 

	if (person === 'enemy') {
		checkEnemyType(img, type);
		my = 30;
	}

	context.drawImage(img.dom, img.width*(img.num-1), 0, img.width, img.height, x, y, mx, my);	
}

function checkHeroType(img, type) {
	if (type === 1) { img.num = 6; }
	if (type === 2) {
		if (img.num >= img.count - 1) {
			img.num = 6;
		} else {
			img.num +=1;
		}
	}
	if (type === 3) { img.num = 10; }
	if (type === 4) {
		if (img.num >= img.count - 6) {
			img.num = 1;
		} else {
			img.num +=1;
		}
	}
}

function checkEnemyType(img, type) {
	if (type === 1) { img.num = 3; }
	if (type === 2) {
		if (img.num >= img.count - 1) {
			img.num = 2;
		} else {
			img.num +=1;
		}
	}
	if (type === 3) { img.num = 1; }
	if (type === 4) {
		if (img.num >= img.count + 1) {
			img.num = 4;
		} else {
			img.num +=1;
		}
	}
}

function heroMove() {
	drawImage(hero.img, PosHeroX, PosHeroY, 2, 'hero');
}

function heroAttack() {
	drawImage(hero.img, PosHeroX, PosHeroY, 3, 'hero');
}

function heroBack() {
	drawImage(hero.img, PosHeroX, PosHeroY, 4, 'hero');
}

function heroStop() {
	drawImage(hero.img, PosHeroX, PosHeroY, 1, 'hero');
}

function heroGoAttack() {
	if (goAttack) {
		moveAction = true;
		if (PosHeroX <= PosEnemyX - 50) {
			PosHeroX +=10;
			heroMove();
			enemyStop();
		} else if (PosHeroX === PosEnemyX - 40) {
			heroAttack();
			enemyStop();
			goAttack = 0;
			dieBool = true;
		}
	} else if (!goAttack) {
		if (PosHeroX >= 200) {
			heroBack();
			PosHeroX -= 10;

			if (dieBool) {
				enemy.hp -= hero.atk;
				dieBool = false;
			} else if (enemy.hp > 0) {
				enemyStop();
			}

			if (PosHeroX === 200) {
				goAttack = null;
				trueAnswer = null;
				mark += 1;
				moveAction = false;
				enemyDied();
				nextQuestion();
			}
		}
	}
}

function enemyDied() {
	if (enemy.hp > 0) { return; }
	addGold();

	let hp = data[classIter].enemyHp;
	let atk = data[classIter].enemyAtc;
	let gold = data[classIter].gold;

	let sendHp = Math.floor(Math.random() * (hp - (hp / 3))) + (hp / 3);
	let sendAtk = !classIter ? Math.floor(Math.random() * atk) + (atk/2) : Math.floor(Math.random() * (atk - (atk/2))) + (atk/2);

	changeEnemySkin();
	enemy.setHP(sendHp);
	enemy.setAtk(sendAtk);
	enemy.gold = Math.floor(Math.random() * ((gold + 5) - (gold - 5))) + (gold - 5);
}

function enemyMove() {
	drawImage(enemy.img, PosEnemyX, PosEnemyY, 2, 'enemy');
}

function enemyAttack() {
	drawImage(enemy.img, PosEnemyX, PosEnemyY, 3, 'enemy');
}

function enemyBack() {
	drawImage(enemy.img, PosEnemyX, PosEnemyY, 4, 'enemy');
}

function enemyStop() {
	drawImage(enemy.img, PosEnemyX, PosEnemyY, 1, 'enemy');
}

function enemyGoAttack() {
	if (goAttack) {
		moveAction = true;
		if (PosEnemyX >= PosHeroX + 50) {
			PosEnemyX -= 10;
			enemyMove();
			heroStop();
		} else if (PosEnemyX === PosHeroX + 40) {
			enemyAttack();
			heroStop();
			goAttack = 0;
			dieBool = true;
		}
	} else if (!goAttack) {
		if (PosEnemyX <= 600) {
			enemyBack();
			PosEnemyX += 10;

			if (dieBool) {
				hero.hp -= enemy.atk;
				dieBool = false;
			} else if (hero.hp > 0) {
				heroStop();
			}

			if (PosEnemyX === 600) {
				goAttack = null;
				trueAnswer = null;
				moveAction = false;
				attackOnHero();
				nextQuestion();
			}
		}
	}
}

function attackOnHero() {
	if (hero.hp <= 0) {
		heroDied();
	}
}

function nextQuestion() {
	if (lvlIter === data[classIter].task.length-1) {
		classIter++;
		lvlIter = 0;
	} else {
		lvlIter++;
	}
	answer = '';
}

function changeEnemySkin(){
	enemy.imgCount = Math.floor(Math.random() * (5 - 1)) + 1;
	enemy.img = loadImage(`./img/enemies/${enemy.imgCount}.png`, 95, 64, 4);
}

function heroDied() {
	clearTimeout(setIntervalForGame);

	let img = new Image();
	img.onload = function(){ run(); };
	img.src='./img/sky.png';

	function run(){
		context.drawImage(img ,0, 0);

    context.font = "50px Arial";
		context.fillStyle = 'white';

		context.fillText('Game over', 280, 305);

		context.font = "30px Arial";
		context.fillText('Press ESC to enter the menu', 200, 597);
  }
}

function addGold() {
	gold += enemy.gold;
}

function save() {
	localStorage['classIter'] = classIter;
	localStorage['lvlIter'] = lvlIter;
	localStorage['mark'] = mark;
	localStorage['gold'] = gold;
	localStorage['heroHp'] = hero.hp;
	localStorage['enemyHp'] = enemy.hp;
	localStorage['enemyATK'] = enemy.atk;
	localStorage['enemySkin'] = enemy.imgCount;
}

//shop
function shop() {
	setIntervalForGame = setInterval(function() {	drawShop(); }, 90);
}

function drawShop() {
	let img = new Image();
	img.onload = function(){ run(); };
	img.src='./img/shop.png';

	function run(){
		context.drawImage(img ,0, 0);

    context.font = "24px Arial";
		context.fillStyle = 'white';

		context.fillText(`Gold - ${gold}`, 340, 110);

		context.font = "30px Arial";
		context.fillText('HP', 190, 204);
		context.fillText('ATK', 560, 204);

		context.font = "18px Arial";

		context.fillText(`Current HP - ${hero.fullHP}`, 100, 231);
		context.fillText(`HP after upgrade - ${hero.fullHP + 1}`, 100, 261);
		context.fillText(`Cost - ${costHpHpHero()} gold`, 100, 288);
		context.fillText(`upgrade`, 174, 393);

		context.fillText(`Current ATK - ${hero.atk}`, 480, 231);
		context.fillText(`ATK after upgrade - ${hero.atk + 1}`, 480, 261);
		context.fillText(`Cost - ${costAtkHpHero()} gold`, 480, 288);
		context.fillText(`upgrade`, 554, 393);

		context.font = "30px Arial";
		context.fillText('Press ESC to enter the menu', 200, 597);
  }
}

function costHpHpHero() {
	if (hero.fullHP + 1 < 11) {
		return hero.fullHP * 2;
	} else {
		return hero.fullHP * 3;
	}
}

function costAtkHpHero() {
	if (hero.atk + 1 < 6) {
		return hero.atk * 2;
	} else if (hero.atk + 1 < 12) {
		return hero.atk * 3;
	} else {
		return hero.atk * 5;
	}
}

function upHphero() {
	if (gold >= costHpHpHero()) {
		gold -= costHpHpHero();
		hero.fullHP += 1;
		localStorage['heroFullHP'] = hero.fullHP;
	}
}

function upAtkhero() {
	if (gold >= costAtkHpHero()) {
		gold -= costAtkHpHero();
		hero.atk += 1;
		localStorage['heroAtk'] = hero.atk;
	}
}

//adding music
function loadAudio(arr, vol) {
	const audio = document.createElement('audio');

	for (var i = 0; i < arr.length; i++) {
		var source = document.createElement('source');
		source.src = arr[i];
		audio.appendChild(source);
	}

	audio.volume = vol || 1; //set volume

	var obj = {
		dom: null,
		state: 'stop',
		play: function() {
			this.dom.play();
			this.state = 'play';
		},
		stop: function() {
			this.dom.pause();
			this.dom.currentTime = 0;
			this.state = 'stop';
		}
	};

	obj.dom = audio;
	return obj;
}

const music = loadAudio(['./music/bit.mp3'], 0.3);
music.play();

music.dom.addEventListener('ended', function() {
	this.currentTime = 0;
	this.play();
}, false);

//Calling functions (final stage)
drawMenu();