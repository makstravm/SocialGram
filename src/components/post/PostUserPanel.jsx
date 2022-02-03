import { HeartFilled, HeartOutlined } from "@ant-design/icons"
import { Button, Col, Row } from "antd"
import { useState } from "react"
import { connect } from "react-redux"
import { actionChangeLikePostOneSagaAC, actionChangeLikePostTapeSagaAC, actionDelLikePostSagaAC, actionHandlerUpsertCollectionSagaAC, actionOnLikePostSagaAC } from "../../actions/actonsCreators"
import { CollectionEmptySvg, CollectionSvgFill } from "../../helpers"
import { CModalUsersLiked } from "../ModalFollow"


const HeartIcon = ({ myID, postId, styleFontSize, likes, changeLikePost }) => {
    const likeId = likes.find(l => l?.owner?._id === myID)?._id
    return (
        <Button
            onClick={() => changeLikePost(postId, likeId)}
            type="none"
            shape="circle"
            icon={
                likeId
                    ? <HeartFilled style={{ color: '#ff6969', fontSize: `${styleFontSize}` }} />
                    : <HeartOutlined style={{ color: '#1890ff', fontSize: `${styleFontSize}` }} />
            }
        />
    )
}

const CHeartIcon = connect(state => ({ myID: state?.aboutMe?._id || '' }))(HeartIcon)



const PostLike = ({ postId, likes = [], styleFontSize, changeLikePost }) => {

    const [open, setOpen] = useState(false)

    return (
        <>
            <Row align="middle" wrap={false}>
                <Col className='Post__heart' >
                    <CHeartIcon
                        postId={postId}
                        likes={likes}
                        styleFontSize={styleFontSize}
                        changeLikePost={changeLikePost}
                    />
                </Col>
                <Col offset={1}>
                    {!!likes.length &&
                        <button onClick={() => { setOpen(true) }}>
                            Likes:<strong>{` ${likes.length}`}</strong>
                        </button>}
                </Col>
            </Row>
            {open && <CModalUsersLiked id={postId} title={'Liked'} statusModal={setOpen} />}
        </>)
}


const CollectionButton = ({ postId, collection, handlerCollection }) => {
    const flag = collection?.find(c => c._id === postId)
    return (
        <Button
            type="none"
            shape="circle"
            onClick={() => handlerCollection(postId, flag)}>
            {flag ? <CollectionSvgFill /> : <CollectionEmptySvg />}
        </ Button >
    )
}

const CCollectionButton = connect(state => ({ collection: state?.aboutMe?.collection?.posts }))(CollectionButton)


const PostUserPanel = ({ postId, likes, styleFontSize, changeLikePost, handlerCollection }) =>
    <Row className="Post__panel-btn" justify="space-between" align="middle">
        <Col flex={'50%'}>
            <PostLike
                postId={postId}
                likes={likes}
                styleFontSize={styleFontSize}
                changeLikePost={changeLikePost}
            />
        </Col>
        <Col flex={'10%'} className='Post__collection'>
            <CCollectionButton
                postId={postId}
                handlerCollection={handlerCollection} />
        </Col>
    </Row>

export const CPostTapeUserPanel = connect(null, {
    handlerCollection: actionHandlerUpsertCollectionSagaAC,
    changeLikePost: actionChangeLikePostTapeSagaAC,
})(PostUserPanel)

export const CPostOneUserPanel = connect(null, {
    handlerCollection: actionHandlerUpsertCollectionSagaAC,
    changeLikePost: actionChangeLikePostOneSagaAC,
})(PostUserPanel)