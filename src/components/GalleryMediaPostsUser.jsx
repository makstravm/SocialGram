import { connect } from "react-redux"
import { Card, Col, Row } from 'antd'
import postNoData from '../images/profile-post-no.jpeg'
import { Link } from "react-router-dom"
import { PlayCircleOutlined } from "@ant-design/icons"
import { CircularGalleryIcon, videoRegExp } from "../helpers"
import { backURL } from "../actions/actionsGetGql"


const CardImage = ({ media }) =>
    <div className='Profile__box' >
        <img src={backURL + '/' + media?.images[0]?.url} alt="images post" />
        {media?.images.length > 1 &&
            < CircularGalleryIcon className='Profile__box-icon' style={{ stroke: 'black' }} />
        }
    </div>


const CardVideo = ({ media }) =>
    <div className='Profile__box' >
        <video>
            <source src={backURL + '/' + media?.images[0]?.url} />
        </video>
        <PlayCircleOutlined className='Profile__box-icon--video' />
    </div>


const ValidationImageOrVideo = ({ media }) => (
    videoRegExp.test(media?.images[0]?.originalFileName)
        ? <CardVideo media={media} />
        : <CardImage media={media} />
)


const CardMediaPost = ({ media }) =>
    <Link to={`/post/${media?._id}`}>
        <Card className='Profile__post' hoverable>
            {media?.images && media?.images[0] && media?.images[0]?.url
                ? <ValidationImageOrVideo media={media} />
                : <img src={postNoData} alt='no data' />
            }
        </Card>
    </Link>


const GalleryMediaPostsUser = ({ posts }) =>
    <Row gutter={[15, 15]}>
        {posts.map(p =>
            <Col key={p._id} span={8}>
                <CardMediaPost media={p} />
            </Col>)
        }
    </Row >

export const CGalleryMediaPostsUser = connect(state => ({ posts: state?.postsTape?.posts || [] }))(GalleryMediaPostsUser)