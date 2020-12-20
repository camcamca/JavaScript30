addKeydownListener(generateKeydownHandler(handler));

export function handler(e) {
  console.log(e.key);
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
