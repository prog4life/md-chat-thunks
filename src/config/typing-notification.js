export default {
  placeholder: 'No one is typing',
  repeats: 3,
  // interval to change opacity from 0 to 1 or back
  duration: 500,
  // opacity change step(must: 1 / step === 'integer'), it affects amount
  // of steps to change element opacity from 0 to 1 or back, can be one
  // of: [0.01, 0.02, 0.04, 0.05, 0.1, 0.2, 0.25, 0.5, 1]
  step: 0.5,
  bidirectional: true
};
