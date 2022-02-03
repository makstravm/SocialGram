import React, { useState } from 'react'
import Text from 'antd/lib/typography/Text'
import TextArea from 'antd/lib/input/TextArea'
import { SendOutlined, } from '@ant-design/icons'
import { connect } from 'react-redux'
import { Button, Col, Row } from 'antd'
import { actionAddCommentPostInTapeSagaAC, actionAddCommentPostOneSagaAC, actionAddSubComment, actionEditCommentSagaAC } from '../actions/actonsCreators'



const CommentField = ({ id, sentComment, autoFocus, value = '', setOpen, rows = 2, bordered = false }) => {
    const [commentValue, setCommentValue] = useState(value)
    const [error, setError] = useState(false)

    const changeComentTextarea = (e) => {
        setCommentValue(e.currentTarget.value)
        setError(false)
    }

    const sendCommentValid = () => {
        if (commentValue.trim() !== '') {
            sentComment(id, commentValue.trim())
            setCommentValue('')
            setOpen(false)
        } else {
            setError(true)
        }
    }

    return (
        <div>
            {error &&
                <Text
                    type='danger'
                    style={{ display: 'inherit', textAlign: 'center' }}
                >
                    Field is required
                </Text>}
            <Row align='middle' className='Post__send-comment'>
                <Col flex='auto' offset={1}>
                    <TextArea value={commentValue}
                        autoFocus={autoFocus || false}
                        placeholder="Add a comment ..."
                        autoSize={{ minRows: 1, maxRows: rows }}
                        onChange={changeComentTextarea}
                        bordered={bordered}
                        maxLength={150}
                    />
                </Col>
                <Col span={2}>
                    <Button
                        onClick={sendCommentValid}
                        icon={< SendOutlined
                            style={{ fontSize: '1.2em', opacity: .6 }} />}
                    />
                </Col>
            </Row>
        </div>
    )
}

export const CCommentFieldPostTape = connect(null, { sentComment: actionAddCommentPostInTapeSagaAC })(CommentField)

export const CCommentFieldPostOne = connect(null, { sentComment: actionAddCommentPostOneSagaAC })(CommentField)

export const CFieldSubComment = connect(null, { sentComment: actionAddSubComment })(CommentField)

export const CFieldEditCommentSend = connect(null, { sentComment: actionEditCommentSagaAC})(CommentField)