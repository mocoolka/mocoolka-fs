import {
    files,
} from '../async';
describe('fs', () => {
    describe('async', async () => {
        it('files', async () => {
            const result = await files('./**/**.js').run();
            expect(result).toEqual('/my/test');
        });
    });
});
