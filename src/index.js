import * as PIXI from 'pixi.js'
import config from './config'
import kickoffAnimation from './animations/kickoff-animation'

// Setup application
const app = new PIXI.Application(config.applicationSize);
document.getElementById('canvas-wrapper').appendChild(app.view)


let rolling = false;

// background
const backgroundFront = PIXI.Sprite.from("./src/assets/reels/reels_cover.png");
backgroundFront.anchor.set(0.5);
backgroundFront.x = app.screen.width / 2;
backgroundFront.y = app.screen.height / 2;
const backgroundBack = PIXI.Sprite.from("./src/assets/reels/reels_background.png");
backgroundBack.anchor.set(0.5);
backgroundBack.x = app.screen.width / 2;
backgroundBack.y = app.screen.height / 2;

const baseTextures = [
  PIXI.Texture.from("./src/assets/symbols/symbol_bell.png"),
  PIXI.Texture.from("./src/assets/symbols/symbol_dollar.png"),
  PIXI.Texture.from("./src/assets/symbols/symbol_grapes.png"),
  PIXI.Texture.from("./src/assets/symbols/symbol_cherry.png"),
  PIXI.Texture.from("./src/assets/symbols/symbol_melone.png"),
  PIXI.Texture.from("./src/assets/symbols/symbol_orange.png"),
  PIXI.Texture.from("./src/assets/symbols/symbol_plum.png"),
  PIXI.Texture.from("./src/assets/symbols/symbol_star.png")
]

const textures = []

for (let i = 0; i < baseTextures.length; i++) {
  textures.push([
    new PIXI.Texture(baseTextures[i], new PIXI.Rectangle(0, 35, config.slotSize.w, config.slotSize.h + 10)),
    new PIXI.Texture(baseTextures[i], new PIXI.Rectangle(0, config.slotSize.h + 110, config.slotSize.w, config.slotSize.h))
  ])
}

const containers = [
  new PIXI.Container(),
  new PIXI.Container(),
  new PIXI.Container()
]

function getRandomSymbol() {
  const randomTexture = textures[Math.floor(Math.random() * textures.length)]
  const symbol = new PIXI.Sprite()
  symbol.texture = randomTexture[rolling ? 0 : 1]
  symbol.width = config.slotSize.w
  symbol.height = config.slotSize.h
  symbol.x = 0
  return symbol
}

for (let i = 0; i < containers.length; i++) {
  containers[i].x = 70 + config.containerSize.w * i + 25 * i
  containers[i].y = 30 - config.slotSize.h
  for (let j = 0; j < 5; j++) {
    const symbol = getRandomSymbol()
    symbol.y = config.slotSize.h * j + 20
    containers[i].addChild(symbol)
  }
}


// Add elements to stage
app.stage.addChild(backgroundBack);

for (let i = 0; i < containers.length; i++) {
  app.stage.addChild(containers[i]);
}

app.stage.addChild(backgroundFront);


// Button Handlers
document.getElementById('roll-button').addEventListener('click', e => {
  
})

document.getElementById('loop-button').addEventListener('click', e => {
  rolling = !rolling
})


let y = 0
let lastSlot = 0
let increment = -10
let timeElapsed = 0
const rndDuration = Math.floor(Math.random() * (600 - 180 + 1) + 180) // random od 3s - 10s
function kickoffAnimationInline (delta) {
  timeElapsed++
  // go up
  y += increment
  // if too high, change increment to go down
  if (y == -80) {
    increment = 10
  }
  // if 0 go down faster
  if (y === 0) {
    increment = 40
    rolling = !rolling
  }
  if (timeElapsed > rndDuration) {
    // TODO: slowly stop rotating and have the last 5 symbols as normal texture
    app.ticker.remove(kickoffAnimationInline)
  }
  // if down divisible by slot, remove last one and add new one
  if (y % config.slotSize.h === 0) {
    containers.forEach(container => {
      container.removeChildAt(container.children.length - 1) // remove last slot
      const symbol = getRandomSymbol()
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

document.getElementById('max-button').addEventListener('click', e => {
  app.ticker.add(kickoffAnimationInline)
})
