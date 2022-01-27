import React, { useState } from 'react'
import Text from 'antd/lib/typography/Text'
import TextArea from 'antd/lib/input/TextArea'
import { SendOutlined, } from '@ant-design/icons'
import { connect } from 'react-redux'
import { Button, Col, Row } from 'antd'
import { actionAddSubComment, actionEditComment, actionFullAddComment } from '../../../actions'


const FieldCommentSend = ({ id, sentComment, autoFocus, value = '', setOpen, rows = 1,bordered=false }) => {
    const [commentValue, setCommentValue] = useState(value)
    const [error, setError] = useState(false)

    const changeComentTextarea = (e) => {
        setCommentValue(e.currentTarget.value)
        setError(false)
    }
    const sendCommentValid = (value) => {
        if (value.trim() !== '') {
            sentComment(id, value.trim())
            setCommentValue('')
        } else {
            setError(true)
        }
    }

    const handlerClickBtn = () => {
        sendCommentValid(commentValue)
        setOpen(false)
    }

    const onKeyPressHandler = e => {
        if (e.charCode === 13) {
            sendCommentValid(commentValue)
            setOpen(false)
        }
    }

    return (
        <>
            {error && <Text type='danger'>Field is required</Text>}
            <Row align='middle' className='Post__send-comment'>
                <Col flex='auto' offset={1}>
                    <TextArea value={commentValue}
                        autoFocus={autoFocus || false}
                        placeholder="Add a comment ..."
                        autoSize={{ minRows: 1, maxRows: rows }}
                        onChange={changeComentTextarea}
                        bordered={bordered}
                        onKeyPress={onKeyPressHandler}
                    />
                </Col>
                <Col span={2}>
                    <Button
                        onClick={handlerClickBtn}
                        icon={< SendOutlined
                            style={{ fontSize: '1.2em', opacity: .6 }} />}
                    />
                </Col>
            </Row>
        </>
    )
}

export const CFieldCommentSend = connect(null, { sentComment: actionFullAddComment })(FieldCommentSend)

export const CFieldSubCommentSend = connect(null, { sentComment: actionAddSubComment })(FieldCommentSend)

export const CFieldUpsertCommentSend = connect(null, { sentComment: actionEditComment })(FieldCommentSend)