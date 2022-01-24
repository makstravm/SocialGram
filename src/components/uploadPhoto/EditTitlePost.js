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

    const addValueHandler = () => {
        if (title.trim() !== '') {
            setTitleSend(title.trim())
            setEditMode(false)
        } else {
            setError(true)
            setTitleSend('')
        }
    }

    const onChangeInput = (e) => {
        setTitle(e.currentTarget.value)
        setError(false)
    }

    const onKeyPressAdd = (e) => e.charCode === 13 && addValueHandler()

    return (
        <>
            <Divider orientation="left" orientationMargin="0">
                <Title level={3}>Title
                    <Button type="link" onClick={() => setEditMode(true)}><EditOutlined /></Button></Title>
            </Divider>
            {error && <Text type="danger">Field must not be empty</Text>}
            {editMode
                ? <Input
                    value={title}
                    placeholder="title"
                    onChange={onChangeInput}
                    autoFocus onBlur={() => addValueHandler()}
                    onKeyPress={onKeyPressAdd}
                />
                : <Title level={5} onDoubleClick={() => setEditMode(true)}>
                    {title}
                </Title>
            }
        </>)
}