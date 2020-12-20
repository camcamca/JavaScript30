import {
  addTransitionEndEventListeners,
  createKeydownHandler,
  handleTransitionEndEvent,
  createKeydownPreHandler,
} from './script.js';
import {
  mockFn,
  callsTo,
  argumentsTo,
  eventObj,
  elementObj,
} from '../test.util.js';

describe(addTransitionEndEventListeners.name, () => {
  let keyElements;
  let mockHandler;

  beforeEach(() => {
    keyElements = [elementObj(), elementObj(), elementObj()];
    document.querySelectorAll = mockFn(() => keyElements);
    mockHandler = mockFn();
  });

  test('should add "transitionend" event listener to all .key elements', () => {
    addTransitionEndEventListeners(mockHandler);
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

describe(handleTransitionEndEvent.name, () => {
  let callingElement;
  beforeEach(() => {
    callingElement = elementObj({ classList: new Set(['playing']) });
    callingElement.classList.remove = callingElement.classList.delete;
    callingElement.handleTransitionEnd = handleTransitionEndEvent;
  });

  test('should handle events with the "transform" property', () => {
    callingElement.handleTransitionEnd(eventObj({ propertyName: 'transform' }));
    expect(callingElement.classList.size).toBe(0);
  });

  test('should ignore events without the "transform" property', () => {
    callingElement.handleTransitionEnd(
      eventObj({ propertyName: 'not transform' }),
    );
    expect(callingElement.classList.has('playing')).toBe(true);
  });
});

describe(createKeydownPreHandler.name, () => {
  let mockHandler;
  let generatedHandler;
  beforeEach(() => {
    mockHandler = mockFn();
    generatedHandler = createKeydownPreHandler(mockHandler);
  });

  describe('should prehandle supported key codes', () => {
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

  describe('should not prehandle unsupported key codes', () => {
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

describe(createKeydownHandler.name, () => {
  describe('handler', () => {
    let event;
    let audioElement;
    let keyElement;
    let handler;

    beforeEach(() => {
      event = eventObj();
      audioElement = elementObj();
      keyElement = elementObj();
      handler = createKeydownHandler();
      document.querySelector = mockFn();
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
