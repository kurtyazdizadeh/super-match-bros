var firstCardClicked,
    firstCardClasses,
    secondCardClicked,
    secondCardClasses,
    gameCards = document.getElementById('gameCards');

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
      gameCards.addEventListener('click', handleClick);
      firstCardClicked = null;
      secondCardClicked = null;
    } else {
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

gameCards.addEventListener('click', handleClick);
