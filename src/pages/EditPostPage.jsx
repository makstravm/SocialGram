import { Button, Divider, message } from "antd"
import Title from "antd/lib/typography/Title"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { actionClearPostsOneAC, actionCreatePostSagaAC, actionPostOneDataAC } from "../actions/actonsCreators"
import { history } from '../App'
import { Container } from "../components/Container"
import { EditDescriptionPost } from "../components/editPost/EditDescriptionPost"
import { EditPhotos } from "../components/editPost/EditPhotos"
import { EditTitlePost } from "../components/editPost/EditTitlePost"


const ContainEditorPost = ({ children }) =>
    <div className='ContainEditPost ContainerInner'>{children}</div>


const EditPostPage = ({ match: { params: { _id } }, myID, entity, status, onSave, clearPostOne }) => {

    const [photos, setPhotos] = useState(entity?.images || []);
    const [titleSend, setTitleSend] = useState(entity?.title || '')
    const [description, setDescription] = useState(entity?.text || '');

    useEffect(() => {
        if (_id === 'new' && Object.keys(entity).length) {
            clearPostOne()
            setPhotos([])
            setTitleSend('')
            setDescription('')
        }
    }, [_id]);


    useEffect(() => {
        if (status === "RESOLVED") {
            message.success(`post published, can create a new one`)
            history.push(`/profile/${myID}`)
        } else if (status === "REJECTED") {
            message.error('Error')
        }
    }, [status])

    const disabledBtn = photos?.length && titleSend && description ? false : true
    const savePost = () => onSave(photos, titleSend, description)

    return (
        <Container>
            <ContainEditorPost >
                <h1 className="title" level={1}>Create / edit Post</h1>
                <Divider orientation="left" orientationMargin="0">
                    <Title level={3}>Photos</Title>
                </Divider>

                <EditPhotos photos={photos} setPhotos={setPhotos} />
                <EditTitlePost titleSend={titleSend} setTitleSend={setTitleSend} />
                <EditDescriptionPost description={description} setDescription={setDescription} />

                <Divider orientation="right">
                    <Button
                        disabled={disabledBtn}
                        type="primary"
                        onClick={savePost}
                    >
                        Save a Post
                    </Button>
                </Divider>
            </ContainEditorPost>
        </ Container>
    )
}

export const CEditPostPage = connect(state => ({
    myID: state?.aboutMe?._id,
    entity: state?.postOne,
    status: state?.promise?.sentPost?.status
}),
    {
        onSave: actionCreatePostSagaAC,
        clearPostOne: actionClearPostsOneAC
    })(EditPostPage)