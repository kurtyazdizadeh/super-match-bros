var gameCards = document.getElementById('gameCards');

function handleClick(event) {
  if (event.target.className.indexOf('card-back') === -1){
    return;
  }
  event.target.classList.add('hidden');
}

gameCards.addEventListener('click', function(){
  handleClick(event)
});
