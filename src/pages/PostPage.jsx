import React from 'react'
import { Divider } from 'antd';
import { connect } from 'react-redux'
import PostImage from '../components/main/postsFeed/PostImage'
import { PostDescription } from './MainPostsFeed';
import Text from 'antd/lib/typography/Text';
import { CFieldCommentSend } from '../components/main/postsFeed/FieldComment';
import { CPostUserPanel } from '../components/main/postsFeed/PostUserPanel';
import { CPostTitle } from '../components/main/post/PostTitle';
import { CPreloader } from './Preloader';
import { CPostComments } from '../components/main/post/PostComment';



const PostPageTitle = ({ data: { owner }, postId }) =>
    <CPostTitle owner={owner} postId={postId} />

const CPostPageTitle = connect(state => ({ data: state?.postsFeed?.posts || {}, postId: state?.postsFeed?.posts?._id }))(PostPageTitle)

const PostPageDescrption = ({ data: { _id, likes, text, title, createdAt, } }) =>
    <div className='PostOne__description-inner'>
        <div className='PostOne__description-top'>
            <PostDescription title={title} description={text} date={createdAt} />
            <Divider plain><Text type='secodary'>Comments</Text></Divider>
            <div className='PostOne__comments'>
                <CPostComments />
            </div>
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