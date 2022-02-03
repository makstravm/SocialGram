import { Divider } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { actionClearPostsTapeAC, actionGetPostsMyCollectionSagaAC } from '../actions/actonsCreators';
import { Container } from '../components/Container';
import { CGalleryMediaPostsUser } from '../components/GalleryMediaPostsUser';
import { CPreloader } from '../components/Preloader';


export const CollectionPage = ({ onLoadPosts, clearPostsTape }) => {

    useEffect(() => {
        onLoadPosts()
        return () => {
            clearPostsTape()
        }
    }, [])

    return (
        <Container>
            <CPreloader promiseName='onLoadMyCollections' />
            <Divider><Title level={1}>Collections</Title></Divider>
            <CGalleryMediaPostsUser />
        </Container>
    )
}
export const CCollectionPage = connect(null, {
    onLoadPosts: actionGetPostsMyCollectionSagaAC,
    clearPostsTape: actionClearPostsTapeAC
})(CollectionPage)
