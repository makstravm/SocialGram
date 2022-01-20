import React, { useEffect, useState } from 'react'
import { Row, Col, Divider } from 'antd';
import { connect } from 'react-redux'
import PostImage from '../components/main/postsFeed/PostImage'
import { PostTitle, PostDescription } from './MainPostsFeed';
import Text from 'antd/lib/typography/Text';
import { CFieldCommentSend } from '../components/main/postsFeed/FieldComment';
import { CPostUserPanel } from '../components/main/postsFeed/PostUserPanel';
import { Comment, Tooltip, Avatar } from 'antd';
import moment from 'moment';
import { UserAvatar } from './Header';
import { Link } from 'react-router-dom';
import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import { actionLikeComment, actionAddLikeCommentAC, actionFindLikeComment, actionDelLikeComment } from '../actions';


const PostPageTitle = ({ data: { owner } }) =>
    <PostTitle owner={owner} />

const CPostPageTitle = connect(state => ({ data: state?.postsFeed?.posts || {} }))(PostPageTitle)
// 

const PostCommentAuthor = ({ owner }) => {
    return (
        <Link className='PostCommentAuthor' to={`/profile/${owner?._id}`} >
            {owner?.nick ? owner.nick : owner?.login ? owner.login : 'Null'}
        </Link>
    )
}


const PostComment = ({ myID, data: { _id, answerTo, answers, createdAt, likes = [], text, owner }, addLikeComment, removeLikeComment, children }) => {
    const [open, setOpen] = useState(false);

    let likeStatus
    let likeId
    likes.find(l => {
        if (l?.owner?._id === myID) {
            likeStatus = true
            likeId = l._id
        } else {
            likeStatus = false
        }
    })

    const changeLike = () => likeStatus ? removeLikeComment(likeId, _id) : addLikeComment(_id)

    const actions = [
        <span onClick={changeLike}>
            {likeStatus ? <LikeFilled /> : <LikeOutlined />}
            <span style={{ paddingLeft: 8, cursor: 'auto' }}>{likes.length ? likes.length : ''}</span>
        </span>,
        <span onClick={() => setOpen(true)}>Reply to</span>,
        open && <CFieldCommentSend onFocus />
    ];
    return (
        <Comment
            actions={actions}
            author={<PostCommentAuthor owner={owner} />}
            avatar={< UserAvatar avatar={owner.avatar} avatarSize={'35px'} />}
            content={<p>{text}</p >}
            datetime={
                < Tooltip title={moment(new Date(+createdAt)).format('DD-MM-YYYY HH:mm:ss')} >
                    <span>
                        {moment(new Date(+createdAt)).startOf('seconds').fromNow()}
                    </span>
                </ Tooltip>
            }
        >
            {children}
        </Comment>
    )
}
const CPostComment = connect(state => ({
    myID: state.auth.payload.sub.id || ''
}), {
    addLikeComment: actionLikeComment,
    removeLikeComment: actionDelLikeComment,
}
)(PostComment)

const PostComments = ({ comments }) => {
    return (
        <>
            {
                comments.map(c => <CPostComment key={c._id} data={c}></CPostComment>)
            }
        </>
    )
}

const CPostComments = connect(state => ({
    comments: state?.postsFeed?.posts?.comments || []
}))(PostComments)

const PostPageDescrption = ({ data: { _id, likes, text, title, createdAt, } }) =>
    <div className='PostOne__description-inner'>
        <div className='PostOne__description-top'>
            <PostDescription title={title} description={text} date={createdAt} />
            <Divider plain><Text type='secodary'></Text>Comments</Divider>
            <CPostComments />
        </div>
        <div className='PostOne__description-bottom'>
            <Divider ></Divider>
            <CPostUserPanel likes={likes} postId={_id}
                styleFontSize='1.3em' />
            <CFieldCommentSend postId={_id} />
        </div>
    </div>


const CPostPageDescrption = connect(state => ({ data: state?.postsFeed?.posts || {} }))(PostPageDescrption)


const PostPage = ({ data: { images } }) =>
    <div className='PostOne'>
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
// xs={{ span: 24 }} sm={{ span: 20 }} md={{ span: 16 }} lg={{ span: 16 }}A