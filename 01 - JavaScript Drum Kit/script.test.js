import { createHandler, generateKeydownHandler } from './script.js';
import { jest } from '@jest/globals';

describe(createHandler.name, () => {
  let event;
  let audioElement;
  let keyElement;
  let handler;

  beforeEach(() => {
    event = eventObj();
    audioElement = { play: jest.fn() };
    keyElement = { classList: new Set() };
    handler = createHandler();
    document.querySelector = jest.fn();
    document.querySelector
      .mockReturnValueOnce(audioElement)
      .mockReturnValueOnce(keyElement);
  });

  test('selects the matching audio and div data-key elements', () => {
    handler(event);
    expect(callsTo(document.querySelector)).toBe(2);
    expect(argumentsTo(document.querySelector, 0)).toEqual([
      `audio[data-key="${event.keyCode}"]`,
    ]);
    expect(argumentsTo(document.querySelector, 1)).toEqual([
      `.key[data-key="${event.keyCode}"]`,
    ]);
  });

  test('invokes play on retrieved audio element', () => {
    handler(event);
    expect(callsTo(audioElement.play)).toBe(1);
  });

  test('rewinds playing audio if interrupted by a new request', () => {
    audioElement.currentTime = 99;
    handler(event);
    expect(audioElement.currentTime).toBe(0);
  });

  test('adds "playing" class to .key element classlist', () => {
    keyElement.classList = new Set();
    handler(event);
    expect(keyElement.classList).toEqual(new Set(['playing']));
  });

  test('caches retrieved elements', () => {
    handler(event);
    handler(event);
    handler(event);
    handler(event);
    handler(event);
    expect(callsTo(document.querySelector)).toBe(2);
  });
});

describe(generateKeydownHandler.name, () => {
  let mockHandler;
  let generatedHandler;
  beforeEach(() => {
    mockHandler = jest.fn();
    generatedHandler = generateKeydownHandler(mockHandler);
  });

  describe('should handle supported key codes', () => {
    const supportedKeyCodes = [
      '65',
      '83',
      '68',
      '70',
      '71',
      '72',
      '74',
      '75',
      '76',
    ];

    supportedKeyCodes.forEach((code) => {
      test(code, () => {
        const e = eventObj(code);
        generatedHandler(e);
        expect(callsTo(mockHandler)).toBe(1);
        expect(callsTo(e.preventDefault)).toBe(1);
      });
    });
  });

  describe('should not handle unsupported key codes', () => {
    const unsupportedKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    unsupportedKeys.forEach((code) => {
      test(code, () => {
        const e = eventObj(code);
        generatedHandler(e);
        expect(callsTo(mockHandler)).toBe(0);
        expect(callsTo(e.preventDefault)).toBe(0);
      });
    });
  });
});

function callsTo(mockFn) {
  return mockFn.mock.calls.length;
}

function argumentsTo(mockFn, callId = 0) {
  return mockFn.mock.calls[callId];
}

function eventObj(keyCode = 'some key code') {
  return { keyCode: keyCode, preventDefault: jest.fn() };
}
