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

//рисования прямугольника
const fillRect = function(x, y, w, h) {
	context.fillRect(x, y, w, h);
};

//рисования незакрашеного прямоугольника
const strokeRect = function(x, y, w, h) {
			context.strokeRect(x, y, w, h);
		};


//рисования главного меню игры
function drawMenu() {
	inBlock = 'menu';

	let img = new Image();
	img.onload = function(){run()};

	img.src='./img/clouds.png';

	function run(){
		context.drawImage(img ,0, 0);

		context.strokeStyle = '#00007F';
		context.fillStyle = '#4C8BFF';

    context.fillRect(250, 150, 300, 70);
    context.strokeRect(250, 150, 300, 70);
    
    context.fillRect(250, 275, 300, 70);
    context.strokeRect(250, 275, 300, 70);

    // context.fillRect(250, 400, 300, 70);
    // context.strokeRect(250, 400, 300, 70);

    context.font = "50px Arial";
		context.fillStyle = 'white';

		context.fillText('New game', 280, 200);
		context.fillText('Continue', 300, 327);
		// context.fillText('Shop', 345, 453);	
  }
}

//получения координат позикии курсора в канве
function getMousePos(e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

//события клика мышки
canvas.onclick = function(e) {

	if (inBlock === 'menu') {
	const mousePos = getMousePos(e);

		if(mousePos.x > 250 && mousePos.x < 550){
			
			if (mousePos.y > 150 && mousePos.y < 220) { //new game
				inBlock = 'game';
				startGame(0);
				console.log('New game');
			}
	
			if (mousePos.y > 275 && mousePos.y < 345) { //continue
				inBlock = 'game';
				startGame(1);
				console.log('Continue');
			}
	
			if (mousePos.y > 400 && mousePos.y < 470) { //shop
				inBlock = 'shop';
				console.log('Shop');
			}
		}
	}

};

//события нажатия клавиш
body.onkeydown = function(e) {

	if (e.keyCode === 27 && inBlock !== 'game') {
			inBlock = 'menu';
			drawMenu();
	}

	if (inBlock === 'game' && !moveAction) {
		switch (e.keyCode) { 
			case 27: { //Esc
					inBlock = 'menu';
					clearTimeout(setIntervalForGame);
					drawMenu();
					save();
			}; break;
			case 13: { //enter
				if (answer !== '') { checkAnswer(); }
			}; break;
			case 8: { //backspace
				answer = answer.substring(0, answer.length-1);
			}; break;
			case 48: { //0
				addNumberToAns(0);
			}; break;
			case 49: { //1
				addNumberToAns(1);
			}; break;
			case 50: { //2
				addNumberToAns(2);
			}; break;
			case 51: { //3
				addNumberToAns(3);
			}; break;
			case 52: { //4
				addNumberToAns(4);
			}; break;
			case 53: { //5
				addNumberToAns(5);
			}; break;
			case 54: { //6
				addNumberToAns(6);
			}; break;
			case 55: { //7
				addNumberToAns(7);
			}; break;
			case 56: { //8
				addNumberToAns(8);
			}; break;
			case 57: { //9
				addNumberToAns(9);
			}; break;
		}
	}
}

//добавления числа в строку ответа
function addNumberToAns(num) {
	if (answer.length > 5) {return;}
	answer += num;
}

//проверка правильности ответа
function checkAnswer() {
	trueAnswer = eval(question) === eval(answer);
	goAttack = 1;
}

//функция инициализации старта игры
function startGame(bool) { // 1 - continue, 0 - new game
	inBlock = 'game';
	answer = '';	

	setIntervalForGame = setInterval(function() {	drawGame(); }, 90);
	
	if (bool) { //continue
		if (localStorage['i'] && localStorage['i'] < data.length) {
			dataIter = localStorage['i'];
		} else {
			dataIter = 0;
		}
	} else {
		dataIter = 0;
	}

	drawGame();
}

//функция прорисовки игровых обектов
function drawGame() {
	if (dataIter === data.length) {
		drawAnswerTrue();
		return;
	}


	question = data[dataIter];
	let bgi = new Image();
	bgi.onload = function(){run()};
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

//функция прорисовки блока где будет вопрос и ответ
function drawBlockQuestion() {
	context.strokeStyle = 'rgba(42, 252, 255, 0.78)';
	context.fillStyle = 'rgba(255, 255, 255, .58)';

  context.fillRect(220, 50, 400, 70);
  context.strokeRect(220, 50, 400, 70);
}

//функция прорисовка текста какой будет выводится и какой будут вводить
function writeTextInBlock() {
	context.font = "24px Arial";
	context.fillStyle = '#3FBDBD';

	context.fillText(`${question} = ${answer}` , 250, 95);
}

//функция для загрузки картинок какие будут отображатся как герой и враг
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

//функция рисования героя и врага
/*
	type
	1 - stop
	2 - move
	3 - atack
	4 - back
*/
function drawImage(img, x, y, type, person) {
	if (!img.loaded) {return;}

	if (person === 'hero') {
		checkHeroType();
	} 

	if (person === 'enemy') {
		checkEnemyType();
	}

	function checkHeroType() {
		if (type === 1) {img.num = 6;}
		if (type === 2) {
			if (img.num >= img.count - 1) {
				img.num = 6;
			} else {
				img.num +=1;
			}
		}
		if (type === 3) {img.num = 10; }
		if (type === 4) {
			if (img.num >= img.count - 6) {
				img.num = 1;
			} else {
				img.num +=1;
			}
		}
	}

	function checkEnemyType() {
		if (type === 1) {img.num = 3;}
		if (type === 2) {
			if (img.num >= img.count - 1) {
				img.num = 2;
			} else {
				img.num +=1;
			}
		}
		if (type === 3) {img.num = 1;}
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


//создания героя и врага
const hero = loadImage('./img/heroes/1.png', 37, 48, 10);
const enemy = loadImage('./img/enemies/1.png', 48, 60, 4);

function save() {
	localStorage['i'] = dataIter;
}

//добавления музыки
function loadAudio(arr, vol) {
	//create new element audio
	var audio = document.createElement('audio');
	for (var i = 0; i < arr.length; i++) {
		var source = document.createElement('source');
		source.src = arr[i];
		audio.appendChild(source);
	}

	audio.volume = vol || 1; //set volume

	var obj = {
		dom: false,
		state: 'stop',
		play: function() {
			this.dom.play();
			this.state = 'play';
		},
		replay: function() {
			this.dom.currentTime = 0;
			this.dom.play();
			this.state = 'replay';
		},
		pause: function() {
			this.dom.pause();
			this.state = 'pause';
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


function drawAnswerTrue() {
	clearTimeout(setIntervalForGame);

	let img = new Image();
	img.onload = function(){run()};

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

//Вызов функций (финальный этап)
drawMenu();

/*
//fullscreen



	function fullScreen(element) {
			if (element.requestFullScreen) {
				element.requestFullScreen();
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			} else if (element.webkitRequestFullScreen) {
				element.webkitRequestFullScreen();
			}
		}

		function cancelFullScreen() {
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		}


		var onfullscreencange = function() {
			var fullscreenElement = document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement;

			var fullscreenEnabled = document.fullscreenEnabled || document.mozFullscreenEnebled || document.webkitFullscreenEnabled;

			console.log('fullscreenEnabled = ', fullscreenEnabled, 'fullscreenElement = ', fullscreenElement);
		};






		document.querySelector('canvas').onclick = function() {
			fullScreen(document.querySelector('canvas'))
			onfullscreencange();			
		};
*/