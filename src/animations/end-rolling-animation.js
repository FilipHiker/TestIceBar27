import config from '../config'

export default function (gameService, containers, eventBus) {
  let y = 0;
  const max = config.slotSize.h * 5;
  let increment = 10;
  return function (delta) {
    // go down
    y += increment;
    // if down divisible by slot, remove last one and add new one
    if (y % config.slotSize.h === 0) {
      containers.forEach((container) => {
        container.removeChildAt(container.children.length - 1); // remove last slot
        const symbol = gameService.getRandomSymbol(false);
        symbol.y = 0;
        container.addChildAt(symbol, 0); // add new symbol
      });
    }
    // when done emit event
    if (y == max) {
      eventBus.emit('animation:end-rolling-animation:end')
    }
    // do the movement
    containers.forEach((container) => {
      container.children.forEach((slot) => {
        slot.y += increment;
      });
    });
  };
}