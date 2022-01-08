import { gql } from "../helpers";
import { actionPromise } from "../redux/redux-thunk";



export const actionPending = name => ({ type: 'PROMISE', status: 'PENDING', name })
export const actionResolved = (name, payload) => ({ type: 'PROMISE', status: 'RESOLVED', name, payload })
export const actionRejected = (name, error) => ({ type: 'PROMISE', status: 'REJECTED', name, error })


export const actionAddPostsFeedAC = (addPosts, myLikes) => ({ type: 'ADD-POST-FEED', addPosts, myLikes })
export const actionAddLikePostAC = (postId, newResult) => ({ type: 'ADD-POST-LIKE', postId, newResult })
export const actionRemoveLikePostAC = (postId, newResult) => ({ type: 'REMOVE-POST-LIKE', postId, newResult })
export const actionAddCommentAC = (postId, newResult) => ({ type: 'ADD-COMMENT', postId, newResult })

//****************---Action Authirization ---*************************//

export const actionLogin = (login, password) =>
    actionPromise('login', gql(`query login($login:String!, $password:String!){
            login(login:$login, password:$password)
        }`, { login, password }))

export const actionRegister = (login, password) =>
    actionPromise('register', gql(`mutation rega ($login:String!, $password:String!){
                                    createUser(login: $login, password: $password){
                                        _id login
                                    }
                                }`, { login, password }))


export const actionProfilData = (_id) =>
    actionPromise('dataProfileAuth', gql(`query userOned($id:String!){
                        UserFindOne(query: $id){
                            _id  login nick
                            avatar { _id url }
                            following {_id} 
                  }
                }`, { id: JSON.stringify([{ ___owner: _id }]) }))

//****************---Action Like ---*************************//

export const actionRemoveLikePost = (_id) =>
    actionPromise('removelikePost', gql(`mutation LikeRemove($like:LikeInput){
        LikeDelete(like:$like){
            _id
        }
    }`, { like: { _id } }))

export const actionAddLikePost = (_id) =>
    actionPromise('likePost', gql(`mutation LikePost($like:LikeInput){
        LikeUpsert(like:$like){
            _id
        }
    }`, { like: { post: { _id } } }))

export const actionMyLikePost = (postId) =>
    actionPromise('myLikes', gql(`query likeFindPost ($id:String!){
        PostFindOne(query:$id){
        likes { _id owner {_id}} 
        }
    }`, { id: JSON.stringify([{ _id: postId }]) }))


//****************---Action Comment ---*************************//

export const actionAddComment = (postId, text) =>
    actionPromise('addcomment', gql(`mutation addcomment($comment: CommentInput ){
        CommentUpsert(comment:$comment){
            _id text
        }
    }`, { comment: { post: { _id: postId }, text } }))

export const actionFindComment = (postId) =>
    actionPromise('findCommentPost', gql(`query commentFindPost ($id:String!){
        PostFindOne(query:$id){
         comments{_id text owner{_id nick login} likes{_id}}
        }
    }`, { id: JSON.stringify([{ _id: postId }]) }))

