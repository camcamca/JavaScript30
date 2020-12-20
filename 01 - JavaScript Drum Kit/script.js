addKeydownListener(generateKeydownHandler(handler));

export function handler(e) {
  const audioElement = getAudioElementFor(e.keyCode);
  audioElement.play();
}

function getAudioElementFor(keyCode) {
  return document.querySelector(`audio[data-key="${keyCode}"]`);
}

function addKeydownListener(f) {
  document.addEventListener('keydown', f);
}

export function generateKeydownHandler(handler) {
  const eventKeyHandlers = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].reduce(
    (acc, eventKey) => ({ ...{ [eventKey]: preHandler }, ...acc }),
    {},
  );

  function preHandler(event) {
    preventQuickSearchInFirefox();
    handler(event);

    function preventQuickSearchInFirefox() {
      event.preventDefault();
    }
  }

  return (event) => eventKeyHandlers[event.key]?.(event);
}
