import { Divider } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { actionFullMyCollectionLoad, actionRemovePostsFeedAC } from '../actions';
import { CPosts } from '../components/main/Posts';
import { Container } from './Content';
import { CPreloader } from './Preloader';

export const CollectionPage = ({ posts, onLoadPosts, postsRemove }) => {

    useEffect(() => {
        onLoadPosts()
        return () => {
            postsRemove()
        }
    }, [])
    console.log(posts);
    return (
        <Container>
            <CPreloader promiseName='onLoadMyCollections' />
            <Divider><Title level={1}>Collections</Title></Divider>
            <CPosts />
        </Container>
    )
}
export const CCollectionPage = connect(state => ({ posts: state?.postsFeed?.posts || [] }), { onLoadPosts: actionFullMyCollectionLoad, postsRemove: actionRemovePostsFeedAC })(CollectionPage)
