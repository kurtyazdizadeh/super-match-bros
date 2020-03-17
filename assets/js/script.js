var firstCardClicked = null;
var firstCardClasses = null;
var firstCardContainer = null;
var secondCardClicked = null;
var secondCardClasses = null;
var secondCardContainer = null;
var chosenCharacters = [];
var bgMusic = new Audio('./assets/audio/bgMusic.mp3');
var maxMatches = 9;
var matches = 0;
var attempts = 0;
var sfx = {
  globalMute: true,
  userChoseSFX: false,
  music: false
};
var gamesPlayed = 0;
var seconds = 60;
var time = null;
var timerDisplay = document.getElementById('timer');
var gameCards = document.getElementById('gameCards');
var stats = document.getElementById('stats');
var modal = document.querySelector('.modal');
var modalText = document.querySelector('.modal-text');
var pose = document.querySelector('.pose');
var resetButton = document.getElementById('reset');
var gameSettings = document.querySelector('.game-settings');
var resetSettingsButton = document.getElementById('resetSettings');
var characterSelections = document.querySelector('.character-select');
var musicOff = document.getElementById('musicOff');
var musicOn = document.getElementById('musicOn');
var sfxOff = document.getElementById('sfxOff');
var sfxOn = document.getElementById('sfxOn');
var startGameButton = document.getElementById('startGame');
var volume = document.getElementsByClassName('volume');

  bgMusic.volume = 0.33;
  bgMusic.loop = true;

volume[0].addEventListener('click', toggleGlobalSound);

function toggleGlobalSound (event) {
  sfx.globalMute = !sfx.globalMute;


  if (sfx.music && bgMusic.paused) {
    bgMusic.play();
  } else if (!bgMusic.paused) {
    bgMusic.pause();
  }

  volume[0].classList.toggle('volume-off');
  volume[0].classList.toggle('volume-on');
}

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

function handleClick(event) {
  if (event.target.className.indexOf('card-back') === -1) {
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
      if (sfx.userChoseSFX && !sfx.globalMute) {
        playCharacterCall(character);
      }
      if (matches === maxMatches) {
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
function endGame(gameState, character) {
  var color = 'green';
  var text = 'Congratulations, you won!';

  if (gameState === 'lose') {
    character = 'hand';
    color = 'red';
    text = 'Sorry, you lose!';
    if (sfx.userChoseSFX && !sfx.globalMute) playEndGame('failure');
  } else {
    if (sfx.userChoseSFX && !sfx.globalMute) playEndGame('victory');
  }

  clearInterval(time);
  pose.src = `./assets/images/pose/${character}.png`;
  pose.alt = `${character} posing`;
  modal.classList.add(color);
  modalText.textContent = text;
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.add('opacity');
  })
}
function startTimer() {
  if (sfx.userChoseSFX && !sfx.globalMute){
    var ready = new Audio('./assets/audio/go.wav');
    ready.play();
  }
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
  var audio = new Audio(`./assets/audio/${sound}.wav`);
  setTimeout(() => {
    audio.play()
  }, 1500);
}
function resetGame() {
  gamesPlayed++;
  attempts = 0;
  matches = 0;
  seconds = 60;
  modal.className = 'modal bg-size-100 hidden';
  timerDisplay.textContent = '1:00';
  clearInterval(time);
  displayStats();
  deleteCards();
  shuffleCards();
  startTimer();
}
function resetSettings() {
  clearInterval(time);
  deleteCards();
  startGameButton.classList = 'start-button disabled';
  startGameButton.removeEventListener('click', startGame);
  modal.classList.add('opacity');
  modal.classList.add('hidden');
  stats.classList.add('hidden');
  gameSettings.classList.remove('hidden');
  chosenCharacters = [];

  var previousCharacters = gameSettings.children[1].children[1].children;

  for (var i = 0; i < previousCharacters.length; i++) {
    if (previousCharacters[i].classList.contains('stock-selected')) {
      previousCharacters[i].classList.remove('stock-selected');
    }
  }

  document.getElementsByTagName('main')[0].appendChild(gameSettings);
}
function toggleSound(event) {
  var target = event.target;
  var nextSibling = event.target.nextElementSibling;
  var prevSibling = event.target.previousElementSibling;
  var selectSound = new Audio('./assets/audio/select.wav');

  if (target.classList.contains('enabled')){
    return;
  }

  target.classList.toggle('enabled');
  target.classList.toggle('disabled');

  switch (target.id) {
    case 'musicOn':
      bgMusic.play();
      sfx.music = true;
      break;
    case 'musicOff':
      bgMusic.pause();
      sfx.music = false;
      break;
    case 'sfxOff':
      sfx.userChoseSFX = false;
      break;
    case 'sfxOn':
      sfx.userChoseSFX = true;
      selectSound.play();
      break;
  }


  if(nextSibling){
    nextSibling.classList.toggle('enabled');
    nextSibling.classList.toggle('disabled');
  } else {
    prevSibling.classList.toggle('enabled');
    prevSibling.classList.toggle('disabled');
  }

  if (musicOn.classList.contains('enabled') || sfx.userChoseSFX) {
    volume[0].className = 'volume volume-on bg-size-100';
  }
  if (musicOff.classList.contains('enabled') && !sfx.userChoseSFX) {
    volume[0].className = 'volume volume-off bg-size-100';
  }

}
function selectCharacters(event) {
  var clickedCharacter = event.target.getAttribute('alt');

  if (clickedCharacter == null) return;

  if (chosenCharacters.includes(clickedCharacter)){
    chosenCharacters = chosenCharacters.filter(i => i !== clickedCharacter);
    event.target.classList.toggle('stock-selected');
  } else {
    if (chosenCharacters.length < 9){
      chosenCharacters.push(clickedCharacter);
      event.target.classList.toggle('stock-selected');
    }
  }

  if (chosenCharacters.length < 9){
    startGameButton.className = 'start-button disabled';
    startGameButton.removeEventListener('click', startGame);
  } else if (chosenCharacters.length === 9) {
    startGameButton.className = 'start-button enabled';
    startGameButton.addEventListener('click', startGame);
  }
}
function startGame() {
  seconds = 60;
  attempts = 0;
  gameSettings.classList.add('hidden');
  stats.classList.remove('hidden');
  if (chosenCharacters.length === 9){
    cardFrontImages = chosenCharacters.concat(chosenCharacters);
  }
  startTimer();
  shuffleCards();
  displayStats();
}


gameCards.addEventListener('click', handleClick);
resetButton.addEventListener('click', resetGame);
resetSettingsButton.addEventListener('click', resetSettings);
characterSelections.addEventListener('click', selectCharacters);
musicOff.addEventListener('click', toggleSound);
musicOn.addEventListener('click', toggleSound);
sfxOff.addEventListener('click', toggleSound);
sfxOn.addEventListener('click', toggleSound);
