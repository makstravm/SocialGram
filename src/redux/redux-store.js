import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { actionAboutMe } from '../actions';
import { authReducer } from './auth-reducer';
import { postsFeedReducer } from './postsFeed-reducer';
import { profileReducer } from './profile-reducer';
import { promiseReducer } from './promise-reducer';



const store = createStore(combineReducers({
    promise: promiseReducer,
    auth: authReducer,
    postsFeed: postsFeedReducer,
    profileData:profileReducer
}),
    applyMiddleware(thunk))

store.dispatch(actionAboutMe())
export default store;