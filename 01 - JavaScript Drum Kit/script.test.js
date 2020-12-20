import { handler, generateKeydownHandler } from './script.js';
import { jest } from '@jest/globals';

describe(`handle`, () => {
  test('logs to console', () => {
    console.log = jest.fn();
    handler({ key: "doesn't matter" });
    expect(console.log.mock.calls.length).toBe(1);
  });
});

describe('keydownHandler', () => {
  let mockHandler;
  let sut;
  beforeEach(() => {
    mockHandler = jest.fn();
    sut = generateKeydownHandler(mockHandler);
  });

  describe(`should listen for keys`, () => {
    const supportedKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];

    supportedKeys.forEach((key) => {
      test(key, () => {
        sut(eventObj(key));
        expect(callsTo(mockHandler)).toBe(1);
      });
    });
  });

  describe(`should not listen for keys`, () => {
    const unsupportedKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];

    unsupportedKeys.forEach((key) => {
      test(key, () => {
        sut(eventObj(key));
        expect(callsTo(mockHandler)).toBe(0);
      });
    });
  });
});

function callsTo(mockFn) {
  return mockFn.mock.calls.length;
}

function eventObj(key) {
  return { key: key, preventDefault: () => {} };
}
