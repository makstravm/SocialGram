import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './auth-reducer';
import { postFeedReducer } from './post-reducer';
import { profileReducer } from './profile-reducer';
import { promiseReducer } from './promise-reducer';

export const store = createStore(combineReducers({
    promise: promiseReducer,
    auth: authReducer,
    postsFeed: postFeedReducer,
    profileData:profileReducer
}),
    applyMiddleware(thunk))