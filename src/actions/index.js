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
    }
}`, { id: JSON.stringify([{ _id }]) }))

export const myFolowingPosts = () =>
    actionPromise('followingPosts', gql(`query allposts($query: String!){
        PostFind(query: $query){
            _id, text, title,
            owner{_id, nick, login, avatar {url}
            }, 
            images{url},
            comments{text},
            createdAt
        }
    }`, {
        query: JSON.stringify([{},
        {
            sort: [{ _id: -1 }],
            skip: [19],
            limit: [3],
        }
        ])
    }))