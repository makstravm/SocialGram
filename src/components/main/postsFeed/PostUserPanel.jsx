import { HeartFilled, HeartOutlined } from "@ant-design/icons"
import { Button, Col, Row, Tooltip } from "antd"
import { useState } from "react"
import { connect } from "react-redux"
import { actionDelLikePost, actionLikePost } from "../../../actions"
import { CModalLikes } from "../profilePage/ModalFollow"


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

const PostUserPanel = ({ myID, postId = '', likes = [], styleFontSize, addLikePost, removeLikePost }) => {
    const [open, setOpen] = useState(false)
    let likeStatus
    let likeId
    likes.find(l => {
        if (l?.owner?._id === myID) {
            likeStatus = true
            likeId = l._id
        } else {
            likeStatus = false
        }
    })

    const changeLike = () => likeStatus ? removeLikePost(likeId, postId) : addLikePost(postId)
    const text = () => !!likes.length &&`Likes: ${likes.length}`


    return (
        <>
            <Row className="Post__panel-btn">
                <Tooltip title={text} >
                    <Col className='Post__heart'>
                        <HeartLike
                            changeLike={changeLike}
                            likeStatus={likeStatus}
                            styleFontSize={styleFontSize} />
                    </Col>
                </Tooltip>

                <Col>

                </Col>
            </Row>
        </>
    )
}

export const CPostUserPanel = connect(state => ({
    myID: state.auth.payload.sub.id || ''
}), {
    addLikePost: actionLikePost,
    removeLikePost: actionDelLikePost,
})(PostUserPanel)