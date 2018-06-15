import { directoryExist } from './directoryExist';
import { deleteFile }  from './deleteFile';
import { path }  from './path';
import fs from 'fs';
/**
 * delete directory if directory exist and even directory contain files
 * @param {string} strPath
 */

const deleteDirExist = (strPath) => {

  if (directoryExist(strPath)) {
    fs.readdirSync(strPath).forEach((file)=> {
      let curPath = path([strPath, file]);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteDirExist(curPath);
      } else { // delete file
        deleteFile(curPath);
      }
    });

    fs.rmdirSync(strPath);
  }

};
