import { HeartFilled, HeartOutlined } from "@ant-design/icons"
import { Button, Col, Row} from "antd"
import { useState } from "react"
import { connect } from "react-redux"
import { actionDelLikePost, actionHandlerUpsertCollection, actionLikePost, } from "../../../actions"
import { CollectionEmptySvg, CollectionSvgFill } from "../../../helpers"
import { CModalPostLiked } from "../profilePage/ModalFollow"


const HeartLike = ({ styleFontSize, likeStatus, changeLike }) =>
    <Button
        onClick={() => changeLike()}
        type="none"
        shape="circle"
        icon={
            likeStatus
                ? <HeartFilled style={{ color: '#ff6969', fontSize: `${styleFontSize}` }} />
                : <HeartOutlined style={{ color: '#1890ff', fontSize: `${styleFontSize}` }} />
        }
    />

const PostUserPanel = ({ myID, postId = '', likes = [], collections, styleFontSize, addLikePost, removeLikePost, handlerCollection }) => {
    const [open, setOpen] = useState(false)

    const likeId = likes.find(l => l?.owner?._id === myID)?._id

    const flag = collections?.posts.find(c => c._id === postId)

    const changeLike = () => likeId ? removeLikePost(likeId, postId) : addLikePost(postId)

    return (
        <>
            {open && <CModalPostLiked statusModal={setOpen} title={'Liked'} id={postId} />}
            <Row className="Post__panel-btn" justify="space-between" align="middle">
                <Col flex={'50%'}>
                    <Row align="middle" wrap={false}>
                        <Col className='Post__heart' >
                            <HeartLike
                                changeLike={changeLike}
                                likeStatus={likeId}
                                styleFontSize={styleFontSize} />
                        </Col>
                        <Col offset={1}>
                            {!!likes.length && <button onClick={() => { setOpen(true) }}>Likes:<strong>{` ${likes.length}`}</strong></button>}
                        </Col>
                    </Row>
                </Col>
                <Col flex={'10%'} className='Post__collection'>
                    <Button type="none"
                        shape="circle" onClick={() => handlerCollection(postId, flag)}>
                        {flag ? <CollectionSvgFill /> : <CollectionEmptySvg />}
                    </Button>
                </Col>
            </Row>

        </>
    )
}

export const CPostUserPanel = connect(state => ({
    myID: state.auth.payload.sub.id || '',
    collections: state.myData?.collections
}), {
    addLikePost: actionLikePost,
    removeLikePost: actionDelLikePost,
    handlerCollection: actionHandlerUpsertCollection,
})(PostUserPanel)