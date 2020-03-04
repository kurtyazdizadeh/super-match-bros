var firstCardClicked = null,
    firstCardClasses = null,
    secondCardClicked = null,
    secondCardClasses = null,
    maxMatches = 9,
    matches = 0,
    attempts = 0,
    gamesPlayed = 0,
    gameCards = document.getElementById('gameCards'),
    modal = document.querySelector('.modal'),
    resetButton = document.getElementById('reset');


var cardFrontImages = [
  'css-logo',
  'docker-logo',
  'github-logo',
  'html-logo',
  'js-logo',
  'mysql-logo',
  'node-logo',
  'php-logo',
  'react-logo',
  'css-logo',
  'docker-logo',
  'github-logo',
  'html-logo',
  'js-logo',
  'mysql-logo',
  'node-logo',
  'php-logo',
  'react-logo'
]

function shuffleCards() {
  for(var i = cardFrontImages.length-1; i > 0; i--){
    var randomNum = Math.floor(Math.random() * i);
    var placeholder = cardFrontImages[i];
    cardFrontImages[i] = cardFrontImages[randomNum];
    cardFrontImages[randomNum] = placeholder;
  }
  buildCardsOnDOM();
}
function buildCardsOnDOM() {
  for(var j = 0; j < cardFrontImages.length; j++){
    var cardContainer = document.createElement('div');
    var cardBack = document.createElement('div');
    var cardFront = document.createElement('div');

    cardContainer.classList.add('card', 'col-2');
    cardBack.classList.add('card-back');
    cardFront.classList.add('card-front', cardFrontImages[j]);

    cardContainer.append(cardFront, cardBack);
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

  event.target.classList.add('hidden');

  if (!firstCardClicked) {
    firstCardClicked = event.target;
    firstCardClasses = firstCardClicked.previousElementSibling.className;
  } else if (firstCardClicked) {
    secondCardClicked = event.target;
    secondCardClasses = secondCardClicked.previousElementSibling.className;

    gameCards.removeEventListener('click', handleClick);

    if (firstCardClasses === secondCardClasses) {
      matches++;
      attempts++;
      displayStats();
      if (matches === maxMatches){
        modal.classList.remove('hidden');
      }
      gameCards.addEventListener('click', handleClick);
      firstCardClicked = null;
      secondCardClicked = null;
    }
    else {
      attempts++;
      displayStats();
      setTimeout(() => {
        firstCardClicked.classList.remove('hidden');
        secondCardClicked.classList.remove('hidden');
        gameCards.addEventListener('click', handleClick);
        firstCardClicked = null;
        secondCardClicked = null;
      }, 1000);
    }
  }
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

function resetGame() {
  gamesPlayed++;
  attempts = 0;
  matches = 0;
  modal.classList.add('hidden');
  displayStats();
  deleteCards();
  shuffleCards();
}


gameCards.addEventListener('click', handleClick);
resetButton.addEventListener('click', resetGame);
shuffleCards();
