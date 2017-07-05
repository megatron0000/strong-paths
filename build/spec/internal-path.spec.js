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
pathService.init(path.resolve(__dirname, 'mock-project/'));
describe('InternalPath', function () {
    it('Should not allow paths from outside the project', function () {
        var exception = null;
        try {
            pathService.createInternal('../package/sub/file.ts');
        }
        catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });
    it('Should allow itself to be created from an absolute path', function () {
        var exception = null;
        try {
            pathService.createAbsolute(path.resolve(__dirname, 'some-file.ts'));
        }
        catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
        exception = null;
        try {
            pathService.createAbsolute(path.resolve(__dirname, './mock-project/some-file.ts'));
        }
        catch (e) {
            exception = e;
        }
        expect(exception).toBe(null);
    });
    it('Should store POSIX-like string, regardless of OS', function () {
        expect(pathService.createInternal('src\\package\\file.ts').toString())
            .toBe('src/package/file.ts');
    });
    it('Should convert to AbsolutePath', function () {
        expect(pathService.createInternal('some-file.ts').toAbsolute().toString()).toBe(path.resolve(__dirname, './mock-project/some-file.ts'));
    });
    it('Should compare if two paths are equal', function () {
        expect(pathService.createInternal('package/sub/some-file.ts').equals(pathService.createInternal('package/sub/another-file.ts'))).toBe(false);
        expect(pathService.createInternal('././some-file.ts').equals(pathService.createInternal('some-file.ts'))).toBe(true);
    });
    it('Should convert back to string', function () {
        expect(pathService.createInternal('package/./some-file.d.ts').toString()).toBe('package/some-file.d.ts');
    });
});
