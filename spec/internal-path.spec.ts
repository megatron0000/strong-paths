import { Container } from 'inversify';
import {
    IPathService,
    IAbsolutePath,
    IInternalPath,
    PathService,
    InternalPath,
    AbsolutePath
} from '../src/index';
import path = require('path');
/// <reference types="jasmine" />

let container = new Container();

container.bind<IPathService>('IPathService').to(PathService);
container.bind<IInternalPath>('IInternalPath').to(InternalPath);
container.bind<IAbsolutePath>('IAbsolutePath').to(AbsolutePath);

let pathService = container.get<IPathService>('IPathService');

pathService.init(path.resolve(__dirname, 'mock-project/'));

describe('InternalPath', () => {
    it('Should not allow paths from outside the project', () => {
        let exception: Error = null;
        try {
            pathService.createInternal('../package/sub/file.ts');
        } catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });

    it('Should allow itself to be created from an absolute path', () => {
        let exception: Error = null;
        try {
            pathService.createAbsolute(path.resolve(__dirname, 'some-file.ts'));
        } catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
        exception = null;
        try {
            pathService.createAbsolute(path.resolve(__dirname, './mock-project/some-file.ts'));
        } catch (e) {
            exception = e;
        }
        expect(exception).toBe(null);
    });

    it('Should store POSIX-like string, regardless of OS', () => {
        expect(pathService.createInternal('src\\package\\file.ts').toString())
            .toBe('src/package/file.ts');
    });

    it('Should convert to AbsolutePath', () => {
        expect(
            pathService.createInternal(
                'some-file.ts'
            ).toAbsolute().toString()
        ).toBe(path.resolve(__dirname, './mock-project/some-file.ts'));
    });

    it('Should compare if two paths are equal', () => {
        expect(
            pathService.createInternal(
                'package/sub/some-file.ts'
            ).equals(pathService.createInternal('package/sub/another-file.ts'))
        ).toBe(false);

        expect(
            pathService.createInternal(
                '././some-file.ts'
            ).equals(pathService.createInternal('some-file.ts'))
        ).toBe(true);
    });

    it('Should convert back to string', () => {
        expect(
            pathService.createInternal(
                'package/./some-file.d.ts'
            ).toString()
        ).toBe('package/some-file.d.ts');
    });
});
