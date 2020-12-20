import { handler, generateKeydownHandler } from './script.js';
import { jest } from '@jest/globals';

describe(handler.name, () => {
  let event;
  let audioElement;
  beforeEach(() => {
    event = eventObj();
    audioElement = { play: jest.fn() };
    document.querySelector = jest.fn(() => audioElement);
  });

  test('selects the matching audio data-key element', () => {
    handler(event);
    expect(callsTo(document.querySelector)).toBe(1);
    expect(argumentsTo(document.querySelector)).toEqual([
      `audio[data-key="${event.keyCode}"]`,
    ]);
  });

  test('invokes play on retrieved audio element', () => {
    handler(event);
    expect(callsTo(audioElement.play)).toBe(1);
  });
});

describe(generateKeydownHandler.name, () => {
  let mockHandler;
  let generatedHandler;
  beforeEach(() => {
    mockHandler = jest.fn();
    generatedHandler = generateKeydownHandler(mockHandler);
  });

  describe('should handle supported keys', () => {
    const supportedKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];

    supportedKeys.forEach((key) => {
      test(key, () => {
        const e = eventObj(key);
        generatedHandler(e);
        expect(callsTo(mockHandler)).toBe(1);
        expect(callsTo(e.preventDefault)).toBe(1);
      });
    });
  });

  describe('should not handle unsupported keys', () => {
    const unsupportedKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];

    unsupportedKeys.forEach((key) => {
      test(key, () => {
        const e = eventObj(key);
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

function eventObj(key = 'some key', keyCode = 'some key code') {
  return { key: key, keyCode: keyCode, preventDefault: jest.fn() };
}
