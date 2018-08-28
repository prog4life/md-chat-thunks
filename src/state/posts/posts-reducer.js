import { combineReducers } from 'redux';
import { combineActions } from 'redux-actions';

import * as aT from 'state/action-types';

import { createReducer, addIfNotExist, makeUnion, setErrorValue } from 'state/utils';

const postsById = (state = null, { type, payload, meta }) => {
  switch (type) {
    case aT.FETCH_POSTS:
      return state === null ? {} : state;
    case aT.FETCH_POSTS_SUCCESS:
      return { ...state, ...payload.postsById };
    case aT.ADD_POST:
      return {
        ...state,
        // next id is generated at client and will be temporary
        [payload.id]: { ...payload, hasTempId: true },
      };
    case aT.ADD_POST_SUCCESS: {
      const nextState = { ...state };
      delete nextState[meta.tempId]; // tempId that was generated at client
      nextState[payload.id] = { ...payload };
      return nextState;
    }
    case aT.ADD_POST_FAIL: {
      const nextState = { ...state };
      delete nextState[meta.tempId]; // tempId that was generated at client
      return nextState;
    }
    case aT.DELETE_POST:
      return {
        ...state,
        [payload.id]: { ...state[payload.id], isDeleted: true },
      };
    case aT.DELETE_POST_SUCCESS: {
      const nextState = { ...state };
      delete nextState[payload.id];
      return nextState;
    }
    case aT.DELETE_POST_FAIL: {
      // remove isDeleted flag from post
      const { isDeleted, ...postData } = state[meta.id];
      return {
        ...state,
        [meta.id]: { ...postData },
      };
    }
    default:
      return state;
  }
};

// TODO: do not show Edit / Delete buttons for post until post creation
// have succeeded

const listedIds = (state = null, { type, payload, meta }) => {
  switch (type) {
    case aT.FETCH_POSTS:
      return state === null ? [] : state;
    case aT.FETCH_POSTS_SUCCESS:
      return makeUnion(state, payload.ids);
    case aT.ADD_POST:
      return addIfNotExist(state, payload.id);
    case aT.ADD_POST_SUCCESS:
      return state.filter(id => id !== meta.tempId).concat(payload.id);
    case aT.ADD_POST_FAIL:
      return state.filter(id => id !== meta.tempId);
    // case aT.DELETE_POST:
    //   return state.filter(id => id !== payload.id);
    case aT.DELETE_POST_SUCCESS:
      return state.filter(id => id !== payload.id);
    // case aT.DELETE_POST_FAIL:
    //   return [...state, meta.id];
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case aT.FETCH_POSTS:
      return true;
    case aT.FETCH_POSTS_SUCCESS:
    case aT.FETCH_POSTS_FAIL:
      return false;
    default:
      return state;
  }
};

const initialErrorsState = {
  fetching: null, add: null, remove: null, update: null,
};

const errors = (state = initialErrorsState, { type, payload }) => {
  switch (type) {
    case aT.FETCH_POSTS:
      return setErrorValue(state, 'fetching');
    case aT.FETCH_POSTS_FAIL:
      return setErrorValue(state, 'fetching', payload);
    case aT.ADD_POST:
      return setErrorValue(state, 'add');
    // NOTE: show error only if post was not deleted by user (add display flag?)
    case aT.ADD_POST_FAIL:
      return setErrorValue(state, 'add', payload);
    case aT.DELETE_POST:
      return setErrorValue(state, 'remove');
    case aT.DELETE_POST_FAIL:
      return setErrorValue(state, 'remove', payload);
    default:
      return state;
  }
};

export default function postsReducer(state = {}, action) {
  return {
    postsById: postsById(state.postsById, action, state),
    listedIds: listedIds(state.listedIds, action),
    isFetching: isFetching(state.isFetching, action),
    errors: errors(state.errors, action),
  };
}

// export default combineReducers({
//   postsById,
//   changes,
//   // toBeRemoved,
//   isFetching,
//   listedIds,
//   errors,
// });


// to store posts data temporarily until operation result (success/fail)
// const changes = createReducer({
//   [aT.ADD_POST]: (state, { payload }) => ({
//     ...state,
//     add: addIfNotExist(state.add, payload.id), // it's temporary id
//   }),
//   [combineActions(
//     aT.ADD_POST_SUCCESS,
//     aT.ADD_POST_FAIL,
//   )]: (state, { meta }) => ({
//     ...state,
//     add: state.add.filter(id => id !== meta.tempId),
//   }),
//   [aT.DELETE_POST]: (state, { payload }) => ({
//     ...state,
//     add: state.add.filter(id => id !== payload.id),
//     remove: addIfNotExist(state.remove, payload.id),
//   }),
//   [combineActions(
//     aT.DELETE_POST_SUCCESS,
//     aT.DELETE_POST_FAIL,
//   )]: (state, { payload }) => ({
//     ...state,
//     remove: state.remove.filter(id => id !== payload.id),
//   }),
// }, { add: [], remove: [], edit: {} });

// when post removal starts its id is landed here until deletion success or fail
