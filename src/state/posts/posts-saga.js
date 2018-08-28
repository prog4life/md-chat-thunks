import {
  call, put, takeEvery, select, all,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import * as aT from 'state/action-types';
import * as firestore from 'services/firestore';
import { getWallId } from 'state/selectors';

export function* fetchPostsFlow(action) {
  try {
    const postsById = yield call(firestore.getPosts, action.filter);
    const ids = Object.keys(postsById);

    yield put({ type: aT.FETCH_POSTS_SUCCESS, payload: { ids, postsById } });
  } catch (error) {
    yield put({ type: aT.FETCH_POSTS_FAIL, error });
  }
}

export function* deletePostById({ payload }) {
  const { id } = payload;
  let { wallId } = payload;

  if (!wallId) {
    wallId = yield select(getWallId);
  }

  try {
    yield call(firestore.deletePost, wallId, id);
    yield put({
      type: aT.DELETE_POST_SUCCESS,
      payload: { id },
    });
  } catch (error) {
    yield put({
      type: aT.DELETE_POST_FAIL,
      payload: error,
      error: true,
      meta: { id },
    });
  }
}

export function* createNewPost({ payload }) {
  yield call(delay, 2000); // TEMP:

  const state = yield select();
  const wallId = getWallId(state);
  // temporary post id, generated at client
  const tempId = payload.id; // will be removed before save to firebase
  const { id, error } = yield call(firestore.createPost, wallId, payload);

  if (error) {
    yield put({
      type: aT.ADD_POST_FAIL,
      payload: error,
      error: true,
      meta: { tempId },
    });
  } else {
    yield put({
      type: aT.ADD_POST_SUCCESS,
      payload: { ...payload, id }, // rewrite id by one assigned at firestore
      meta: { tempId },
    });
  }
}

// export function* createPostFlow({ message }) {
//   try {
//     firestore.createPost(message);
//     yield put({ type: 'POST_CREATED', message });
//   } catch (e) {
//     console.error(e);
//   }
// }

// NOTE: can check needed part of state in watcher saga                          ???

export function* watchPostsActions() {
  yield takeEvery(aT.FETCH_POSTS, fetchPostsFlow);
  yield takeEvery(aT.ADD_POST, createNewPost);
  yield takeEvery(aT.DELETE_POST, deletePostById);
}

export default function* postsSaga() {
  yield all([watchPostsActions()]);
}
