import { HeartFilled, HeartOutlined } from "@ant-design/icons"
import { Button, Col, Row } from "antd"
import { connect } from "react-redux"
import { actionDelLikePost, actionLikePost } from "../../../actions"


const HeartLike = ({ styleFontSize, likeStatus, changeLike }) =>
    <Button
        onClick={() => changeLike()}
        type="none"
        shape="circle"
        icon={
            likeStatus ?
                <HeartFilled style={{ color: '#ff6969', fontSize: `${styleFontSize}` }} /> :
                <HeartOutlined style={{ color: '#1890ff', fontSize: `${styleFontSize}` }} />}
    />

const PostUserPanel = ({ myID, postId, likes = [], addLikePost, removeLikePost }) => {
    let likeStatus
    let likeId
    likes.find(l => {
        if (l.owner._id === myID) {
            likeStatus = true
            likeId = l._id
        } else {
            likeStatus = false
        }
    })

    const changeLike = () => likeStatus ? removeLikePost(likeId, postId) : addLikePost(postId)
    const styleFontSize = '1.7em'

    return (
        <>
            <Row className="Post__panel-btn">
                <Col className='Post__heart'>
                    <HeartLike
                        changeLike={changeLike}
                        likeStatus={likeStatus}
                        styleFontSize={styleFontSize} />
                </Col>
                <Col>
                </Col>
            </Row>
            {!!likes.length && <strong>Likes: {likes.length}</strong>}
        </>
    )
}

export const CPostUserPanel = connect(state => ({
    myID: state.auth.payload.sub.id || '',
    myLikes: state?.promise?.myLikes?.payload || [],
}), {
    addLikePost: actionLikePost,
    removeLikePost: actionDelLikePost,
})(PostUserPanel)