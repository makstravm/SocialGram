import { EditOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";



export const EditDescriptionPost = ({ description, setDescription }) => {
    const [text, setText] = useState(description || 'Enter descriptin');
    const [error, setError] = useState(false)
    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        setText(description || 'Enter descriptin')
    }, [description]);
    

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