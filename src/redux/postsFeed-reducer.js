import React from 'react'
import { gql } from '../helpers'
import { actionPromise } from './redux-thunk'

export const postsFeedReducer = (state = {}, { type, postId, newResult }) => {
    const { posts } = state
    const types = {
        'RENDER-POSTS-FEED': () => {
            return {
                ...state,
                posts: !!posts ? [...posts, ...newResult] : [...newResult]
            }
        },
        'REMOVE-POSTS-FEED': () => {
            return {
                ...state,
                posts: []
            }
        },
        'ADD-POST-LIKE': () => {
            return {
                ...state,
                posts: posts.map(p => p._id === postId ? p = { ...p, likes: [...newResult] } : p),
            }
        },
        'REMOVE-POST-LIKE': () => {
            return {
                ...state,
                posts: posts.map(p => p._id === postId ? p = { ...p, likes: [...newResult] } : p),

            }
        },
        'ADD-COMMENT': () => {
            return {
                ...state,
                posts: posts.map(p => p._id === postId ? { ...p, comments: [...newResult] } : p)
            }
        }
    }
    if (type in types) {
        return types[type]()
    }
    return state
}
// export const actionRemoveComment = (_id) =>
//     actionPromise('removeComment', gql(`mutation CommentRemove($comment: CommentInput ){
//         CommentDelete(comment:$comment){
//             _id, text
//         }
//     }`, { comment: { _id } }))




export const actionMyFolowingPosts = (skip) =>
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
            query: JSON.stringify([{ ___owner: { $in: ["614c8ef4f9fc3a5e42bddb28"] } },
            {
                sort: [{ _id: -1 }],
                skip: [skip||0],
                limit: [10]
            }])
        }))