import * as aT from 'state/action-types';
import { getUserId, getToken, isAnonymousSelector } from 'state/selectors';
import * as sE from 'constants/socket-events';
import { toJSON, parseJSON } from 'utils';

export const signIn = () => ({ type: aT.SIGN_IN });
export const signOut = () => ({ type: aT.SIGN_OUT });

export const maybeLogin = thatToken => (dispatch, getState, socket) => {
  const token = thatToken || getToken(getState());

  if (token) {
    // TODO: auth with token
    return;
  }
  dispatch({ type: aT.LOGIN_ANON });
  socket.emit(sE.AUTH_ANON, toJSON({ userId: null }));
};

export const loginAnonSucces = data => ({
  type: aT.LOGIN_ANON_SUCCESS,
  payload: { ...data, userId: data.id },
});

export const loginAnonFail = ({ message }) => ({
  type: aT.LOGIN_ANON_FAIL,
  payload: new Error(message),
  error: true,
});

export const signInIfNeeded = () => (dispatch, getState) => {
  // TODO: add backoff                                                           !!!
  const state = getState();
  const uid = getUserId(state);
  // null - signed out, true - signed in anonymously, false - signed in w email
  const isAnonymous = isAnonymousSelector(state);
  console.log('Sign In UID: ', uid, ', is Anonymous: ', isAnonymous);

  // is 2nd necessary (e.g. to check if auth requested already) ???
  // during auth request "isAnonymous" will be true/false, but not null
  // better to replace it by something like "isAuthenticating"
  if (uid || isAnonymous !== null) {
    console.log('Has uid or isAnonymous is not null (auth request in progress)');
    return false;
  }
  return dispatch({ type: aT.SIGN_IN_ANON });
};

export const signInWithEmail = (email, password) => ({
  type: aT.SIGN_IN_EMAIL,
  payload: { email, password },
});

// Do NOT use this value to authenticate with your backend server, if
// you have one. Use User.getToken() instead
// NOTE: const user = firebase.auth().currentUser; // current user or null

export const processAuthStateChange = () => dispatch => (
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      const { isAnonymous, uid } = user;
      const {
        displayName, email, emailVerified, photoURL, providerData,
      } = user;

      dispatch({ type: aT.SIGN_IN_SUCCESS, payload: { uid, isAnonymous } });
    } else {
      // User is signed out
      dispatch({ type: aT.AUTH_STATE_CHANGE_NO_USER });
    }
  }, (error) => {
    dispatch({ type: aT.AUTH_STATE_CHANGE_ERROR, error });
  })
);
