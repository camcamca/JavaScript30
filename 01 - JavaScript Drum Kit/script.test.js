import {
  addEventListeners,
  createHandler,
  handleTransitionEnd,
  generateKeydownHandler,
} from './script.js';
import { jest } from '@jest/globals';

describe(addEventListeners.name, () => {
  test('should add transitionend event handler to all .key elements', () => {
    const keyElements = [elementObj(), elementObj(), elementObj()];
    document.querySelectorAll = jest.fn(() => keyElements);
    const mockHandler = jest.fn();
    addEventListeners(mockHandler);
    expect(argumentsTo(document.querySelectorAll)).toEqual(['.key']);
    keyElements.forEach((el) => {
      expect(callsTo(el.addEventListener)).toBe(1);
      expect(argumentsTo(el.addEventListener)).toEqual([
        'transitionend',
        mockHandler,
      ]);
    });
  });
});

describe(handleTransitionEnd.name, () => {
  let callingElement;
  beforeEach(() => {
    callingElement = elementObj({ classList: new Set(['playing']) });
    callingElement.classList.remove = callingElement.classList.delete;
    callingElement.handleTransitionEnd = handleTransitionEnd;
  });

  test('should handle transitionend events with the "transform" property', () => {
    callingElement.handleTransitionEnd(eventObj({ propertyName: 'transform' }));
    expect(callingElement.classList.size).toBe(0);
  });

  test('should ignore transitionend events without the "transform" property', () => {
    callingElement.handleTransitionEnd(
      eventObj({ propertyName: 'not transform' }),
    );
    expect(callingElement.classList.has('playing')).toBe(true);
  });
});

describe(createHandler.name, () => {
  describe('handler', () => {
    let event;
    let audioElement;
    let keyElement;
    let handler;

    beforeEach(() => {
      event = eventObj();
      audioElement = elementObj();
      keyElement = elementObj();
      handler = createHandler();
      document.querySelector = jest.fn();
      document.querySelector
        .mockReturnValueOnce(audioElement)
        .mockReturnValueOnce(keyElement);
    });

    test('should select the matching audio and div data-key elements', () => {
      handler(event);
      expect(callsTo(document.querySelector)).toBe(2);
      expect(argumentsTo(document.querySelector, 0)).toEqual([
        `audio[data-key="${event.keyCode}"]`,
      ]);
      expect(argumentsTo(document.querySelector, 1)).toEqual([
        `.key[data-key="${event.keyCode}"]`,
      ]);
    });

    test('should invoke play on retrieved audio element', () => {
      handler(event);
      expect(callsTo(audioElement.play)).toBe(1);
    });

    test('should rewind playing audio if interrupted by a new request', () => {
      audioElement.currentTime = 99;
      handler(event);
      expect(audioElement.currentTime).toBe(0);
    });

    test('should add "playing" class to .key element classlist', () => {
      keyElement.classList = new Set();
      handler(event);
      expect(keyElement.classList).toEqual(new Set(['playing']));
    });

    test('should cache retrieved elements', () => {
      handler(event);
      handler(event);
      handler(event);
      handler(event);
      handler(event);
      expect(callsTo(document.querySelector)).toBe(2);
    });
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
        const e = eventObj({ keyCode: code });
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
        const e = eventObj({ keyCode: code });
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

function eventObj({
  keyCode = 'some key code',
  preventDefault = jest.fn(),
  propertyName = 'some property name',
} = {}) {
  return {
    keyCode: keyCode,
    preventDefault: preventDefault,
    propertyName: propertyName,
  };
}

function elementObj({
  play = jest.fn(),
  classList = new Set(),
  addEventListener = jest.fn(),
} = {}) {
  return {
    play: play,
    classList: classList,
    addEventListener: addEventListener,
  };
}
