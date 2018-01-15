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

let classIter = 0;
let lvlIter = 0;
let mark = 0;

//let gold = 0;

// const heroStats = {
// 	hp: 3,
// 	atc: 1,
// 	upHp(){
// 		this.hp += 10;
// 	},
// 	upAtc(){
// 		this.atc += 10;
// 	}
// };
// const enemyStats = {};


//event 'click'
canvas.onclick = function(e) {
	if (inBlock === 'menu') {
	const mousePos = getMousePos(e);

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
};

//event 'keydown'
body.onkeydown = function(e) {
	if (e.keyCode === 27 ) {
		inBlock = 'menu';
		drawMenu();

		//for game
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
		if (localStorage['classIter'] && localStorage['classIter'] < data.length) { //continue
			classIter = JSON.parse(localStorage['classIter']);
			lvlIter = JSON.parse(localStorage['lvlIter']);
			mark = JSON.parse(localStorage['mark']);
		} else {
			classIter = 0;
			lvlIter = 0;
			mark = 0;
		}
	} else { //new game
		classIter = 0;
		lvlIter = 0;
		mark = 0;
	}

	drawGame();
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
	3 - atack
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
	drawImage(hero, PosHeroX, PosHeroY, 2, 'hero');
}

function heroAttack() {
	drawImage(hero, PosHeroX, PosHeroY, 3, 'hero');
}

function heroBack() {
	drawImage(hero, PosHeroX, PosHeroY, 4, 'hero');
}

function heroStop() {
	drawImage(hero, PosHeroX, PosHeroY, 1, 'hero');
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
		}
	} else if (!goAttack) {
		if (PosHeroX >= 200) {
			heroBack();
			PosHeroX -= 10;
			
			if (PosHeroX === 200) {
				goAttack = null;
				trueAnswer = null;
				mark += 1;
				moveAction = false;
				nextQuestion();
			}
		}
	}
}

function enemyMove() {
	drawImage(enemy, PosEnemyX, PosEnemyY, 2, 'enemy');
}

function enemyAttack() {
	drawImage(enemy, PosEnemyX, PosEnemyY, 3, 'enemy');
}

function enemyBack() {
	drawImage(enemy, PosEnemyX, PosEnemyY, 4, 'enemy');
}

function enemyStop() {
	drawImage(enemy, PosEnemyX, PosEnemyY, 1, 'enemy');
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
		}
	} else if (!goAttack) {
		if (PosEnemyX <= 600) {
			enemyBack();
			PosEnemyX += 10;
			if (PosEnemyX === 600) {
				goAttack = null;
				trueAnswer = null;
				moveAction = false;
				nextQuestion();
			}
		}
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

function save() {
	localStorage['classIter'] = classIter;
	localStorage['lvlIter'] = lvlIter;
	localStorage['mark'] = mark;

	//добавити зберігання галдов
}

//creating a hero and an enemy
const hero = loadImage('./img/heroes/1.png', 74, 96, 10);
const enemy = loadImage('./img/enemies/1.png', 95, 64, 4);

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
// music.play();

music.dom.addEventListener('ended', function() {
	this.currentTime = 0;
	this.play();
}, false);

//Вызов функций (финальный этап)
// drawMenu();
startGame(0);