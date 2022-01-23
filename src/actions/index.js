import { gql } from "../helpers";


//*************** ACTIONS PROMISE ******************//


export const actionPending = name => ({ type: 'PROMISE', status: 'PENDING', name })
export const actionResolved = (name, payload) => ({ type: 'PROMISE', status: 'RESOLVED', name, payload })
export const actionRejected = (name, error) => ({ type: 'PROMISE', status: 'REJECTED', name, error })
export const actionClearPromise = (name) => ({ type: 'CLEAR-PROMISE', name })
export const actionPromise = (name, promise) => ({ type: 'PROMISE_START', name, promise })


//*************** ACTIONS AUTHORIZATION ******************//


export const actionAuthLogin = (token, remember) => ({ type: 'AUTH-LOGIN', token, remember })
export const actionAuthLogout = () => ({ type: 'AUTH-LOGOUT' })

export const actionLogIn = (login, password) =>
    actionPromise('login', gql(`query login($login:String!, $password:String!){
                login(login:$login, password:$password)
            }`, { login, password }))

export const actionFullLogIn = (login, password, remember) => ({ type: 'FULL_LOGIN', login, password, remember })
export const actionFullRegister = (login, password, remember) => ({ type: 'FULL_REGISTER', login, password, remember })

export const actionRegister = (login, password) =>
    actionPromise('register', gql(`mutation rega ($login:String!, $password:String!){
                                    createUser(login: $login, password: $password){
                                        _id login
                                    }
                                }`, { login, password }))

//*************** Action ABOUT ME ******************//


export const actionAboutMeAC = (data) => ({ type: 'ABOUTME-DATA-ADD', data })

export const actionFullAboutMe = () => ({ type: 'ABOUT_ME' })

export const actionAboutMe = (id) =>
actionPromise('aboutMe', gql(`query userOned($myID:String!){
                        UserFindOne(query: $myID){
                            _id  login nick
                            avatar { _id url }
                            following{ _id}
                        }
                }`, { myID: JSON.stringify([{ _id: id }]) }))


//*************** Action Posts Feed ******************//

export const actionGetPostAC = (postData) => ({ type: 'GET-POST', newResult: postData })

export const actionAddPostsFeedAC = (postsData, count) => ({ type: 'ADD-POSTS-FEED', newResult: postsData, count })
export const actionRemovePostsFeedAC = () => ({ type: 'REMOVE-POSTS-FEED' })

export const actionPostsFeed = () => ({ type: 'POSTS_FEED' })

export const actionPostsMyFollowing = (skip, myFollowing) =>
    actionPromise('followingPosts',
        gql(`query allposts($query: String!){
            PostFind(query:$query){
                _id, text, title
                owner{_id, nick, login, avatar {url}}
                likes { _id owner {_id}}   
                images{url _id}
                comments{_id}
                createdAt
        }
    }`, {
            query: JSON.stringify([{
                ___owner: { $in: myFollowing }
            },
            {
                sort: [{ _id: -1 }],
                skip: [skip || 0],
                limit: [10]
            }])
        }))

export const actionPostsCount = (_id) =>
    actionPromise('userPostsCount', gql(` query userPostsCount($id:String!){
                PostCount(query:$id)
                }`, { id: JSON.stringify([{ ___owner: { $in: _id } }]) }))


//*************** Action Posts Profile ******************//


export const actionProfileDataAC = (postsData, count, userData) => ({ type: 'ADD-PROFILE-DATA', newResult: postsData, count, userData })

export const actionProfilePageData = (id) => ({ type: 'DATA_PROFILE', id })

export const actionFindPostOne = (_id) => ({ type: 'FIND_POST_ONE', _id })

export const actionProfileData = (_id) =>
    actionPromise('userOneData', gql(` query userOned($id:String!){
                        UserFindOne(query: $id){
                            _id  login nick
                            avatar { _id url }     
                            createdAt
                            followers {_id }
                            following {_id }
                }
            } `, { id: JSON.stringify([{ _id }]) }))

