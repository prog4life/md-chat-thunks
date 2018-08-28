import { delay } from 'redux-saga';
import {
  call, put, takeEvery, takeLatest, all, select,
} from 'redux-saga/effects';
import * as aT from 'state/action-types';
import { getUid, getWallId, isFetchingPosts } from 'state/selectors';
import * as firestore from 'services/firestore';

// worker sagas
export function* fetchWallIdByCity({ city }) {
  try {
    const wallId = yield call(firestore.obtainWallIdByCity, city);
    console.log('Received wall id: ', wallId);

    yield put({ type: aT.FETCH_WALL_ID_SUCCESS, payload: wallId });
  } catch (error) {
    yield put({ type: aT.FETCH_WALL_ID_FAIL, error });
  }
}

export function* subscribeToWall({ payload }) { // TODO: pass uid with action
  let { wallId } = payload;
  try {
    yield call(firestore.subscribeToWall, payload);
    yield put({ type: aT.JOIN_WALL_SUCCESS, wallId });

    const state = yield select();
    const isFetching = isFetchingPosts(state);

    wallId = wallId || getWallId(state);

    if (!isFetching) {
      yield put({ type: aT.FETCH_POSTS, filter: { wallId } });
    }
  } catch (error) {
    yield put({ type: aT.JOIN_WALL_FAIL, error });
  }
}

export function* unsubscribeFromWall({ payload }) {
  let { uid, wallId } = payload;

  if (!uid || !wallId) {
    const state = yield select();
    uid = uid || getUid(state);
    wallId = wallId || getWallId(state);
  }
  if (!uid || !wallId) {
    yield put({ type: 'LEAVE_WALL_ABORT', meta: { uid, wallId } }); // TEMP: ?
    return;
  }
  try {
    yield call(firestore.unsubscribeFromWall, uid, wallId);
    yield put({ type: aT.LEAVE_WALL_SUCCESS, meta: { uid, wallId } });
  } catch (error) {
    yield put({ type: aT.LEAVE_WALL_FAIL, payload: error, error: true });
  }
}

// watcher sagas
export function* watchWallActions() {
  yield takeEvery(aT.FETCH_WALL_ID, fetchWallIdByCity);
  yield takeEvery(aT.JOIN_WALL, subscribeToWall);
  yield takeEvery(aT.LEAVE_WALL, unsubscribeFromWall);
}

export default function* wallSaga() {
  yield all([
    watchWallActions(),
  ]);
}
