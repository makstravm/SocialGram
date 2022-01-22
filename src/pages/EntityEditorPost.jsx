import { EditOutlined } from "@ant-design/icons"
import { Button, Divider, Input } from "antd"
import TextArea from "antd/lib/input/TextArea"
import Paragraph from "antd/lib/typography/Paragraph"
import Text from "antd/lib/typography/Text"
import Title from "antd/lib/typography/Title"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { actionSentPost, actionsentPostAC } from "../actions"
import { EditPhotos } from "../components/uploadPhoto"


const ContainEditorPost = ({ children }) =>
    <div className='ContainErditorPost'>{children}</div>


const EditTitlePost = ({ titleSend, setTitleSend }) => {
    const [title, setTitle] = useState(titleSend || 'Enter title')
    const [error, setError] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const addTaskHandler = () => {
        if (title.trim() !== '') {
            setTitleSend(title.trim())
            setEditMode(false)
        } else {
            setError(true)
            setTitleSend('')
        }
    }
    const titleInputHandler = () => {
        setEditMode(true)
    }

    const titleInputHandlerClose = () => {
        addTaskHandler()
    }

    const onChangeTask = (e) => {
        setTitle(e.currentTarget.value)
        setError(false)
    }

    const onKeyPressAddTask = (e) => {
        if (e.charCode === 13) {
            addTaskHandler()
        }
    }
    return (
        <>
            <Divider orientation="left" orientationMargin="0">
                <Title level={3}>Title
                    <Button type="link" onClick={titleInputHandler}><EditOutlined /></Button></Title>
            </Divider>
            {error && <Text type="danger">Field must not be empty</Text>}
            {editMode
                ? <Input
                    value={title}
                    placeholder="title"
                    onChange={onChangeTask}
                    // className={s.input + ' ' + (error && s.error)}
                    autoFocus onBlur={titleInputHandlerClose}
                    onKeyPress={onKeyPressAddTask}
                />
                : <Title level={5} onDoubleClick={titleInputHandler}>
                    {title}
                </Title>
            }
        </>)
}


const EditDescriptionPost = ({ description, setDescription }) => {
    const [text, setText] = useState(description || 'Enter descriptin');
    const [error, setError] = useState(false)
    const [editMode, setEditMode] = useState(false)


    const addTaskHandler = () => {
        if (text.trim() !== '') {
            setDescription(text)
            setEditMode(false)
        } else {
            setError(true)
            setDescription('')
        }
    }
    const textInputHandler = () => {
        setEditMode(true)
    }

    const textInputHandlerClose = () => {
        addTaskHandler()
    }

    const onChangeTask = (e) => {
        setText(e.currentTarget.value)
        setError(false)
    }

    const onKeyPressAddTask = (e) => {
        if (e.shiftKey && e.charCode === 13) {
            setText(text += `'\n'`)
        } else if (e.charCode === 13) {
            addTaskHandler()
        }
    }
    return (
        <>
            <Divider orientation="left" orientationMargin="0">
                <Title level={3}>Description
                    <Button type="link" onClick={textInputHandler}><EditOutlined /></Button></Title>
            </Divider>
            {error && <Text type="danger">Field must not be empty</Text>}
            {editMode
                ? <TextArea
                    placeholder="Description"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    value={text}
                    onChange={onChangeTask}
                    autoFocus onBlur={textInputHandlerClose}
                    onKeyPress={onKeyPressAddTask}
                />
                : <Paragraph className="description" onDoubleClick={textInputHandler}>
                    {text}
                </Paragraph>
            }
        </>)
}

const EntityEditorPost = ({ entity = { array: [] }, onSave }) => {

    const [photos, setPhotos] = useState([]);
    const [titleSend, setTitleSend] = useState('')
    const [description, setDescription] = useState('');
    //  photos.length && titleSend && description ? : true
    const disabledBtn = false
    const sentPost = () => {
        const [newphotos ]= photos.map(ph => {
            return { _id: ph._id }
        })


        onSave(newphotos, titleSend, description);
    }
    // const sentPost = () => {
    //     const newphotos = photos.map(ph => {
    //         return { _id: ph._id }
    //     })

    //     console.log(result)

    // }
    return (
        <ContainEditorPost>
            <h1 className="title" level={1}>Create / edit Post</h1>
            <Divider orientation="left" orientationMargin="0"><Title level={3}>Photos</Title></Divider>
            <EditPhotos photos={photos} setPhotos={setPhotos} />
            <EditTitlePost titleSend={titleSend} setTitleSend={setTitleSend} />
            <EditDescriptionPost description={description} setDescription={setDescription} />
            <Divider orientation="right">   <Button disabled={disabledBtn} type="primary" onClick={sentPost}>Send a Post</Button></Divider>
        </ContainEditorPost>
    )
}

export const CEntityEditorPost = connect(null, { onSave: actionSentPost })(EntityEditorPost)