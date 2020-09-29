export default function (containers) {
  let y = 0
  let increment = -10
  return function (delta) {
    y += increment
    if (y == -50) {
      increment = 10
    }
    if (y === 0) {
      increment = 30
      containers.forEach(container => {
        container.children.forEach(child => {
          child.texture = child.textureRolling
        })
      });
    }
    containers.forEach(container => {
      container.y += increment
    });
  }
}