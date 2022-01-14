import { gql } from "../helpers";
import { actionPromise } from "../redux/redux-thunk";



export const actionPending = name => ({ type: 'PROMISE', status: 'PENDING', name })
export const actionResolved = (name, payload) => ({ type: 'PROMISE', status: 'RESOLVED', name, payload })
export const actionRejected = (name, error) => ({ type: 'PROMISE', status: 'REJECTED', name, error })

export const actionAuthLogin = (token, remember) => ({ type: 'AUTH_LOGIN', token, remember })
export const actionAuthLogout = () => ({ type: 'AUTH_LOGOUT' })

export const actionAboutMeAC = (data) => ({ type: 'ABOUTME-DATA-ADD', data })
export const actionUpdateMyAvatart = (data) => ({ type: 'ABOUTME-UPDATE-AVATAR', data })
export const actionAddPostsFeedAC = (count, newResult, userData) => ({ type: 'ADD-POSTS-FEED', newResult, userData, count })
export const actionRemovePostsFeedAC = () => ({ type: 'REMOVE-POSTS-FEED' })

export const actionAddLikePostAC = (postId, newResult) => ({ type: 'ADD-POST-LIKE', postId, newResult })
export const actionRemoveLikePostAC = (postId, newResult) => ({ type: 'REMOVE-POST-LIKE', postId, newResult })
export const actionAddCommentAC = (postId, newResult) => ({ type: 'ADD-COMMENT', postId, newResult })

export const actionUpdateFollowersAC = (newResult) => ({ type: 'UPDATE-FOLLOWERS', newResult })

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

export const actionAboutMe = (id) =>
    actionPromise('aboutMe', gql(`query userOned($myID:String!){
                        UserFindOne(query: $myID){
                            _id  login nick
                            avatar { _id url }
                            following{ _id}
                        }
                }`, { myID: JSON.stringify([{ ___owner: id }]) }))




export const actionMyFolowingPosts = (skip, myFollowing) =>
    actionPromise('followingPosts',
        gql(`query allposts($query: String!){
        PostFind(query:$query){
            _id, text, title
            owner{_id, nick, login, avatar {url}}
            likes { _id owner {_id}}   
            images{url _id}
            comments{_id text owner{_id nick login} likes{_id}}
            createdAt
        }
    }`, {
            query: JSON.stringify([{ ___owner: { $in: myFollowing } },
            {
                sort: [{ _id: -1 }],
                skip: [skip || 0],
                limit: [10]
            }])
        }))


// 


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

export const actionProfilePageData = (_id) =>
    actionPromise('userOneData', gql(` query userOned($id:String!){
                        UserFindOne(query: $id){
                            _id  login nick
                            avatar { _id url }     
                            createdAt
                            followers {_id nick login}
                            following {_id nick login}
                }
            } `, { id: JSON.stringify([{ _id }]) }))

export const actionProfilePagePost = (_id, skip) =>
    actionPromise('userOneDataPosts', gql(` query userOned($id:String!){
                PostFind(query:$id){
                    _id   images{url _id}
                }
                }`, {
        id: JSON.stringify([{
            ___owner: _id
        },
        {
            sort: [{ _id: -1 }],
            skip: [skip || 0],
            limit: [10]
        }])
    }))

export const actionProfilePostCount = (_id) =>
    actionPromise('userPostsCount', gql(` query userPostsCount($id:String!){
                PostCount(query:$id)
                }`, { id: JSON.stringify([{ ___owner: { $in: _id } }]) }))

//****************---Action ProfileData ---*************************//
//  
export const actionUpdateMyFollowing = (_id) =>
    actionPromise('upDateFollowing', gql(` query followers($id:String!){
        UserFindOne(query: $id){
                            following {_id nick login}
        }
    }`, { id: JSON.stringify([{ _id }]) }))


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

export const actionUnSubscribe = (myID, myFollowing) =>
    actionPromise('unSubscribe', gql(`mutation followingUn($user:UserInput){
        UserUpsert( user:$user){
            following{_id}
        }
      }`, { user: { _id: myID, following: [...myFollowing] } }))



//****************---Action Upload Images ---*************************//


export const actionSetAvatar = (file, id) =>
    actionPromise('uploadPhoto', gql(`mutation avaUpsert($ava: UserInput){
                UserUpsert(user: $ava){
                    _id avatar {_id}
                }
              }`, { ava: { _id: id, avatar: { _id: file._id } } })
    )
export const actionGetAvatar = (id) =>
    actionPromise('uploadPhoto', gql(`query userOned($myID: String!){
        UserFindOne(query: $myID) {
                            avatar { _id url }
        }
    }`, { myID: JSON.stringify([{ ___owner: id }]) }))
