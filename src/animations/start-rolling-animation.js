export default function (containers, eventBus) {
  let y = 0
  let increment = -10
  return function (delta) {
    // go up
    y += increment
    // if too high, change increment to go down
    if (y == -80) {
      increment = 10
    }
    // if 0 go down faster
    if (y === 0) {
      eventBus.emit('animation:start-rolling-animation:end')
    }
    // do the movement
    containers.forEach(container => {
      container.children.forEach(slot => {
        slot.y += increment
      })
    });
  }
}