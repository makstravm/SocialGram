import { Button, Divider, message } from "antd"
import Title from "antd/lib/typography/Title"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { actionAddPostsFeedAC, actionFullSentPost, actionRemovePostsFeedAC, } from "../actions"
import { EditPhotos } from "../components/uploadPhoto/EditPhotos"
import { EditDescriptionPost } from "../components/uploadPhoto/EditDescriptionPost"
import { EditTitlePost } from "../components/uploadPhoto/EditTitlePost"
import { Container } from "./Content"
import { history } from '../App'


const ContainEditorPost = ({ children }) =>
    <div className='ContainEditPost ContainerInner'>{children}</div>

const EntityEditorPost = ({ match: { params: { _id } }, myID, entity, status, onSave, updatePost, clearState }) => {

    const [photos, setPhotos] = useState(entity?.images || []);
    const [titleSend, setTitleSend] = useState(entity?.title || '')
    const [description, setDescription] = useState(entity?.text || '');
    useEffect(() => {
        let newEntity
        if (Array.isArray(entity)) {
            newEntity = entity.find(e => e._id === _id)
            setPhotos(newEntity?.images || [])
            setTitleSend(newEntity?.title || '')
            setDescription(newEntity?.text || '')
        } else if (!Object.keys(entity = {}).length) history.push('/edit/post/new')
        updatePost(newEntity)
        return () => {
            clearState()
        }
    }, []);


    useEffect(() => {
        if (status === "RESOLVED") {
            message.success(`post published, can create a new one`)
            history.push(`/profile/${myID}`)
        }else if(status === "REJECTED"){
            message.error('Error')
        }
    }, [status])

    const disabledBtn = photos.length && titleSend && description ? false : true
    const sentPost = () => onSave(photos, titleSend, description)

    return (
        <Container>
            <ContainEditorPost >
                <h1 className="title" level={1}>Create / edit Post</h1>
                <Divider orientation="left" orientationMargin="0"><Title level={3}>Photos</Title></Divider>
                <EditPhotos photos={photos} setPhotos={setPhotos} />
                <EditTitlePost titleSend={titleSend} setTitleSend={setTitleSend} />
                <EditDescriptionPost description={description} setDescription={setDescription} />
                <Divider orientation="right">   <Button disabled={disabledBtn} type="primary" onClick={sentPost}>Send a Post</Button></Divider>
            </ContainEditorPost>
        </ Container>
    )
}

export const CEntityEditorPost = connect(state => ({
    myID: state?.auth?.payload?.sub?.id,
    entity: state?.postsFeed.posts,
    status: state?.promise?.sentPost?.status
}),
    {
        updatePost: actionAddPostsFeedAC,
        onSave: actionFullSentPost,
        clearState: actionRemovePostsFeedAC,
    })(EntityEditorPost)