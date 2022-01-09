import React from 'react'
import { gql } from '../helpers'
import { actionPromise } from './redux-thunk'

export const postFeedReducer = (state = {}, { type, addPosts, newLike, postId, likeId, newResult }) => {
    const { posts } = state
    const types = {
        'ADD-POST-FEED': () => {
            console.log(posts, addPosts);
            return {
                ...state,
                posts: !!posts ? [...posts, ...addPosts] : [...addPosts]
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




export const actionMyFolowisgPosts = (skip) =>
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
            query: JSON.stringify([{},
            {
                sort: [{ _id: -1 }],
                skip: [skip +735],
                limit: [10]
            }])
        }))