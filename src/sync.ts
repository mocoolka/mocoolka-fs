
import mkDirP from 'mkdirp';
import rimraf from 'rimraf';
import { sync } from 'glob';
import * as fs from 'fs';
import * as pathR from 'path';
import { IO } from 'mocoolka-fp/lib/IO';
/**
 * path resolve
 * @param root
 */
export const pathResolve = (root: string) => (sub: string): string => pathR.resolve(root, sub);

/**
 * stat with a path.
 * @param path
 */
export const statSync = (path: string): IO<fs.Stats & { path: string }> => {
  return new IO(() => Object.assign(fs.statSync(path), { path }));
};

/**
 * sub path is in parent path
 * @param parent
 * @param sub
 */
export const isSubPath = (parent: string, sub: string): boolean => !(pathR.relative(parent, sub).indexOf('..') >= 0);

/**
 * read a path,return all content in the path.
 * @param path
 */
export const readDirSync = (path: string): IO<string[]> => {
  return new IO(() => fs.readdirSync(path));
};

/**
 * create directory when directory not exist
 * @param {string} path - full path
 */
export const createDirNotExistSync = (path: string): IO<void> =>
  directoryExistSync(path).map(a => { if (!a) { mkDirP.sync(path); }  });

/**
 * check directory that is existed
 * @param {string} path -directory path
 * @return {boolean}
 */

export const directoryExistSync = (path: string): IO<boolean> =>
  new IO(() => fs.existsSync(path) && fs.statSync(path).isDirectory());

/**
 * delete directory if directory exist and even directory contain files
 * @param {string} strPath
 */

export const rmdirSync = (strPath: string): IO<void> => {
  return new IO(() => {
    if (directoryExistSync(strPath).run()) {
      fs.readdirSync(strPath).forEach((file) => {
        const curPath = pathR.resolve(strPath, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          rmdirSync(curPath);
        } else { // delete file
          unlinkSync(curPath);
        }
      });

      fs.rmdirSync(strPath);
    }
  });

};
export const rmdirAllSync = (strPath: string): IO<void> => {
  return new IO(() => {
    rimraf.sync(strPath);
  });

};

/**
 * read a file return string content.
 * @param path
 */
export const readFileAsStringSync = (fileName: string) => (path: string): IO<string> => {
  return new IO(() => fs.readFileSync(pathR.resolve(path, fileName)).toString('utf8'));
};

/**
 * read a file return string content.
 * @param path
 */
export const readFileAsPlainStringSync = (path: string): IO<string> => {
  return new IO(() => fs.readFileSync(path).toString('utf8'));
};
/**
 * write a file with string content.
 * @param path
 * @param contents
 */
export const writeFileWithStringSync = ( path: string, filename: string) => (contents: string): IO<void> => {
  return createDirNotExistSync(path).map(() => fs.writeFileSync(
    pathR.resolve(path, filename), contents, { encoding: 'utf-8' }));
};

/**
 * check file exist
 * @param {string} strPath -file path
 * @return {boolean}
 */

export const fileExistSync = (path: string): IO<boolean> => {
  return new IO(() => fs.existsSync(path) && fs.statSync(path).isFile());
};

/**
 * delete file with file path
 * @param {string} strPath - file path
 */

export const unlinkSync = (fileName: string) => (rootPath: string): IO<void> => {
  return new IO(() => {
    fs.unlinkSync(pathResolve(rootPath)(fileName));
  });
};

/**
 * find file in directory using the patterns the shell uses, like stars and stuff.
 * @param {string} rootPath -search file in the directory
 * @param {string} strPatterns  -file patterns . *.json
 * @return {Array} file array string
 */

export const filesSync = (rootPath: string) => (name: string): IO<string[]> =>
  new IO(() => sync(name, { cwd: rootPath, nonull: false }));

/**
 * calculate path depth
 * @param {string} strPath - path
 * @returns {number}
 */

export const directoryDepth = (strPath: string): number => {
  strPath = pathR.normalize(strPath);
  return strPath.split(pathR.sep).length;
};

/**
 * get directory from path
 * @param {string} strPath - full path
 * @returns {string}
 */
export const getDirectoryName = (strPath: string): string => {
  return pathR.parse(strPath).dir;
};

/**
 * Returns  name of file name.
 * @param {string} strPath file fullName that contain path
 * @return {string|null}
 */

export const getFileName = (strPath: string): string => {

  return pathR.parse(strPath).base;

};

/**
 * check path in root is full path
 * @param {string} strRoot -root path
 * @param {string} strPath -check path in root path
 * @return {boolean} -true meaning is full path,otherwise false
 */

export const isFullPath = (strRoot: string, strPath: string): boolean => {
  return pathR.resolve(strRoot, strPath) === strPath;
};

/**
 * get real path
 * @param {string} strPath
 * @return {string|null}
 */

export const realPathSync = (strPath: string): string => {

  return fs.realpathSync(strPath);

};

/**
 * if path is symbol link ,return real path
 * @param {string} strPath
 * @returns {string|null}
 */

export const unSymbolLinkSync = (strPath: string): string | null => {

  if (!strPath) {
    return null;
  }
  let stats: any = null;
  try {
    stats = fs.lstatSync(strPath);
  } catch (e) {
    return null;
  }

  if (!stats) {
    return null;
  }
  if (stats.isSymbolicLink()) {
    const _realPath = realPathSync(strPath);

    return unSymbolLinkSync(_realPath);
  } else {
    return stats.isDirectory() ? strPath : null;
  }
};
