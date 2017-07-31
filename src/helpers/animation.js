export function fadeInOut(element, times = 1, interval = 600) {
  return new Promise((resolve) => {
    // if step is 0.1 of full opacity (1), then it will be 10 intervals
    const stepIntl = interval / 10;
    let fullyChanged = false;

    fadeInOut.repeats = fadeInOut.repeats ? fadeInOut.repeats : 0;

    if (fadeInOut.repeats === times) {
      fadeInOut.repeats = 0;
      resolve();
      return;
    }

    const intervalId = setInterval(() => {
      if (Number(element.style.opacity) === 1) {
        fullyChanged = true;
      }

      if (fullyChanged) {
        element.style.opacity = Number(element.style.opacity) - 0.1;

        if (Number(element.style.opacity) === 0) {
          fadeInOut.repeats++;
          clearInterval(intervalId);
          fadeInOut(element, times, interval);
          return;
        }

      } else {
        element.style.opacity = Number(element.style.opacity) + 0.1;
      }
    }, stepIntl);
  });
}

// function fadeIn() {
  // become visible
// }

// function fadeOut() {
  // disappear
// }
