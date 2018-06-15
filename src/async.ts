import * as _glob from 'glob';
import * as fs from 'fs';
import { Task, getMonoid } from 'mocoolka-fp/lib/Task';
import { monoidAll } from 'mocoolka-fp/lib/Monoid';
import * as util from 'util';
const glob = util.promisify(_glob);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);
const _stat = util.promisify(fs.stat);
const _exists = util.promisify(fs.exists);
const M = getMonoid(monoidAll);

export const files = (name: string) => new Task<string[]>(async () => await glob(name, { nonull: false }));

export const exists = (path: string): Task<boolean> =>
    new Task(() => _exists(path));
/**
 * read a path,return all content in the path.
 * @param path
 */
export const readDir = (path: string): Task<string[]> => new Task<string[]>(async () => await readdir(path));

/**
 * check directory that is existed
 * @param {string} path -directory path
 * @return {boolean}
 */

export const directoryExist = (path: string): Task<boolean> =>
    M.concat(exists(path), stat(path).map(a => a.isDirectory()));

/**
 * stat with a path.
 * @param path
 */
export const stat = (path: string): Task<fs.Stats & { path: string }> =>
    new Task<fs.Stats & { path: string }>(async () => Object.assign(await _stat(path), { path }));

/**
 * read a file return string content.
 * @param path
 */
export const readFileAsString = (path: string): Task<string> =>
    new Task<string>(async () => await readFile(path, { encoding: 'utf8' }));

/**
 * read a file return string content.
 * @param path
 */
export const readFileAsJson = (path: string): Task<object> => readFileAsString(path).map(JSON.parse);

export const writeFileWithString = (path: string, contents: string): Task<void> =>
    new Task<void>(async () => await writeFile(path, contents, { encoding: 'utf8' }));
/**
 * check file exist
 * @param {string} strPath -file path
 * @return {boolean}
 */

export const fileExist = (path: string): Task<boolean> =>
    M.concat(exists(path), stat(path).map(a => a.isFile()));
