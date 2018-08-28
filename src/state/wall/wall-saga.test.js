import { put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga'
import { subscribeToWall } from 'state/wall';

test('subscribeToWall saga test', (assert) => {
  const testAction = { type: 'TEST_TYPE' };
  const iter = subscribeToWall();

  // iter.next(); // => { done: false, value: <value returned by first put(...)> }
  // iter.next(); // => { done: false, value: <value returned by api call(Promise)> }
  // iter.next(); // => { done: false, value: <value returned by last put(...)> }
  // iter.next(); // => {
  //   done: false,
  //   value: undefined (since no more yield and no return'ed value)
  // }

  // expect(iter.next().value).toDeepEqual(call(delay, 1000));

  expect(iter.next().value).toDeepEqual(put({
    type: 'subscribeToWall SAGA started',
    testAction,
  }));
  // create a fake response
  const products = {};
  // mock data passed to generator, it is simpler than mocking function and spy
  expect(iter.next(products).value).toDeepEqual(put({
    type: 'SOME_TYPE',
    products,
  }));

  // create a fake error
  const error = {};

  expect(iter.throw(error).value).toDeepEqual(put({
    type: 'SOME_REJECTION_TYPE',
    error,
  }));

  expect(iter.next().value).toEqual({ done: true, value: undefined });
});
