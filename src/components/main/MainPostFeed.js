import { Card, Col, Row, Carousel } from 'antd'
import Meta from 'antd/lib/card/Meta'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { myFolowingPosts } from '../../actions'
import { backURL } from '../../helpers'
import { UserAvatar } from '../header/Header'

const PostTitle = ({ owner }) =>
    <Link to={`/${owner?._id}`} className='owner'>
        <Row justify="start" align='middle'>
            <Col >
                <UserAvatar avatar={owner.avatar} login={owner.login} nick={owner.nick} />
            </Col>
            <Col offset={1}>
                <span>{owner?.nick ? owner.nick : owner.login}</span>
            </Col>
        </Row>
    </Link >

const PostImage = ({ images }) => {
    function onChange(a, b, c) {
        console.log(a, b, c);
    }

    return (
        <>
            <Carousel >
                
            </Carousel>
        </>
    )
}



const Post = ({ postData: { text, title, owner, images, createdAt, comments } }) => {
    const date = new Date(createdAt * 1)
    const resultDate = new Intl.DateTimeFormat('default').format(date)

    return (
        <div className='Post'>
            <Card
                title={<PostTitle owner={owner} />}
                // hoverable

                cover={<PostImage images={images} />}
            >
                <Meta title="Europe Street beat" description="www.instagram.com" />
            </Card>
        </div>

        // <div>
        //     <a href='/asd'>asd</a>
        //     
        //     {images && images[0] && images[0].url && < img src={backURL + '/' + images[0].url} alt='post' />}
        //     <div>
        //         <span>
        //             {resultDate}
        //         </span>
        //         <span>
        //             {title}
        //         </span>
        //         <span>
        //             {text}
        //         </span>
        //     </div>
        //     {comments ? 'yes' : 'no'}
        // </div>
    )
}

const MainPostFeed = ({ posts, postsFollowing }) => {
    useEffect(() => {
        postsFollowing()
    }, [])
    return (
        <>
            {posts.map(p => <Post key={p._id} postData={p} />)}
        </>

    )
}

export const CMainPostFeed = connect(state => ({ posts: state.promise?.followingPosts?.payload || [] }), { postsFollowing: myFolowingPosts })(MainPostFeed)