import * as PIXI from 'pixi.js'
import config from './config'
import EventEmitter from 'events'
import GameService from './services/game-service'
import startRollingAnimationFactory from './animations/start-rolling-animation'
import rollingAnimationFactory from './animations/rolling-animation'
import endRollingAnimationFactory from './animations/end-rolling-animation'

// Setup application
const app = new PIXI.Application(config.applicationSize);
const eventBus = new EventEmitter()
const gameService = new GameService()

// Inject app to DOM
document.getElementById('canvas-wrapper').appendChild(app.view)

// background
const backgroundFront = PIXI.Sprite.from("./src/assets/reels/reels_cover.png");
backgroundFront.anchor.set(0.5);
backgroundFront.x = app.screen.width / 2;
backgroundFront.y = app.screen.height / 2;
const backgroundBack = PIXI.Sprite.from("./src/assets/reels/reels_background.png");
backgroundBack.anchor.set(0.5);
backgroundBack.x = app.screen.width / 2;
backgroundBack.y = app.screen.height / 2;

const containers = [
  new PIXI.Container(),
  new PIXI.Container(),
  new PIXI.Container()
]

for (let i = 0; i < containers.length; i++) {
  containers[i].x = 70 + config.containerSize.w * i + 25 * i
  containers[i].y = 30 - config.slotSize.h
  for (let j = 0; j < 5; j++) {
    const symbol = gameService.getRandomSymbol(false);
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

const startRollingAnimation = startRollingAnimationFactory(containers, eventBus)
const endRollingAnimation = endRollingAnimationFactory(gameService, containers, eventBus);
const rollingAnimation = rollingAnimationFactory(gameService, containers, eventBus);


// Button Handlers

document.getElementById('loop-button').addEventListener('click', e => {
  rolling = !rolling
})

document.getElementById('roll-button').addEventListener('click', e => {
  app.ticker.add(startRollingAnimation)
})

// Events

eventBus.on('animation:start-rolling-animation:end', () => {
  app.ticker.remove(startRollingAnimation)
  app.ticker.add(rollingAnimation)
})

eventBus.on('animation:rolling-animation:end', () => {
  app.ticker.remove(rollingAnimation);
  app.ticker.add(endRollingAnimation);
});

eventBus.on('animation:end-rolling-animation:end', () => {
  app.ticker.remove(endRollingAnimation);
  // HERE WE CHECK IF USER WON ANYTHING
  // by checking the symbols in containers and comparing
  // get value from matching symbols
  // gameService.saveDataToServer({ value: matchingSymbol.value }, user)
});