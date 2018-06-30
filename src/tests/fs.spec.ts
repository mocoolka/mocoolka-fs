import {
    statSync, pathResolve, readDirSync, directoryExistSync, fileExistSync,
    createDirNotExistSync, writeFileWithStringSync, unlinkSync, rmdirSync,
    readFileAsStringSync, isSubPath, filesSync
} from '../sync';
import * as path from 'path';
import { tryCatch } from 'mocoolka-fp/lib/Exception';
// console.log(query(__dirname)('test').run());

describe('fs', () => {
    describe('path', () => {
        it('pathResolve', () => {
            expect(pathResolve('/my')('test')).toEqual('/my/test');
        });
        it('stat', () => {
            expect(statSync(pathResolve(__dirname)('test')).run().size).toEqual(4096);
            expect(tryCatch(statSync(pathResolve(__dirname)('test123'))).run().isLeft()).toEqual(true);
        });
        it('isSubPath', () => {
            expect(isSubPath(path.resolve(__dirname, 'test'),
                path.resolve(__dirname, 'test', 'a.txt'))).toEqual(true);
            expect(isSubPath(path.resolve(__dirname, 'test'),
                path.resolve(__dirname, 'test', '..'))).toEqual(false);
            expect(isSubPath(path.resolve(__dirname, 'test'),
                path.resolve(__dirname, 'test'))).toEqual(true);
        });
    });
    describe('path', () => {
        it('readDir', () => {
            expect(readDirSync(pathResolve(__dirname)('test')).run()).toContain('createDirNotExist.js');
        });
        it('directoryExist', () => {
            expect(directoryExistSync(pathResolve(__dirname)('test')).run()).toEqual(true);
            expect(directoryExistSync(pathResolve(__dirname)('test2')).run()).toEqual(false);
        });
        it('createDirNotExist && rmdir', () => {
            expect(createDirNotExistSync(pathResolve(__dirname)('test1')).run()).toBeUndefined();
            expect(rmdirSync(path.resolve(__dirname, 'test1')).run()).toBeUndefined();
        });
    });
    describe('path', () => {
        it('fileExist', () => {
            expect(fileExistSync(path.resolve(__dirname, 'test')).run()).toEqual(false);
            expect(fileExistSync(path.resolve(__dirname, 'test2')).run()).toEqual(false);
            expect(fileExistSync(path.resolve(__dirname, 'test', 'deleteDirExist.js')).run()).toEqual(true);
            expect(fileExistSync(path.resolve(__dirname, 'test', 'deleteDirExist1.js')).run()).toEqual(false);
        });
        it('writeFileWithString && unlink', () => {
            expect(writeFileWithStringSync('temp.txt', '123')(path.resolve(__dirname, 'test3')).run()).toBeUndefined();
            expect(unlinkSync('temp.txt')(path.resolve(__dirname, 'test3')).run()).toBeUndefined();
            expect(rmdirSync(path.resolve(__dirname, 'test3')).run()).toBeUndefined();
        });
        it('readFileAsString', () => {
            expect(readFileAsStringSync('a.txt')(path.resolve(__dirname, 'test')).run()).toEqual('123');
            expect(tryCatch(readFileAsStringSync('a1.txt')(path.resolve(__dirname, 'test'))).run()
                .isLeft()).toEqual(true);
        });

    });
    describe('query', () => {
        it('filesSync', () => {
            expect(filesSync(path.resolve(__dirname, 'test'))('**/*.js').run()).toEqual(
                ["createDirNotExist.js",
                    "deleteDirExist.js",
                    "validation/mk-keywords/index.js",
                    "validation/mk-keywords/keywords/directoryExist.js",
                    "validation/mk-keywords/keywords/fileExist.js",
                    "validation/mk-keywords/keywords/index.js",
                    "validation/mk-keywords/keywords/not-together.js",
                    "validation/schemaValidation.js"]
            );

        });
    });
});
