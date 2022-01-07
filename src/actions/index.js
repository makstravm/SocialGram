import { actionAuthLogin } from "../redux/auth-reducer";
import { gql } from "../helpers";



const actionPending = name => ({ type: 'PROMISE', status: 'PENDING', name })
const actionResolved = (name, payload) => ({ type: 'PROMISE', status: 'RESOLVED', name, payload })
const actionRejected = (name, error) => ({ type: 'PROMISE', status: 'REJECTED', name, error })

export const actionPromise = (name, promise) =>
    async dispatch => {
        dispatch(actionPending(name))
        try {
            let data = await promise
            dispatch(actionResolved(name, data))
            return data
        }
        catch (error) {
            dispatch(actionRejected(name, error))
        }
    }


export const actionLogin = (login, password) =>
    actionPromise('login', gql(`query login($login:String!, $password:String!){
            login(login:$login, password:$password)
        }`, { login, password }))

export const actionFullLogin = (login, password, remember) =>
    async dispatch => {
        let token = await dispatch(actionLogin(login, password))
        if (token) {
            dispatch(actionAuthLogin(token, remember))
        }
    }

const actionRegister = (login, password) =>
    actionPromise('register', gql(`mutation rega ($login:String!, $password:String!){
                                    createUser(login: $login, password: $password){
                                        _id login
                                    }
                                }`, { login, password }))

export const actionFullRegister = (login, password, remember) =>
    async dispatch => {
        await actionRegister(login, password)
        let token = await dispatch(actionLogin(login, password))
        if (token) {
            dispatch(actionAuthLogin(token, remember))
        }
    }


export const actionProfilData = (_id) =>
    actionPromise('dataProfileAuth', gql(`query userOned($id:String!){
                        UserFindOne(query: $id){
                            _id  login avatar{ _id url }
                           following{_id} 
                                } LikeFind(query:$id){
                                _id
                               post { _id}
                  }
                }`, { id: JSON.stringify([{ ___owner: _id }]) }))



export const actionAddLikePost = (_id) =>
    actionPromise('likePost', gql(`mutation LikePost($like:LikeInput){
        LikeUpsert(like:$like){
            _id
        }
    }`, { like: { post: { _id } } }))

export const actionRemoveLikePost = (_id) =>
    actionPromise('removelikePost', gql(`mutation LikeRemove($like:LikeInput){
        LikeDelete(like:$like){
            _id
        }
    }`, { like: { _id } }))



export const actionLikeUpdatePost = (id) =>
    actionPromise('likeUpdatePost', gql(`query userOned($id: String!) {
                                        PostFindOne(query: $id) {
                                            likes {_id}
                                        }
}`, { id: JSON.stringify([{ _id: id }]) }))