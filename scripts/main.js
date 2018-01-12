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
let PosHeroX = 300;
let PosEnemyX = 500;
let trueAnswer = null;
let dataIter = 0;
let goAttack = null;
let mark = 0;
let moveAction = false; 

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
	img.src='./img/clouds.png';

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
		context.fillText(`on ${mark} examples of ${data.length}`, 200, 297);

		context.font = "30px Arial";
		context.fillText('Press ESC to enter the menu', 200, 597);
  }
}

//getting coordinates mouse in canvas
function getMousePos(e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

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

//adding answer in answer string
function addNumberToAns(num) {
	if (answer.length > 9) {return;}
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
		if (localStorage['i'] && localStorage['i'] < data.length) { //continue
			dataIter = localStorage['i'];
			mark = parseInt(localStorage['mark']);
		} else {
			dataIter = 0;
			mark = 0;
		}
	} else { //new game
		dataIter = 0;
		mark = 0;
	}

	drawGame();
}

//function of drawing of game objects
function drawGame() {
	if (dataIter === data.length) { //if questions ended
		drawAnswerTrue();
		return;
	}

	question = data[dataIter];

	let bgi = new Image();
	bgi.onload = function(){ run(); };
	bgi.src='./img/BG1.png';

	function run(){
		context.drawImage(bgi, 0, 0);

		//question
		drawBlockQuestion();
    writeTextInBlock();

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
	context.strokeStyle = 'rgba(42, 252, 255, 0.78)';
	context.fillStyle = 'rgba(255, 255, 255, .58)';

  context.fillRect(220, 50, 400, 70);
  context.strokeRect(220, 50, 400, 70);
}

//the function of drawing a text which will be displayed and which will be entered
function writeTextInBlock() {
	context.font = "24px Arial";
	context.fillStyle = '#3FBDBD';

	context.fillText(`${question} = ${answer}` , 250, 95);
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

	if (person === 'hero') {
		checkHeroType();
	} 

	if (person === 'enemy') {
		checkEnemyType();
	}

	function checkHeroType() {
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

	function checkEnemyType() {
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

	context.drawImage(img.dom, img.width*(img.num-1), 0, img.width, img.height, x, y, 30, 40);
}

function heroMove() {
	drawImage(hero, PosHeroX, 502, 2, 'hero');
}

function heroAttack() {
	drawImage(hero, PosHeroX, 502, 3, 'hero');
}

function heroBack() {
	drawImage(hero, PosHeroX, 502, 4, 'hero');
}

function heroStop() {
	drawImage(hero, PosHeroX, 502, 1, 'hero');
}

function heroGoAttack() {
	if (goAttack) {
		moveAction = true;
		if (PosHeroX <= 468) {
			PosHeroX +=7;
			heroMove();
			enemyStop();
		} else if (PosHeroX === 475) {
			heroAttack();
			enemyStop();
			goAttack = 0;
		}
	} else if (!goAttack) {
		if (PosHeroX >= 300) {
			heroBack();
			PosHeroX -= 7;
			
			if (PosHeroX === 300) {
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
	drawImage(enemy, PosEnemyX, 520, 2, 'enemy');
}

function enemyAttack() {
	drawImage(enemy, PosEnemyX, 520, 3, 'enemy');
}

function enemyBack() {
	drawImage(enemy, PosEnemyX, 520, 4, 'enemy');
}

function enemyStop() {
	drawImage(enemy, PosEnemyX, 520, 1, 'enemy');
}

function enemyGoAttack() {
	if (goAttack) {
		moveAction = true;
		if (PosEnemyX >= 332) {
			PosEnemyX -=7;
			enemyMove();
			heroStop();
		} else if (PosEnemyX === 325) {
			enemyAttack();
			heroStop();
			goAttack = 0;
		}
	} else if (!goAttack) {
		if (PosEnemyX <= 500) {
			enemyBack();
			PosEnemyX += 7;
			if (PosEnemyX === 500) {
				goAttack = null;
				trueAnswer = null;
				moveAction = false;
				nextQuestion();
			}
		}
	}
}

function nextQuestion() {
	dataIter++;
	answer = '';
}

function save() {
	localStorage['i'] = dataIter;
	localStorage['mark'] = mark;
}

//creating a hero and an enemy
const hero = loadImage('./img/heroes/1.png', 37, 48, 10);
const enemy = loadImage('./img/enemies/1.png', 48, 60, 4);

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
drawMenu();