"use strict";
var inversify_1 = require("inversify");
var index_1 = require("../src/index");
var path = require("path");
/// <reference types="jasmine" />
var container = new inversify_1.Container();
container.bind('IPathService').to(index_1.PathService);
container.bind('IInternalPath').to(index_1.InternalPath);
container.bind('IAbsolutePath').to(index_1.AbsolutePath);
var pathService = container.get('IPathService');
pathService.init(path.resolve(__dirname, 'mock-project'));
describe('AbsolutePath', function () {
    it('Should not allow paths from outside the project', function () {
        var exception = null;
        try {
            pathService.createAbsolute(path.resolve(__dirname, 'some-file-outside-project.ts'));
        }
        catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });
    it('Should not allow itself to be created from a relative path', function () {
        var exception = null;
        try {
            pathService.createAbsolute('some-file.ts');
        }
        catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });
    it('Should convert to InternalPath', function () {
        expect(pathService.createAbsolute(path.resolve(__dirname, 'mock-project/some-file.ts')).toInternal().toString()).toBe('some-file.ts');
    });
    it('Should compare if two paths are equal', function () {
        expect(pathService.createAbsolute(path.resolve(__dirname, './mock-project/some-file.ts')).equals(pathService.createAbsolute(path.resolve(__dirname, './mock-project/another-file.ts')))).toBe(false);
        expect(pathService.createAbsolute(path.resolve(__dirname, './mock-project/some-file.ts')).equals(pathService.createAbsolute(path.resolve(__dirname, './mock-project/../mock-project/./some-file.ts')))).toBe(true);
    });
    it('Should convert back to string', function () {
        expect(pathService.createAbsolute(path.resolve(__dirname, './mock-project')).toString()).toBe(path.resolve(__dirname, './mock-project'));
    });
});
