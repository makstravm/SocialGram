import React, { useState } from 'react'
import { Divider, Dropdown, Menu } from 'antd';
import { connect } from 'react-redux'
import Text from 'antd/lib/typography/Text';
import { Comment, Tooltip } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { EditOutlined, LikeFilled, LikeOutlined, MoreOutlined } from '@ant-design/icons';
import Paragraph from 'antd/lib/typography/Paragraph';
import { UserAvatar } from '../UserAvatar';
import { PostCommentDate } from './CommentsPostInTape';
import { CFieldEditCommentSend, CFieldSubComment, CFieldUpsertCommentSend } from '../CommentField';
import { actionChangeLikeCommentSagaAC, actionGetSubCommentSagaAC } from '../../actions/actonsCreators';





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
            {owner?._id === myID &&
                <Dropdown
                    overlay={<EditMenu setEditComment={setEditComment} />}
                    placement="bottomRight">
                    <span className='PostOne__comment-edit'>
                        <MoreOutlined />
                    </span>
                </Dropdown>
            }
            {!editComment
                ? <Dropdown
                    overlay={owner?._id === myID && <EditMenu setEditComment={setEditComment} />}
                    trigger={['contextMenu']}>
                    <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }} >
                        {text}
                    </ Paragraph>
                </Dropdown>
                : <CFieldEditCommentSend value={text} id={commentId} autoFocus={true} setOpen={setEditComment} rows={2} bordered={true} />}
        </>)
}

const CPostCommentText = connect(state => ({ myID: state.auth.payload.sub.id || '' }))(PostCommentText)


const PostCommentAction = ({ myID, commentId, likes, changeLikeComment }) => {
    const [open, setOpen] = useState(false);
    const likeId = likes.find(l => l?.owner?._id === myID)?._id
    return (
        <>
            <span onClick={() => changeLikeComment(commentId, likeId)}>
                {likeId ? <LikeFilled /> : <LikeOutlined />}
                {
                    !!likes.length &&
                    <span style={{ paddingLeft: 8, cursor: 'auto' }}>
                        {likes.length}
                    </span>
                }
            </span>
            <span onClick={() => setOpen(!open)}>Reply to</span>
            {open && <CFieldSubComment autoFocus={true} id={commentId} setOpen={setOpen} />}
        </>
    )
}

const CPostCommentAction = connect(state => ({
    myID: state.auth.payload.sub.id || ''
}), {
    changeLikeComment: actionChangeLikeCommentSagaAC
})(PostCommentAction)

const PostOneComments = ({ comments, findSubComment, parentId, }) =>
    <>
        {comments?.length && Object.keys(comments[0]).length > 1
            ? comments.map(c => {
                return (
                    <Comment
                        key={c._id}
                        author={<PostCommentAuthor owner={c.owner} />}
                        avatar={<UserAvatar avatar={c?.owner?.avatar} avatarSize={'35px'} />}
                        datetime={<PostCommentDate createdAt={c.createdAt} />}
                        content={<CPostCommentText text={c.text} commentId={c._id} owner={c.owner} />}
                        actions={[<CPostCommentAction likes={c.likes} commentId={c._id} />]}
                    >
                        <PostOneComments comments={c?.answers} parentId={c._id} findSubComment={findSubComment} />
                    </Comment>
                )
            })
            :
            !!comments?.length && <Divider plain>
                <Text type='secodary' onClick={() => findSubComment(parentId)} >
                    View answers {comments.length}
                </Text>
            </Divider>
        }
    </>


export const CPostOneComments = connect(state => ({
    comments: state?.postOne?.comments || [],

}), { findSubComment: actionGetSubCommentSagaAC })(PostOneComments)