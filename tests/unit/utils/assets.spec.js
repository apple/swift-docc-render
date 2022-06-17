/**
 * This source file is part of the Swift.org open source project
 *
 * Copyright (c) 2021 Apple Inc. and the Swift project authors
 * Licensed under Apache License v2.0 with Runtime Library Exception
 *
 * See https://swift.org/LICENSE.txt for license information
 * See https://swift.org/CONTRIBUTORS.txt for Swift project authors
*/
import { pathJoin } from 'docc-render/utils/assets';

let normalizeUrl;
const absoluteBaseUrl = 'https://foo.com';

function importDeps() {
  jest.resetModules();
  // eslint-disable-next-line global-require
  ({ normalizeUrl } = require('@/utils/assets'));
}

Object.defineProperty(window, 'location', {
  value: {
    href: absoluteBaseUrl,
  },
});

describe('assets', () => {
  describe('pathJoin', () => {
    it.each([
      [['foo', 'bar'], 'foo/bar'],
      [['foo/', 'bar'], 'foo/bar'],
      [['foo', '/bar'], 'foo/bar'],
      [['foo/', '/bar'], 'foo/bar'],
      [['foo/', 'bar/'], 'foo/bar/'],
      [['foo/', '/bar/'], 'foo/bar/'],
      [['/foo', '/bar'], '/foo/bar'],
      [['/foo', 'bar/'], '/foo/bar/'],
      [['/foo/', 'bar/'], '/foo/bar/'],
      [['/foo/', '/bar/'], '/foo/bar/'],
    ])('joins params %s into %s', (params, expected) => {
      expect(pathJoin(params)).toEqual(expected);
    });
  });
  describe('normalizeUrl', () => {
    it('works correctly if baseurl is just a slash', () => {
      window.baseUrl = '/';
      importDeps();
      expect(normalizeUrl('/foo')).toBe('/foo');
    });

    it('works when both have slashes leading', () => {
      window.baseUrl = '/base';
      importDeps();
      expect(normalizeUrl('/foo')).toBe('/base/foo');
    });

    it('does not change, if passed a url', () => {
      expect(normalizeUrl('https://foo.com')).toBe('https://foo.com');
      expect(normalizeUrl('http://foo.com')).toBe('http://foo.com');
    });

    it('does not change, if path is relative', () => {
      window.baseUrl = '/base';
      importDeps();
      expect(normalizeUrl('foo/bar')).toBe('foo/bar');
    });

    it('does not change, if the path is already prefixed', () => {
      window.baseUrl = '/base';
      importDeps();
      expect(normalizeUrl('/base/foo')).toBe('/base/foo');
    });

    it('returns empty, if nothing passed', () => {
      expect(normalizeUrl('')).toBe('');
      expect(normalizeUrl(undefined)).toBe(undefined);
      expect(normalizeUrl(null)).toBe(null);
    });
  });
});
