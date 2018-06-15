import { directoryExist } from './directoryExist';
let mkDirP = require('mkdirp');
/**
 * register directory when directory not exist
 * @param {string} str - full path
 */
const createDirNotExist = (str) => {
  if (directoryExist(str)) {
    mkDirP.sync(str);
  }
};

export {
  createDirNotExist,
};
