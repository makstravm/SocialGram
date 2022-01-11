import { gql } from "../helpers";
import { actionPromise } from "../redux/redux-thunk";



export const actionPending = name => ({ type: 'PROMISE', status: 'PENDING', name })
export const actionResolved = (name, payload) => ({ type: 'PROMISE', status: 'RESOLVED', name, payload })
export const actionRejected = (name, error) => ({ type: 'PROMISE', status: 'REJECTED', name, error })

export const actionAuthLogin = (token, remember) => ({ type: 'AUTH_LOGIN', token, remember })
export const actionAuthLogout = () => ({ type: 'AUTH_LOGOUT' })

export const actionAddPostsFeedAC = (newResult) => ({ type: 'ADD-POST-FEED', newResult })
export const actionRemovePostsFeedAC = () => ({ type: 'REMOVE-POST-FEED' })

export const actionAddLikePostAC = (postId, newResult) => ({ type: 'ADD-POST-LIKE', postId, newResult })
export const actionRemoveLikePostAC = (postId, newResult) => ({ type: 'REMOVE-POST-LIKE', postId, newResult })
export const actionAddCommentAC = (postId, newResult) => ({ type: 'ADD-COMMENT', postId, newResult })

export const actionAddProfileDataAC = (userData, userPosts) => ({ type: 'ADD-PROFILE-DATA', userData, userPosts })

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

export const actionAboutMe = () =>
    async (dispatch, getState) => {
        const { auth: { payload: { sub: { id } } } } = getState()
        await dispatch(actionPromise('dataProfileAuth', gql(`query userOned($myID:String!){
                        UserFindOne(query: $myID){
                            _id  login nick
                            avatar { _id url }
                            following{ _id}
                  }
                }`, { myID: JSON.stringify([{ ___owner: id }]) })))
    }

//****************---Action FindUsers ---*************************//

export const actionFindUsers = (value) =>
    actionPromise('findUsersAll', gql(`query findUsersAll($query:String!) {
                                UserFind(query: $query) {
                                    _id login nick 
                                    avatar { _id url } 
                                }
    }`, {
        query: JSON.stringify([{
            $or: [{ nick: `/${value}/` }, { login: `/${value}/` }]
        },
        {
            sort: [{ login: 1 }]
        },
        ])
    }))

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

//****************---Action ProfileData ---*************************//

export const actionUserData = (_id) =>
    actionPromise('userOneData', gql(` query userOned($id:String!){
                        UserFindOne(query: $id){
                            _id  login nick
                            avatar { _id url }     
                            createdAt
                            followers {_id nick login}
                            following {_id nick login}
                }
            } `, { id: JSON.stringify([{ _id }]) }))

export const actionUserPost = (_id) =>
    actionPromise('userOneData', gql(` query userOned($id:String!){
                PostFind(query:$id){
                    _id   images{url _id}
                }
                }`, { id: JSON.stringify([{ ___owner: _id }]) }))


//****************---Action ProfileData ---*************************//


export const actionUpdateFollowers = (_id) =>
    actionPromise('upDateFollowers', gql(` query followers($id:String!){
        UserFindOne(query: $id){
                            followers {_id nick login}
        }
    }`, { id: JSON.stringify([{ _id }]) }))

export const actionSubscribe = (myID, myFollowing, userId) =>
    actionPromise('subscribe', gql(`mutation following($user:UserInput){
        UserUpsert( user:$user){
            following{_id}
        }
      }`, { user: { _id: myID, following: [...myFollowing || [], { _id: userId }] } }))

export const actionUnSubscribe = (myID, myFollowing, userId) =>
    actionPromise('unSubscribe', gql(`mutation followingUn($user:UserInput){
        UserUpsert( user:$user){
            following{_id}
        }
      }`, { user: { _id: myID, following: [...myFollowing || [], { _id: userId }] } }))



//****************---Action Upload Images ---*************************//

export const actionSetAvatar = (file) =>
    async (dispatch, getState) => {
        // const result = await dispatch(actionUploadFile(file))
        // if (result) {
        const { auth: { payload: { sub: { id } } } } = getState()
        await actionPromise('uploadPhoto', gql(`mutation avaUpsert($ava: UserInput){
                UserUpsert(user: $ava){
                    _id avatar {_id}
                }
              }`, { ava: { _id: id, avatar: { _id: file._id } } })
        )
        await dispatch(actionAboutMe())
        // }
    }
// export const actionUploadFile = (file) => {
//     let fd = new FormData()
//     fd.append('photo', file)
//     return actionPromise('upload', fetch(`${backURL}/upload`, {
//         method: "POST",
//         headers: localStorage.authToken ? { Authorization: 'Bearer ' + localStorage.authToken } : {},
//         body: fd,
//     }).then(res => res.json()))
// }