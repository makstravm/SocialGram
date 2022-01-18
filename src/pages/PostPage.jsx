import React, { useEffect } from 'react'
import { Row, Col, Divider } from 'antd';
import { connect } from 'react-redux'
import PostImage from '../components/main/postsFeed/PostImage'
import { PostTitle, PostDescription } from './MainPostsFeed';
import { actionRemovePostsFeedAC } from '../actions';
import Text from 'antd/lib/typography/Text';
import { CFieldCommentSend } from '../components/main/postsFeed/FieldComment';
import { CPostUserPanel } from '../components/main/postsFeed/PostUserPanel';
import { createElement, useState } from 'react';
import { Comment, Tooltip, Avatar } from 'antd';
import moment from 'moment';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';

const Demo = () => {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [action, setAction] = useState(null);

    const like = () => {
        setLikes(1);
        setDislikes(0);
        setAction('liked');
    };

    const dislike = () => {
        setLikes(0);
        setDislikes(1);
        setAction('disliked');
    };

    const actions = [
        <Tooltip key="comment-basic-like" title="Like">
            <span onClick={like}>
                {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
                <span className="comment-action">{likes}</span>
            </span>
        </Tooltip>,
        <Tooltip key="comment-basic-dislike" title="Dislike">
            <span onClick={dislike}>
                {createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined)}
                <span className="comment-action">{dislikes}</span>
            </span>
        </Tooltip>,
        <span key="comment-basic-reply-to">Reply to</span>,
    ];

    return (
        <Comment
            actions={actions}
            author={<a>Han Solo</a>}
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
            content={
                <p>
                    We supply a series of design principles, practical patterns and high quality design
                    resources (Sketch and Axure), to help people create their product prototypes beautifully
                    and efficiently.
                </p>
            }
            datetime={
                <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment().fromNow()}</span>
                </Tooltip>
            }
        />
    );
};





const PostPageTitle = ({ data: { owner } }) =>
    <PostTitle owner={owner} />

const CPostPageTitle = connect(state => ({ data: state?.postsFeed?.posts || {} }))(PostPageTitle)

const PostComments = ({ }) => {

    return (
        <>  </>
    )
}

const CPostComments = connect()(PostComments)

const PostPageDescrption = ({ data: { _id, likes, text, title, createdAt, } }) =>
    <div className='PostOne__description-inner'>
        <div className='PostOne__description-top'>
            <PostDescription title={title} description={text} date={createdAt} />
            <Divider plain><Text type='secodary'></Text>Comments</Divider>
            <CPostComments />
            <Demo />
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