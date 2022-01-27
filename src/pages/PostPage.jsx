import React, { useState } from 'react'
import { Button, Divider, Dropdown, Menu } from 'antd';
import { connect } from 'react-redux'
import PostImage from '../components/main/postsFeed/PostImage'
import { PostDescription } from './MainPostsFeed';
import Text from 'antd/lib/typography/Text';
import { CFieldCommentSend, CFieldSubCommentSend, CFieldUpsertCommentSend } from '../components/main/postsFeed/FieldComment';
import { CPostUserPanel } from '../components/main/postsFeed/PostUserPanel';
import { Comment, Tooltip } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {  EditOutlined, LikeFilled, LikeOutlined, MoreOutlined } from '@ant-design/icons';
import { actionLikeComment, actionDelLikeComment, actionSubComment } from '../actions';
import { CPostTitle } from '../components/main/post/PostTitle';
import { UserAvatar } from '../components/header/UserAvatar';
import { CPreloader } from './Preloader';
import Paragraph from 'antd/lib/typography/Paragraph';


const PostPageTitle = ({ data: { owner }, postId }) =>
    <CPostTitle owner={owner} postId={postId} />

const CPostPageTitle = connect(state => ({ data: state?.postsFeed?.posts || {}, postId: state?.postsFeed?.posts?._id }))(PostPageTitle)

const PostCommentAuthor = ({ owner }) =>
    <>
        <Link className='PostCommentAuthor' to={`/profile/${owner?._id}`} >
            {owner?.nick ? owner.nick : owner?.login ? owner.login : 'Null'}
        </Link>
    </>


const EditMenu = ({ setEditComment }) =>
    <Menu>
        <Menu.Item key="1" onClick={() => setEditComment(true)}><EditOutlined /> Edit</Menu.Item>
    </Menu>

const PostCommentText = ({ myID, commentId, owner, text }) => {
    const [editComment, setEditComment] = useState(false)
    return (
        <>
            {owner?._id === myID && <Dropdown overlay={<EditMenu setEditComment={setEditComment} />} placement="bottomRight">
                <span className='PostOne__comment-edit'
                >
                    <MoreOutlined />
                </span >
            </Dropdown>}
            {!editComment
                ? <Dropdown overlay={owner?._id === myID && <EditMenu setEditComment={setEditComment} />} trigger={['contextMenu']}>
                    <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }} >
                        {text}
                    </ Paragraph>
                </Dropdown>
                : <CFieldUpsertCommentSend value={text} id={commentId} autoFocus={true} setOpen={setEditComment} rows={4} bordered={true} />}
        </>)
}

const CPostCommentText = connect(state => ({ myID: state.auth.payload.sub.id || '' }))(PostCommentText)


const PostCommentDate = ({ createdAt }) =>
    <Tooltip title={moment(new Date(+createdAt)).format('DD-MM-YYYY HH:mm:ss')} >
        {moment(new Date(+createdAt)).startOf().fromNow()}
    </ Tooltip>


const PostCommentAction = ({ myID, commentId, likes, delLikeComment, addLikeComment }) => {
    const [open, setOpen] = useState(false);
    const likeId = likes.find(l => l?.owner?._id === myID)?._id

    const changeLike = () => likeId ? delLikeComment(likeId, commentId) : addLikeComment(commentId)

    return (
        <>
            <span onClick={changeLike}>
                {likeId ? <LikeFilled /> : <LikeOutlined />}
                <span style={{ paddingLeft: 8, cursor: 'auto' }}>{likes.length ? likes.length : ''}</span>
            </span>
            <span onClick={() => setOpen(!open)}>Reply to</span>
            {open && <CFieldSubCommentSend autoFocus={true} id={commentId} setOpen={setOpen} />}
        </>
    )
}

const CPostCommentAction = connect(state => ({
    myID: state.auth.payload.sub.id || ''
}), {
    addLikeComment: actionLikeComment,
    delLikeComment: actionDelLikeComment
})(PostCommentAction)


const PostComments = ({ comments, findSubComment, parentId, }) => {
    return (<>
        {comments?.length && Object.keys(comments[0]).length > 1
            ? comments.map(c => {
                return (
                    <Comment
                        key={c._id}
                        author={<PostCommentAuthor owner={c.owner} />}
                        avatar={< UserAvatar avatar={c?.owner?.avatar} avatarSize={'35px'} />}
                        datetime={<PostCommentDate createdAt={c.createdAt} />}
                        content={<CPostCommentText text={c.text} commentId={c._id} owner={c.owner} />}
                        actions={[<CPostCommentAction likes={c.likes} commentId={c._id} />]}
                    >
                        {
                            c.answers && c.answers?.length
                                ? <>
                                    <PostComments comments={c?.answers} parentId={c._id} findSubComment={findSubComment} />
                                </>
                                : null
                        }
                    </Comment>
                )
            })
            :
            !!comments.length && <Divider plain>
                <Text type='secodary' onClick={() => findSubComment(parentId)} >
                    View answers {comments.length}
                </Text>
            </Divider>
        }
    </>)
}

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
            <Divider />
            <CPostUserPanel likes={likes} postId={_id}
                styleFontSize='1.3em' />
            <CFieldCommentSend setOpen={() => { }} /> {/* setOpen - функция заглушка для пропса компонента*/}
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