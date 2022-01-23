import { EditOutlined } from "@ant-design/icons"
import { Button, Divider, Input } from "antd"
import Text from "antd/lib/typography/Text"
import Title from "antd/lib/typography/Title"
import { useEffect, useState } from "react"




export const EditTitlePost = ({ titleSend, setTitleSend }) => {

    const [title, setTitle] = useState(titleSend || 'Enter title')
    const [error, setError] = useState(false)
    const [editMode, setEditMode] = useState(false)
    useEffect(() => {
        setTitle(titleSend || 'Enter title')
    }, [titleSend]);

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
                    autoFocus onBlur={titleInputHandlerClose}
                    onKeyPress={onKeyPressAddTask}
                />
                : <Title level={5} onDoubleClick={titleInputHandler}>
                    {title}
                </Title>
            }
   
        </>)
}