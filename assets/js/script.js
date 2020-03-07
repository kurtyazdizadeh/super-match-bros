var firstCardClicked = null,
    firstCardClasses = null,
    firstCardContainer = null,
    secondCardClicked = null,
    secondCardClasses = null,
    secondCardContainer = null,
    maxMatches = 9,
    matches = 0,
    attempts = 0,
    gamesPlayed = 0,
    seconds = 60,
    time = null,
    timerDisplay = document.getElementById('timer'),
    gameCards = document.getElementById('gameCards'),
    stats = document.getElementById('stats'),
    modal = document.querySelector('.modal'),
    modalText = document.querySelector('.modal-text'),
    pose = document.querySelector('.pose'),
    resetButton = document.getElementById('reset'),
    gameSettings = document.querySelector('.game-settings'),
    musicOff = document.getElementById('musicOff'),
    musicOn = document.getElementById('musicOn'),
    sfxOff = document.getElementById('sfxOff'),
    sfxOn = document.getElementById('sfxOn'),
    startGameButton = document.getElementById('startGame');


var cardFrontImages = [
  'captfalcon',
  'dk',
  'fox',
  'kirby',
  'link',
  'luigi',
  'mario',
  'pikachu',
  'samus',
  'captfalcon',
  'dk',
  'fox',
  'kirby',
  'link',
  'luigi',
  'mario',
  'pikachu',
  'samus',
]

function shuffleCards() {
  for(var i = cardFrontImages.length-1; i > 0; i--){
    var randomNum = Math.floor(Math.random() * i);
    var placeholder = cardFrontImages[i];
    cardFrontImages[i] = cardFrontImages[randomNum];
    cardFrontImages[randomNum] = placeholder;
  }
  renderCards();
}
function renderCards() {
  for(var j = 0; j < cardFrontImages.length; j++){
    var cardContainer = document.createElement('div');
    var cardFlip = document.createElement('div');
    var cardBack = document.createElement('div');
    var cardFront = document.createElement('div');

    cardContainer.classList.add('card', 'col-2');
    cardFlip.classList.add('card-flip');
    cardBack.classList.add('card-back');
    cardFront.classList.add('card-front', cardFrontImages[j]);

    cardContainer.appendChild(cardFlip);
    cardFlip.append(cardFront, cardBack);
    gameCards.appendChild(cardContainer);
  }
}



function deleteCards() {
  while (gameCards.firstElementChild){
    gameCards.removeChild(gameCards.lastElementChild)
  }
}

function handleClick(event) {
  if (event.target.className.indexOf('card-back') === -1){
    return;
  }

  event.target.parentElement.classList.add('card-revealed');

  if (!firstCardClicked) {
    firstCardClicked = event.target;
    firstCardClasses = firstCardClicked.previousElementSibling.className;
    firstCardContainer = event.target.parentElement;
  } else if (firstCardClicked) {
    secondCardClicked = event.target;
    secondCardClasses = secondCardClicked.previousElementSibling.className;
    secondCardContainer = event.target.parentElement;

    gameCards.removeEventListener('click', handleClick);

    if (firstCardClasses === secondCardClasses) {
      matches++;
      attempts++;
      displayStats();
      var character = firstCardClasses.slice(11);
      playCharacterCall(character);

      if (matches === maxMatches){
        endGame('win', character);
      }
      gameCards.addEventListener('click', handleClick);
      firstCardClicked = null;
      secondCardClicked = null;
    }
    else {
      attempts++;
      displayStats();
      setTimeout(() => {
        firstCardContainer.classList.remove('card-revealed');
        secondCardContainer.classList.remove('card-revealed');
        gameCards.addEventListener('click', handleClick);
        firstCardClicked = null;
        secondCardClicked = null;
      }, 800);
    }
  }
}

function endGame(gameState, character) {
  var color = 'green';
  var text = 'Congratulations, you won!';

  if (gameState === 'lose') {
    character = 'hand';
    color = 'red';
    text = 'Sorry, you lose!';
    playEndGame('failure');
  } else {
    playEndGame('victory');
  }

  pose.src = `./assets/images/${character}.png`;
  pose.alt = `${character} posing`;
  modal.classList.add(color);
  modalText.textContent = text;
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.add('opacity');
  })
}

function startTimer() {
  time = setInterval(() => {
    seconds--;
    if (!seconds) {
      clearInterval(time);
      if (matches < 9) {
        endGame('lose');
      }
    }
    timerDisplay.textContent =
      `0:${seconds.toLocaleString(undefined,{minimumIntegerDigits: 2})}`;
  }, 1000)
}

function displayStats() {
  var gamesPlayedElement = document.getElementById('gamesPlayed');
  gamesPlayedElement.textContent = gamesPlayed;

  var attemptsElement = document.getElementById('attempts');
  attemptsElement.textContent = attempts;

  var accuracyElement = document.getElementById('accuracy');
  accuracyElement.textContent = `${calcAccuracy(matches,attempts)}%`;
}
function calcAccuracy(matches, attempts) {
  return matches/attempts ? Math.trunc(matches/attempts*100) : 0;
}
function playCharacterCall(character) {
  var audioSrc = `./assets/audio/characters/${character}.wav`;
  var audio = new Audio(audioSrc);
  audio.play();
}
function playEndGame(sound) {
  var audio = new Audio(`./assets/audio/${sound}.wav`)
  setTimeout(() => {
    audio.play()
  }, 1500);
}
function resetGame() {
  gamesPlayed++;
  attempts = 0;
  matches = 0;
  seconds = 60;
  modal.className = 'modal hidden';
  timerDisplay.textContent = '1:00';
  clearInterval(time);
  displayStats();
  deleteCards();
  shuffleCards();
  startTimer();
}

function toggleSound (event) {
  if (event.target.classList.contains('enabled')){
    return;
  }

  event.target.classList.toggle('enabled');
  event.target.classList.toggle('disabled');

  if(event.target.nextElementSibling){
    event.target.nextElementSibling.classList.toggle('enabled');
    event.target.nextElementSibling.classList.toggle('disabled');
  } else {
    event.target.previousElementSibling.classList.toggle('enabled');
    event.target.previousElementSibling.classList.toggle('disabled');
  }
}

function startGame() {
  gameSettings.classList.add('hidden');
  stats.classList.remove('hidden');
  startTimer();
  shuffleCards();
}

gameCards.addEventListener('click', handleClick);
resetButton.addEventListener('click', resetGame);
musicOff.addEventListener('click', toggleSound);
musicOn.addEventListener('click', toggleSound);
sfxOff.addEventListener('click', toggleSound);
sfxOn.addEventListener('click', toggleSound);
startGameButton.addEventListener('click', startGame);
// window.addEventListener('DOMContentLoaded', shuffleCards);
