import React from 'react'
import { Divider } from 'antd';
import { connect } from 'react-redux'
import Text from 'antd/lib/typography/Text';
import PostImageCover from '../components/post/PostImageCover';
import { CEditMyPostBtn, PostHeader } from '../components/post/PostHeader';
import { CPostDescription } from '../components/post/PostDescription';
import { CPostOneUserPanel } from '../components/post/PostUserPanel';
import { CCommentFieldPostOne } from '../components/CommentField';
import { CPostOneComments } from '../components/post/PostOneComment';
import { CEditPostPage } from './EditPostPage';
import { CPreloader } from '../components/Preloader';


const PostOnePageDescrption = ({ data: { _id, likes } }) =>
    <div className='PostOne__description-inner'>
        <div className='PostOne__description-top'>
            <CPostDescription />
            <Divider plain>
                <Text type='secodary'>Comments</Text>
            </Divider>
            <div className='PostOne__comments'>
                <CPostOneComments />
            </div>
        </div>
        <div className='PostOne__description-bottom'>
            <Divider />
            <CPostOneUserPanel likes={likes} postId={_id}
                styleFontSize='1.3em' />
            <CCommentFieldPostOne id={_id} setOpen={() => { }} />
        </div>
    </div>


const CPostOnePageDescrption = connect(state => ({ data: state?.postOne || {} }))(PostOnePageDescrption)


const PostOnePage = ({ data: { _id, images, owner } }) =>
    < div className='PostOne' >
        <CPreloader promiseName='postOne' />
        <div className='PostOne__inner' >
            <div className='PostOne__image'>
                <PostImageCover images={images} />
            </div>
            <div className='PostOne__title'>
                <PostHeader owner={owner}>
                    <CEditMyPostBtn owner={owner} postId={_id} />
                </PostHeader>
            </div>
            <div className='PostOne__description'>
                <CPostOnePageDescrption />
            </div>
        </div >
    </div >


export const CPostOnePage = connect(state => ({ data: state?.postOne || {} }))(PostOnePage)