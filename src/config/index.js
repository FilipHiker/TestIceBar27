import configDev from './config.dev'
import configProd from './config.prod'

let configToReturn = configDev
if (!window.location.hostname.startsWith('localhost')) {
  configToReturn = configProd
}

export default configToReturn