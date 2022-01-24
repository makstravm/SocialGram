import React, { useEffect, useState } from 'react';
import { Container } from './Content';
import { CEditAvatar } from '../components/main/profilePage/EditAvatar'
import { Button, Col, Divider, Input, message, Row } from 'antd'
import Title from 'antd/lib/typography/Title';
import { connect } from 'react-redux';
import { EditOutlined } from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import { actionFullAboutMeUpsert } from '../actions';


const ContainerSettingsPage = ({ children }) =>
    <div className="SettingsPage ContainerInner">{children}</div>


const EditMyDataIput = ({ title, propValue, propHandler, check }) => {
    const [value, setValue] = useState(propValue);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setValue(propValue)
    }, [propValue]);

    const addValueHandler = () => {
        const valid = /^[A-Z][a-z0-9_]{1,15}$/
        if (valid.test(value)) {
            propHandler(value)
            setEditMode(false)
            check(false)
        } else {
            setError(true)
        }
    }

    const onChangeInput = (e) => {
        setValue(e.currentTarget.value)
        setError(false)
    }

    return (
        <label onDoubleClick={() => setEditMode(true)}>
            <Title level={4}>{title} :</Title>
            <div className='EditMyData__lable-box'>
                {error && <Text type='danger'> First letter is capitalized!!!</Text>}
                {!editMode
                    ? <Text className='EditMyData__lable-text'>{value}
                        <EditOutlined
                            onClick={() => setEditMode(true)}
                            style={{ fontSize: '1.1em', color: '#1890ff ' }} />
                    </Text>
                    : <Input className={error && '--error'} value={value}
                        onBlur={addValueHandler}
                        onChange={onChangeInput}
                        onPressEnter={addValueHandler}
                        autoFocus />
                }
            </div>
        </label>
    )
}

const EditMyData = ({ myData, status, onUpsert }) => {

    const [nick, setNick] = useState(myData?.nick || '');
    const [login, setLogin] = useState(myData?.login || '');
    const [checkEdit, setChekEdit] = useState(true);
    useEffect(() => {
        setNick(myData?.nick || '')
        setLogin(myData?.login || '')
    }, [myData])

    useEffect(() => {
        if (status === "RESOLVED") {
            message.success({
                content: 'User data updated',
                className: 'custom-class',
                style: {
                    marginTop: '10vh',
                },
            });
            setChekEdit(true)
        } else if(status=== 'REJECTED'){
            message.error({
                content: 'Что-то не так, нужно повторить!',
                className: 'custom-class',
                style: {
                    marginTop: '10vh',
                },
            });
        }
    }, [status])

    const onSendEdit = () => onUpsert(nick, login)




    return (
        <>
            <EditMyDataIput title='Nick' propValue={nick} propHandler={setNick} check={setChekEdit} />
            <EditMyDataIput title='Login' propValue={login} propHandler={setLogin} check={setChekEdit} />
            <Button type='primary'
                disabled={nick && login ? false : true}
                className={!checkEdit && '--block'}
                onClick={onSendEdit}> SendEdit</Button>
        </>
    )
}

const CEditMyData = connect(state => ({ myData: state?.myData, status: state?.promise?.upsertAboutMe?.status }), { onUpsert: actionFullAboutMeUpsert })(EditMyData)

export const SettingsPage = () => {
    return (
        <Container>
            <ContainerSettingsPage>
                <Divider><Title level={2}>Profile Settings</Title></Divider>
                <Row >
                    <Col flex={1}>
                        <CEditAvatar />
                    </Col>
                    <Col flex={4} offset={1} className='EditMyData'>
                        <CEditMyData />
                    </Col>
                </Row>
            </ContainerSettingsPage>
        </Container>
    )
};
