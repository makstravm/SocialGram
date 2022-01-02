import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './auth-reducer';
import { promiseReducer } from './promise-reducer';

export const store = createStore(combineReducers({
    promise: promiseReducer,
    auth: authReducer,
}),
    applyMiddleware(thunk))