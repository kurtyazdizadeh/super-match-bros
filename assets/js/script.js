var firstCardClicked = null,
    firstCardClasses = null,
    secondCardClicked = null,
    secondCardClasses = null,
    maxMatches = 9,
    matches = 0,
    attempts = 0,
    gamesPlayed = 0,
    gameCards = document.getElementById('gameCards'),
    modal = document.querySelector('.modal');

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
    } else {
      attempts++;
      displayStats();
      setTimeout(() => {
        firstCardClicked.classList.remove('hidden');
        secondCardClicked.classList.remove('hidden');
        gameCards.addEventListener('click', handleClick);
        firstCardClicked = null;
        secondCardClicked = null;
      }, 1500);
    }
  }
}

function displayStats() {
  var gamesPlayedElement = document.getElementById('gamesPlayed');
  gamesPlayedElement.textContent = gamesPlayed;

  var attemptsElement = document.getElementById('attempts');
  attemptsElement.textContent = attempts;

  var accuracyElement = document.getElementById('accuracy');
  accuracyElement.textContent = `${Math.trunc(matches/attempts*100)}%`;

}

gameCards.addEventListener('click', handleClick);
