import { connect } from "react-redux"
import { Card, Col, Row } from 'antd'
import postNoData from '../../images/profile-post-no.jpeg'
import { Link } from "react-router-dom"
import { backURL, CircularGalleryIcon, videoRegExp } from "../../helpers"
import { PlayCircleOutlined } from "@ant-design/icons"

const Posts = ({ posts }) =>
    <Row gutter={[15, 15]}>
        {Array.isArray(posts) && posts.map(p => <Col key={p._id} span={8}>
            <Link to={`/post/${p._id}`}>
                <Card className='Profile__post' hoverable>
                    {p?.images && p?.images[0] && p.images[0]?.url
                        ? videoRegExp.test(p.images[0]?.originalFileName)
                            ? <div className='Profile__box' >
                                <video>
                                    <source src={backURL + '/' + p.images[0]?.url} />
                                </video>
                                <PlayCircleOutlined className='Profile__box-icon--video' />
                            </div>
                            : p.images.length === 1
                                ?
                                <img src={backURL + '/' + p.images[0]?.url} alt="images post" />
                                : <div className='Profile__box' >
                                    <CircularGalleryIcon className='Profile__box-icon' style={{ stroke: 'black' }} />
                                    <img src={(backURL + '/' + p?.images[0]?.url)} alt='post Img' />
                                </div>
                        : <img src={postNoData} alt='no data' />
                    }
                </Card>
            </Link>
        </Col>)
        }
    </Row >
    
export const CPosts = connect(state => ({ posts: state.postsFeed?.posts || [] }))(Posts)