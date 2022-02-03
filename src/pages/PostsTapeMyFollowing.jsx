import { Card } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Title from 'antd/lib/typography/Title'
import { Container } from '../components/Container'
import { actionClearPostsTapeAC, actionGetPostsTapeSagaAC } from '../actions/actonsCreators'
import { PostHeader } from '../components/post/PostHeader'
import PostImageCover from '../components/post/PostImageCover'
import { CPostTapeUserPanel } from '../components/post/PostUserPanel'
import { PostDescription } from '../components/post/PostDescription'
import { CommentsPostInTape } from '../components/post/CommentsPostInTape'
import { CPreloader } from '../components/Preloader'


const Post = ({ postData: { _id, text, title, owner, images, createdAt = '', comments, likes, collections } }) =>
    <div className='Post'>
        <Card
            title={<PostHeader owner={owner} />}
            cover={<PostImageCover images={images} />}
        >
            <CPostTapeUserPanel
                postId={_id}
                likes={likes}
                collections={collections}
                styleFontSize='1.7em' />
            <PostDescription title={title} description={text} date={createdAt} />
            <CommentsPostInTape comments={comments} _id={_id} />
        </Card>
    </div>


const PostsTapeMyFollowing = ({ posts, onGetPostsTape, clearPostsTape, following, status }) => {

    const [checkScroll, setCheckScroll] = useState(true)

    useEffect(() => {
        if (checkScroll && following.length !== 0) {
            onGetPostsTape()
            setCheckScroll(false)
        } 
    }, [checkScroll, following])

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return () => {
            document.removeEventListener('scroll', scrollHandler)
            clearPostsTape()
        }
    }, [])

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 500) {
            setCheckScroll(true)
        }
    }

    return (
        <Container>
            <CPreloader promiseName='followingPosts' />
            {posts.length
                ? posts.map(p => <Post key={p._id} postData={p} />)
                : <Title level={4}>
                    The tape is empty. Subscribe to users to see them
                    posts or create your own
                </Title>}
        </Container>
    )
}

export const CPostsTapeMyFollowing = connect(state => ({
    posts: state?.postsTape?.posts || [],
    following: state?.aboutMe?.following || [],
    status: state?.promise?.followingPosts
}), {
    onGetPostsTape: actionGetPostsTapeSagaAC,
    clearPostsTape: actionClearPostsTapeAC,
})(PostsTapeMyFollowing)