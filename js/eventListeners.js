document.addEventListener('DOMContentLoaded', () => {
  const start_modal = document.getElementById('game_starter');
  const start_button = document.getElementById('start');

  start_button.addEventListener('click', () => {
    start_modal.classList.add('deactive');


window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
    case ' ':
      player.jump()
      keys.w.pressed = true
      break
    case 'a':
    case 'ArrowLeft':
      keys.a.pressed = true
      break
    case 'd':
    case 'ArrowRight':
      keys.d.pressed = true
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'a':
    case 'ArrowLeft':
      keys.a.pressed = false
      break
    case 'd':
    case 'ArrowRight':
      keys.d.pressed = false
      break
  }
})
});
  const play_again_button = document.getElementById('play-again');
play_again_button.addEventListener('click',()=>{
  window.location.reload();
});
});




// On return to game's tab, ensure delta time is reset
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    lastTime = performance.now()
  }
})