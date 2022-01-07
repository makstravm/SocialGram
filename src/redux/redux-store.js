import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './auth-reducer';
import { postFeedReducer } from './postFeed-reducer';
import { promiseReducer } from './promise-reducer';

export const store = createStore(combineReducers({
    promise: promiseReducer,
    auth: authReducer,
    postsFeed: postFeedReducer
}),
    applyMiddleware(thunk))