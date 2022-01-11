import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { actionAboutMe } from '../actions';
import { authReducer } from './auth-reducer';
import { postFeedReducer } from './post-reducer';
import { profileReducer } from './profile-reducer';
import { promiseReducer } from './promise-reducer';
const store = createStore(combineReducers({
    promise: promiseReducer,
    auth: authReducer,
    postsFeed: postFeedReducer,
    profileData:profileReducer
}),
    applyMiddleware(thunk))

store.dispatch(actionAboutMe())
export default store;