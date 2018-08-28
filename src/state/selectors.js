import { createSelector } from 'reselect';

// Beware of problem with selector which returns a new object everytime,         !!!
// and that will violate the shallow comparison in "connect"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ AUTH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const getUserId = state => state.auth.userId;
export const isAnonymousSelector = state => state.auth.isAnonymous;
