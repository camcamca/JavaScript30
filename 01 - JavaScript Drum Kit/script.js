addTransitionEndEventListeners();
addKeydownListener(createKeydownPreHandler(createKeydownHandler()));

export function addTransitionEndEventListeners(
  eventHandler = handleTransitionEndEvent,
) {
  getAllKeyElements().forEach((keyElement) => addEventListenerTo(keyElement));

  function addEventListenerTo(keyElement) {
    return keyElement.addEventListener('transitionend', eventHandler);
  }

  function getAllKeyElements() {
    return document.querySelectorAll('.key');
  }
}

export function handleTransitionEndEvent(e) {
  if (isNotTransformEvent()) {
    return;
  }
  this.classList.remove('playing');

  function isNotTransformEvent() {
    return e.propertyName !== 'transform';
  }
}

export function createKeydownHandler() {
  function handler(e) {
    playAudio();
    styleKey();

    function playAudio() {
      const audioElement = getAudioElementFor(e.keyCode);
      audioElement.currentTime = 0;
      audioElement.play();
    }

    function styleKey() {
      const keyElement = getKeyElementFor(e.keyCode);
      keyElement.classList.add('playing');
    }
  }

  const audioElements = new Map();
  function getAudioElementFor(keyCode) {
    if (!audioElements.has(keyCode)) {
      audioElements.set(
        keyCode,
        document.querySelector(`audio[data-key="${keyCode}"]`),
      );
    }

    return audioElements.get(keyCode);
  }

  const keyElements = new Map();
  function getKeyElementFor(keyCode) {
    if (!keyElements.has(keyCode)) {
      keyElements.set(
        keyCode,
        document.querySelector(`.key[data-key="${keyCode}"]`),
      );
    }

    return keyElements.get(keyCode);
  }

  return handler;
}

function addKeydownListener(keydownHandler) {
  document.addEventListener('keydown', keydownHandler);
}

export function createKeydownPreHandler(handler) {
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
  const eventKeyHandlers = supportedKeyCodes.reduce(
    (acc, keyCode) => ({ ...{ [keyCode]: preHandler }, ...acc }),
    {},
  );

  function preHandler(event) {
    preventQuickSearchInFirefox();
    handler(event);

    function preventQuickSearchInFirefox() {
      event.preventDefault();
    }
  }

  return (event) => {
    eventKeyHandlers[event.keyCode]?.(event);
  };
}
