import * as PIXI from 'pixi.js'
import config from '../config'
import baseTextures from "../textures/symbols"

export default class {
  constructor() {
    this.textures = [];
    for (let i = 0; i < baseTextures.length; i++) {
      this.textures.push([
        new PIXI.Texture(baseTextures[i], new PIXI.Rectangle(0, 35, config.slotSize.w, config.slotSize.h + 10)),
        new PIXI.Texture(baseTextures[i], new PIXI.Rectangle(0, config.slotSize.h + 110, config.slotSize.w, config.slotSize.h))
      ])
    }
  }

  getTextures () {
    return this.textures
  }

  getRandomSymbol (rolling) {
    const randomTexture = this.textures[Math.floor(Math.random() * this.textures.length)]
    const symbol = new PIXI.Sprite()
    symbol.texture = randomTexture[rolling ? 0 : 1]
    symbol.width = config.slotSize.w
    symbol.height = config.slotSize.h
    symbol.x = 0
    return symbol
  }

  /**
   * Save data to the server
   *
   * @param {object} data The data to send
   * @returns {Object|null} response data
   */
  async saveDataToServer (data, user) {
    if (!data) {
      throw new Error('Empty data given')
    }
    const dataToSend = {
      ...data,
      userId: user.id
    };
    const result = await this.sendDataToRemote(dataToSend);
    return result.content ? result.content : null
  }

  async sendDataToRemote (data, user) {
    const url = '/game/win'
    const dataToSend = this.convertDataForRemote(data)
    const response = await axios.post(url, data)
    return response.data ? response.data : null
  }

  convertDataForRemote (data) {
    // send
    const returnData = new FormData()
    for (const key in data) {
      if (!data.hasOwnProperty(key)) { continue }
      returnData.append(key, data[key])
    }
    return returnData
  }
}
