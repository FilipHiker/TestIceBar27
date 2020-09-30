import config from '../config'

export default function (gameService, containers, eventBus) {
  let y = 0
  let lastSlot = 0
  let increment = 40
  let timeElapsed = 0
  const rndDuration = Math.floor(Math.random() * (600 - 180 + 1) + 180) // random od 3s - 10s
  return function (delta) {
    timeElapsed++
    // go up
    y += increment
    // rolling = !rolling
  
    if (timeElapsed > rndDuration) {
      eventBus.emit('animation:rolling-animation:end')
    }
    // if down divisible by slot, remove last one and add new one
    if (y % config.slotSize.h === 0) {
      containers.forEach(container => {
        container.removeChildAt(container.children.length - 1) // remove last slot
        const symbol = gameService.getRandomSymbol(true);
        symbol.y = 0
        container.addChildAt(symbol, 0) // add new symbol
      });
    }
    // do the movement
    containers.forEach(container => {
      container.children.forEach(slot => {
        slot.y += increment
      })
    });
  }
}