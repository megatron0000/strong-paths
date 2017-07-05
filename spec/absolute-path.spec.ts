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

pathService.init(path.resolve(__dirname, 'mock-project'));

describe('AbsolutePath', () => {
    it('Should not allow paths from outside the project', () => {
        let exception: Error = null;
        try {
            pathService.createAbsolute(path.resolve(__dirname, 'some-file-outside-project.ts'));
        } catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });

    it('Should not allow itself to be created from a relative path', () => {
        let exception: Error = null;
        try {
            pathService.createAbsolute('some-file.ts');
        } catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });

    it('Should convert to InternalPath', () => {
        expect(
            pathService.createAbsolute(
                path.resolve(__dirname, 'mock-project/some-file.ts')
            ).toInternal().toString()
        ).toBe('some-file.ts');
    });

    it('Should compare if two paths are equal', () => {
        expect(
            pathService.createAbsolute(
                path.resolve(__dirname, './mock-project/some-file.ts')
            ).equals(pathService.createAbsolute(path.resolve(__dirname, './mock-project/another-file.ts')))
        ).toBe(false);

        expect(
            pathService.createAbsolute(
                path.resolve(__dirname, './mock-project/some-file.ts')
            ).equals(pathService.createAbsolute(path.resolve(__dirname, './mock-project/../mock-project/./some-file.ts')))
        ).toBe(true);
    });

    it('Should convert back to string', () => {
        expect(
            pathService.createAbsolute(
                path.resolve(__dirname, './mock-project')
            ).toString()
        ).toBe(path.resolve(__dirname, './mock-project'));
    });
});
