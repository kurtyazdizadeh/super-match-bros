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
    gameCards = document.getElementById('gameCards'),
    modal = document.querySelector('.modal'),
    resetButton = document.getElementById('reset');


var cardFrontImages = [
  'captfalcon',
  'dk',
  'jigglypuff',
  'kirby',
  'link',
  'luigi',
  'mario',
  'pikachu',
  'samus',
  'captfalcon',
  'dk',
  'jigglypuff',
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
  buildCardsOnDOM();
}
function buildCardsOnDOM() {
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
        firstCardContainer.classList.remove('card-revealed');
        secondCardContainer.classList.remove('card-revealed');
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
window.addEventListener('DOMContentLoaded', shuffleCards);
