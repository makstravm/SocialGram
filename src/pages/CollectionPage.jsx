import { Divider } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { actionFullMyCollectionLoad, actionRemovePostAC } from '../actions';
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

    return (
        <Container>
            <CPreloader promiseName='onLoadMyCollections' />
            <Divider><Title level={1}>Collections</Title></Divider>
            <CPosts />
        </Container>
    )
}
export const CCollectionPage = connect(state => ({ posts: state?.post?.posts || [] }), { onLoadPosts: actionFullMyCollectionLoad, postsRemove: actionRemovePostAC })(CollectionPage)
