import React, { useState } from 'react'
import Text from 'antd/lib/typography/Text'
import TextArea from 'antd/lib/input/TextArea'
import { SendOutlined, } from '@ant-design/icons'
import { connect } from 'react-redux'
import { Button, Col, Row } from 'antd'
import { actionFullAddComment } from '../../../actions'


const FieldCommentSend = ({ postId, sentComment }) => {
    const [commentValue, setCommentValue] = useState('')
    const [error, setError] = useState(false)

    const changeComentTextarea = (e) => {
        setCommentValue(e.currentTarget.value)
        setError(false)
    }
    const sendCommentValid = (value) => {
        if (value.trim() !== '') {
            sentComment(postId, value.trim())
            setCommentValue('')
        } else {
            setError(true)
        }
    }

    return (
        <>
            {error && <Text type='danger'>Field is required</Text>}
            <Row align='middle' className='Post__send-comment'>
                <Col flex='auto' offset={1}>
                    <TextArea value={commentValue}
                        placeholder="Add a comment ..."
                        autoSize={{ minRows: 1, maxRows: 2 }}
                        onChange={changeComentTextarea}
                        bordered={false}
                    />
                </Col>
                <Col span={2}>
                    <Button
                        onClick={() => sendCommentValid(commentValue)}
                        icon={< SendOutlined
                            style={{ fontSize: '1.2em', opacity: .6 }} />}
                    />
                </Col>
            </Row>
        </>
    )
}

export const CFieldCommentSend = connect(null, { sentComment: actionFullAddComment })(FieldCommentSend)