export const actionProfilePagePost = (_id, skip) => actionPromise('userOneDataPosts', gql(` query userOned($id:String!){
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
        limit: [24]
    }])
}))


export const actionPostOneEdit = (_id) =>
    actionPromise('postOneEdit', gql(`query post($id:String!) {
                    PostFindOne(query:$id) {
                        _id title text 
                        images { _id url}
                  
                        }
                    }`, { id: JSON.stringify([{ _id }]) }))

//****************---All FIND POSTS---*************************//

export const actionAllPosts = () => ({ type: 'ALL_POSTS' })

export const actionGetAllPosts = (skip) =>
    actionPromise('allPosts', gql(` query allPosts($id:String!){
                PostFind(query:$id){
                    _id   images{url _id}
                }
            }`, {
        id: JSON.stringify([{}, {
            sort: [{ _id: -1 }],
            skip: [skip || 0],
            limit: [36]
        }])
    }))

export const actionAllPostsCount = () =>
    actionPromise('userPostsCount', gql(` query userPostsCount($id:String!){
                PostCount(query:$id)
                }`, { id: JSON.stringify([{}]) }))
//    ,

//****************---Action FindUsers ---*************************//


export const actionSearchUsers = (value) => ({ type: 'SEARCH_USERS', value })

export const actionLoadSearchUsers = (value) =>
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


//****************---Action Like Post ---*************************//


export const actionAddLikePostAC = (findId, newResult) => ({ type: 'ADD-POST-LIKE', findId, newResult })
export const actionRemoveLikePostAC = (findId, newResult) => ({ type: 'REMOVE-POST-LIKE', findId, newResult })


export const actionLikePost = (postId) => ({ type: 'LIKE_POST', postId })

export const actionAddLikePost = (_id) =>
    actionPromise('likePost', gql(`mutation LikePost($like:LikeInput){
        LikeUpsert(like:$like){
            _id
        }
    }`, { like: { post: { _id } } }))


export const actionDelLikePost = (likeId, postId) => ({ type: 'DEL_LIKE_POST', likeId, postId })

export const actionRemoveLikePost = (_id) =>
    actionPromise('removelikePost', gql(`mutation LikeRemove($like:LikeInput){
            LikeDelete(like:$like){
                _id
            }
        }`, { like: { _id } }))


export const actionMyLikePost = (findId) =>
    actionPromise('myLikes', gql(`query likeFindPost ($id:String!){
        PostFindOne(query:$id){
        likes { _id owner {_id}}
        }
    }`, { id: JSON.stringify([{ _id: findId }]) }))


//****************---Action Like Comment ---*************************//

export const actionAddLikeCommentAC = (findId, newResult) => ({ type: 'ADD-LIKE-COMMENT', findId, newResult })
export const actionRemoveLikeCommentAC = (findId, newResult) => ({ type: 'REMOVE-LIKE-COMMENT', findId, newResult })

export const actionLikeComment = (commentId) => ({ type: 'LIKE_COMMENT', commentId })
export const actionDelLikeComment = (likeId, commentId) => ({ type: 'DEL_LIKE_COMMENT', likeId, commentId })

export const actionAddLikeComment = (_id) =>
    actionPromise('likePost', gql(`mutation LikePost($like:LikeInput){
        LikeUpsert(like:$like){
            _id
        }
    }`, { like: { comment: { _id } } }))

export const actionRemoveLikeComment = (_id) =>
    actionPromise('removelikePost', gql(`mutation LikeRemove($like:LikeInput){
            LikeDelete(like:$like){_id}
        }`, { like: { _id } }))

export const actionFindLikeComment = (findId) =>
    actionPromise('findLikeComment', gql(`query findLikeComment ($id:String!){
        CommentFindOne(query:$id){
        likes { _id owner {_id}}
        }
    }`, { id: JSON.stringify([{ _id: findId }]) }))


//****************---Action Subscribe ---*************************//


export const actionUpdateMyFollowingAC = (data) => ({ type: 'UPDATE-MY-FOLLOWING', data })
export const actionUpdateFollowersAC = (newResult) => ({ type: 'UPDATE-FOLLOWERS', newResult })

export const actionSubscribe = (userId) => ({ type: 'SUBSCRIBE', userId })
export const actionUnSubscribe = (userId) => ({ type: 'UN_SUBSCRIBE', userId })

export const actionLoadSubscribe = (myID, myFollowing, userId) =>
    actionPromise('subscribe', gql(`mutation following($user:UserInput){
        UserUpsert( user:$user){
            following{_id}
        }
      }`, { user: { _id: myID, following: [...myFollowing || [], { _id: userId }] } }))
export const actionloadUnSubscribe = (myID, myFollowing) =>
    actionPromise('unSubscribe', gql(`mutation followingUn($user:UserInput){
        UserUpsert( user:$user){
            following{_id}
        }
      }`, { user: { _id: myID, following: [...myFollowing] } }))

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


//****************---Action Comments ---*************************//


export const actionAddCommentAC = (newResult) => ({ type: 'ADD-COMMENT', newResult })
export const actionUpdateSubCommentAC = (findId, newResult) => ({ type: 'UPDATE-SUBCOMMENT', findId, newResult })

export const actionFullAddComment = (postId, text) => ({ type: 'COMMENT_POST', postId, text })

export const actionAddSubComment = (commentId, text) => ({ type: 'ADD_SUB_COMMENT', commentId, text })
export const actionSubComment = (commentId) => ({ type: 'FIND_SUBCOMMENT', commentId })

export const actionAddComment = (postId, text) =>
    actionPromise('addcomment', gql(`mutation addcomment($comment: CommentInput ){
        CommentUpsert(comment:$comment){
            _id text
        }
    }`, { comment: { post: { _id: postId }, text } }))

export const actionFindComment = (findId) =>
    actionPromise('findCommentPost', gql(`query commentFindPost ($id:String!){
        PostFindOne(query:$id){
            comments {
                _id text owner{
                    _id nick login
                     avatar{_id url}
                    } 
                    likes{_id}
                }
        }
    }`, { id: JSON.stringify([{ _id: findId }]) }))

export const actionFindSubComment = (findId) =>
    actionPromise('subComments#' + findId, gql(`query commentFindOne ($id:String!){
        CommentFindOne(query:$id){
             answers{
                _id text createdAt
                owner{ _id nick login avatar { _id url }} 
                likes { _id }
                answerTo {_id text 
                }
                answers{ _id }
            }
        } 
    }`, { id: JSON.stringify([{ _id: findId }]) }))

export const actionSubAddComment = (commentId, text, _id) =>
    actionPromise('addSubcomment', gql(`mutation addSubcomment($comment: CommentInput ){
        CommentUpsert(comment:$comment){
            _id text
        }
    }`, { comment: { answerTo: { _id: commentId }, text } }))


//****************---Action Udate Avatar ---*************************//

export const actionUpdateAvatar = (file) => ({ type: 'UPDATE_AVATAR', file })
export const actionUpdateMyAvatart = (data) => ({ type: 'ABOUTME-UPDATE-AVATAR', data })


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


//****************--- Find FOllowing/Follovwrs---*************************//

export const actionFindFollowing = (_id) => ({ type: 'FIND_FOLLOWING', _id })
export const actionFindFollowers = (_id) => ({ type: 'FIND_FOLLOWERS', _id })
export const actionFindLiked = (_id) => ({ type: 'FIND_LIKED', _id })

export const actionGetFindFollowing = (_id) =>
    actionPromise('findFollow', gql(` query findFollowing($id:String!){
                        UserFindOne(query: $id){
                            following {
                                _id nick login
                                avatar { _id url }
                            }
                }
            } `, { id: JSON.stringify([{ _id }]) }))

export const actionGetFindFollowers = (_id) =>
    actionPromise('findFollow', gql(` query findFollowers($id:String!){
                        UserFindOne(query: $id){
                            followers {
                                _id  nick login
                                avatar { _id url }
                            }
                }
            } `, { id: JSON.stringify([{ _id }]) }))

export const actionGetFindLiked = (_id) =>
    actionPromise('findLiked', gql(` query LikeFindPost($id:String!) {
                                        LikeFind(query:$id){
                                          owner { _id nick login
                                                avatar{_id url}
                                    }
                }
            } `, { id: JSON.stringify([{ "post._id": _id }]) }))


//****************---Create Post ---*************************/

export const actionFullSentPost = (images, title, text) => ({ type: 'CREATE_POST', images, text, title })

export const actionSentPost = (upSertPostObj) =>
    actionPromise('sentPost', gql(`mutation sentPost($post: PostInput){
              PostUpsert(post: $post){
                    _id images{_id url}
                }
            }`, { post: upSertPostObj }))