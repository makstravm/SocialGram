import React from 'react'
import { actionPromise } from '../actions'
import { gql } from '../helpers'

export const postFeedReducer = (state = {}, { type, addPosts, myLikes, postId, likeId }) => {
    const { posts } = state
    const types = {
        'ADD-POST-FEED': () => {
            return {
                ...state,
                posts: !!state.addPosts ? [...state.addPosts, ...addPosts] : [...addPosts],
                myLikes: [...myLikes]
            }
        },
        'ADD-POST-LIKE': () => {
            return {
                ...state,
                posts: posts.map(p => p._id === postId ? p = { ...p, likes: [...p.likes, likeId] } : p),
                myLikes: [...myLikes]
            }
        },
        'REMOVE-POST-LIKE': () => {
            return {
                ...state,
                posts: posts.map(p => p._id === postId ?
                    p = {
                        ...p, likes: [...p.likes].filter(pl => pl._id !== likeId && pl)
                    } : p),                myLikes: [...myLikes]
            }
        },
    }
    if (type in types) {
        return types[type]()
    }
    return state
}

const actionAddPostsFeedAC = (addPosts, myLikes) => ({ type: 'ADD-POST-FEED', addPosts, myLikes })
const actionAddLikePostAC = (postId, myLikes, likeId) => ({ type: 'ADD-POST-LIKE', postId, myLikes, likeId })
const actionRemoveLikePostAC = (myLikes, likeId, postId) => ({ type: 'REMOVE-POST-LIKE', myLikes, likeId, postId })


export const actionRemoveLikePost = (_id) =>
    actionPromise('removelikePost', gql(`mutation LikeRemove($like:LikeInput){
        LikeDelete(like:$like){
            _id
        }
    }`, { like: { _id } }))

export const actionFullRemoveLikePost = (_id, postId) =>
    async (dispatch, getState) => {
        const { auth: { payload: { sub: { id } } } } = getState()
        await actionRemoveLikePost(_id)
        let myLikes = await dispatch(actionMyLikes(id))
        if (myLikes) {
            dispatch(actionRemoveLikePostAC(myLikes, _id, postId))
        }
    }

export const actionAddLikePost = (_id) =>
    actionPromise('likePost', gql(`mutation LikePost($like:LikeInput){
        LikeUpsert(like:$like){
            _id
        }
    }`, { like: { post: { _id } } }))

export const actionFullAddLikePost = (postId) =>
    async (dispatch, getState) => {
        const { auth: { payload: { sub: { id } } } } = getState()
        let likeId = await dispatch(actionAddLikePost(postId))
        let myLikes = await dispatch(actionMyLikes(id))
        if (myLikes && likeId) {
            dispatch(actionAddLikePostAC(postId, myLikes, likeId))
        }
    }
    
export const actionAddPostsFeed = (skip) =>
    async (dispatch, getState) => {
        const { auth: { payload: { sub: { id } } } } = getState()
        let posts = await dispatch(actionMyFolowisgPosts(skip))
        let myLikes = await dispatch(actionMyLikes(id))
        if (posts && myLikes) {
            dispatch(actionAddPostsFeedAC(posts, myLikes))
        }
    }
export const actionMyLikes = (id) =>
    actionPromise('myLikes', gql(`query myLikes($qq:String!){
                            LikeFind(query:$qq){
                                _id
                               post { _id}
                            }
}`, { qq: JSON.stringify([{ ___owner: id }]) }))

export const actionMyFolowisgPosts = (skip = 19) =>
    actionPromise('followingPosts',
        gql(`query allposts($query: String!){
        PostFind(query:$query){
            _id, text, title
            owner{_id, nick, login, avatar {url}}
            likes { _id }   
            images{url _id}
            comments{text}
            createdAt
        }
    }`, {
            query: JSON.stringify([{},
            {
                sort: [{ _id: -1 }],
                skip: [+skip],
                limit: [3],
            }])
        }))