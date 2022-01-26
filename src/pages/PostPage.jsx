import React, { useState } from 'react'
import { Divider } from 'antd';
import { connect } from 'react-redux'
import PostImage from '../components/main/postsFeed/PostImage'
import { PostDescription } from './MainPostsFeed';
import Text from 'antd/lib/typography/Text';
import { CFieldCommentSend, CFieldSubCommentSend } from '../components/main/postsFeed/FieldComment';
import { CPostUserPanel } from '../components/main/postsFeed/PostUserPanel';
import { Comment, Tooltip } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import { actionLikeComment, actionDelLikeComment, actionSubComment } from '../actions';
import { CPostTitle } from '../components/main/post/PostTitle';
import { UserAvatar } from '../components/header/UserAvatar';
import { CPreloader } from './Preloader';


const PostPageTitle = ({ data: { owner }, postId }) =>
    <CPostTitle owner={owner} postId={postId} />

const CPostPageTitle = connect(state => ({ data: state?.postsFeed?.posts || {}, postId: state?.postsFeed?.posts?._id }))(PostPageTitle)


const PostCommentAuthor = ({ owner }) => {
    return (
        <Link className='PostCommentAuthor' to={`/profile/${owner?._id}`} >
            {owner?.nick ? owner.nick : owner?.login ? owner.login : 'Null'}
        </Link>
    )
}




// const PostComment = ({ myID, subComments, data: { _id, answers, createdAt, likes = [], text, owner }, addLikeComment, removeLikeComment, findSubComment }) => {
//     const [open, setOpen] = useState(false);

//     let likeStatus
//     let likeId
//     likes.find(l => {
//         if (l?.owner?._id === myID) {
//             likeStatus = true
//             likeId = l._id
//         } else {
//             likeStatus = false
//         }
//     })

//     const changeLike = () => likeStatus ? removeLikeComment(likeId, _id) : addLikeComment(_id)

//     const actions = [
//         <span onClick={changeLike}>
//             {likeStatus ? <LikeFilled /> : <LikeOutlined />}
//             <span style={{ paddingLeft: 8, cursor: 'auto' }}>{likes.length ? likes.length : ''}</span>
//         </span>,
//         <span onClick={() => setOpen(true)}>Reply to</span>,
//     ];

//     return (
//         <Comment
//             actions={actions}
//             author={<PostCommentAuthor owner={owner} />}
//             avatar={< UserAvatar avatar={owner?.avatar} avatarSize={'35px'} />}
//             content={<p>{text}</p >}
//             datetime={
//                 < Tooltip title={moment(new Date(+createdAt)).format('DD-MM-YYYY HH:mm:ss')} >
//                     <span>
//                         {moment(new Date(+createdAt)).startOf('seconds').fromNow()}
//                     </span>
//                 </ Tooltip>
//             }
//         >
//             {subComments && subComments['subComments#' + _id]
//                 ? subComments['subComments#' + _id].map(s => < CPostSubComment key={s._id} data={s} />)
//                 : answers?.length >= 0 && <Divider plain>
//                     <Text type='secodary' onClick={() => findSubComment(_id)}>View answers</Text>
//                 </Divider>}

//             {open && <CFieldSubCommentSend id={_id} autoFocus={true} value={`@${owner?.nick || owner?.login || ''}, `} setOpen={setOpen} />}
//         </Comment>
//     )
// }
// const CPostComment = connect(state => ({
//     myID: state.auth.payload.sub.id || '',
//     subComments: state?.postsFeed?.subComments
// }), {
//     addLikeComment: actionLikeComment,
//     removeLikeComment: actionDelLikeComment,
//     findSubComment: actionSubComment,
// }
// )(PostComment)

// const CPostSubComment = connect(state => ({ comments: state?.postsFeed?.SubComments }), {
//     findSubComment: actionSubComment,
// })(PostComment)

const PostComments = ({ comments, findSubComment, parentId }) =>
    <div>
        {comments?.length && Object.keys(comments[0]).length > 1
            ? comments.map(n => {
                return (
                    <div className="comment" key={n._id}>
                        <h3>{n.owner?.login}</h3>
                        <div>{n.text}</div>
                        {n.answers && n.answers?.length
                            ? <> <PostComments comments={n?.answers} parentId={n._id} findSubComment={findSubComment} />
                            </>
                            : null}
                    </div>
                )
            })
            : <h1 onClick={() => findSubComment(parentId)} >{comments.length} мы есть</h1>}
    </div >
// n?.answers?.length
//  <div key={n._id} onClick={() => {
//                             console.log(parentId || n._id)
//                             findSubComment(parentId)
//                         }}
//                         > vvvvvv Можно кукожитьvvvvvvv</ div >

// const PostComments = ({comments}) => {
//     return (
//         <>
//             {
//                 comments.map(c => <CPostComment key={c._id} data={c} cId={c._id} />)
//             }
//         </>
//     )
// }

const CPostComments = connect(state => ({
                comments: state?.postsFeed?.posts?.comments || [],

            }), { findSubComment: actionSubComment })(PostComments)

const PostPageDescrption = ({ data: { _id, likes, text, title, createdAt, } }) =>
    <div className='PostOne__description-inner'>
        <div className='PostOne__description-top'>
            <PostDescription title={title} description={text} date={createdAt} />
            <Divider plain><Text type='secodary'>Comments</Text></Divider>
            <CPostComments />
        </div>
        <div className='PostOne__description-bottom'>
            <Divider ></Divider>
            <CPostUserPanel likes={likes} postId={_id}
                styleFontSize='1.3em' />
            <CFieldCommentSend postId={_id} setOpen={() => { }} />
        </div>
    </div>


const CPostPageDescrption = connect(state => ({ data: state?.postsFeed?.posts || {} }))(PostPageDescrption)


const PostPage = ({ data: { images } }) =>
    <div className='PostOne'>
        <CPreloader promiseName='postOne' />
        <div className='PostOne__inner'>
            <div className='PostOne__image'>
                    <PostImage images={images} />
                </div>
            <div className='PostOne__title'>
                <CPostPageTitle />
            </div>
            <div className='PostOne__description'>
                <CPostPageDescrption />
            </div>
        </div>
    </div>

export const CPostPage = connect(state => ({ data: state?.postsFeed?.posts || {} }))(PostPage)