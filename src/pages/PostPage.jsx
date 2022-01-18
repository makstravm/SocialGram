import React, { useEffect } from 'react'
import { Row, Col } from 'antd';
import { connect } from 'react-redux'
import PostImage from '../components/main/postsFeed/PostImage'
import { PostTitle } from './MainPostsFeed';
import { actionRemovePostsFeedAC } from '../actions';

const PostPageAside = ({ data: { owner } }) => {

    return (
        <PostTitle owner={owner} />
    )
}

const CPostPageAside = connect(state => ({ data: state?.postsFeed?.posts || {} }))(PostPageAside)

const PostPage = ({ data: { images } }) => {
    useEffect(() => {
        return () => {
            actionRemovePostsFeedAC()
        }
    }, [])

    return (
        <div className='PostOne'>
            <div className="PostOne__inner">
                <div className='PostOne__image'>
                    <PostImage images={images} />
                </div>
                <div className='PostOne__title'>
                    <CPostPageAside />
                </div>
                <div className="PostOne__comments">fjlsdglks</div>
            </div>

        </div>
    )

}

export const CPostPage = connect(state => ({ data: state?.postsFeed?.posts || {} }))(PostPage)
// xs={{ span: 24 }} sm={{ span: 20 }} md={{ span: 16 }} lg={{ span: 16 }}