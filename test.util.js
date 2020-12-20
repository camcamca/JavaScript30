import { jest } from '@jest/globals';

export function mockFn(impl = () => {}) {
  return jest.fn(impl);
}

export function callsTo(mockFn) {
  return mockFn.mock.calls.length;
}

export function argumentsTo(mockFn, callId = 0) {
  return mockFn.mock.calls[callId];
}

export function eventObj({
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

export function elementObj({
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
