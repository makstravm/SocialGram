import { Card, Col, Row, Carousel, Empty } from 'antd'
import Meta from 'antd/lib/card/Meta'
import React, { createRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { myFolowingPosts } from '../../actions'
import { backURL } from '../../helpers'
import { UserAvatar } from '../header/Header'
import nodata from '../../images/nodata.png'
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons'


const PostTitle = ({ owner }) =>
    <Link to={`/${owner?._id}`} className='owner'>
        <Row justify="start" align='middle'>
            <Col >
                <UserAvatar avatar={owner?.avatar} login={owner?.login} nick={owner?.nick} />
            </Col>
            <Col offset={1}>
                <span>{owner?.nick ? owner.nick : owner?.login ? owner.login : 'Null'}</span>
            </Col>
        </Row>
    </Link >



class PostImage extends React.Component {
    constructor(props) {
        super(props);
        this.carouselRef = createRef();
        this.state = {
            movePrev: false,
            moveNext: false
        }
    }

    handleNext = () => this.carouselRef.current.next(this);

    handlePrev = () => this.carouselRef.current.prev(this);

    moveOnDivArray = (length, index) => {
        if (index === 0) {
            this.setState({ movePrev: false, moveNext: true })
        } else if (index === length - 1) {
            this.setState({ movePrev: true, moveNext: false })
        } else {
            this.setState({ movePrev: true, moveNext: true })
        }
    }

    downOnDivArray = () => this.setState({ movePrev: false, moveNext: false })

    render() {

        const { images } = this.props
        return (
            <Carousel ref={this.carouselRef}
                effect="fade"
                dots={{ className: 'Post__dots' }
                }>
                {!!images ?
                    images.map((i, index) => i?.url ? <div key={i._id}
                        onMouseEnter={() => this.moveOnDivArray(images.length, index)}
                        onMouseLeave={this.downOnDivArray}>
                        <button onClick={() => this.handlePrev()}
                            className={`Post__prev Post__btn ${this.state.movePrev ? '--active' : ''}`}><LeftCircleOutlined /></button>
                        <button onClick={() => this.handleNext()}
                            className={`Post__next Post__btn ${this.state.moveNext ? '--active' : ''}`}><RightCircleOutlined /></button>
                        <img src={backURL + '/' + i.url} />
                    </div> :
                        <Empty key={i._id} image={nodata} description={false} />) :
                    <Empty image={nodata} description={false} />
                }
            </Carousel >
        );
    }
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