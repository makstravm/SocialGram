import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, Input, message, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import { EditOutlined, LogoutOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { Container } from '../components/Container';
import { actionAboutMeUpsertSagaAC, actionAuthLogoutAC, actionClearAboutMeDataAC } from '../actions/actonsCreators';
import { CChangeAvatar } from '../components/ChangeAvatar';



const ContainerSettingsPage = ({ children }) =>
    <div className="SettingsPage ContainerInner">{children}</div>


const EditMyDataIput = ({ title, propValue, propHandler, error, setError, setChekEdit }) => {
    const [value, setValue] = useState(propValue);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setValue(propValue)
    }, [propValue]);

    const addValueHandler = () => {
        const valid = /^[A-Z][a-z0-9_]{1,15}$/

        if (valid.test(value)) {
            propHandler(value)
            setEditMode(false)
        } else {
            setError(true)
        }
    }

    const onChangeInput = (e) => {
        setValue(e.currentTarget.value)
        setError(false)
        setChekEdit(false)
    }

    return (
        <label onDoubleClick={() => setEditMode(true)}>
            <Title level={4}>{title} :</Title>
            <div className='EditMyData__lable-box'>
                {error &&
                    <Text type='danger'>
                        No spaces,First letter is capitalized!!!
                    </Text>}
                {!editMode
                    ?
                    <Text className='EditMyData__lable-text'>{value}
                        <EditOutlined
                            onClick={() => setEditMode(true)}
                            style={{ fontSize: '1.1em', color: '#1890ff ' }} />
                    </Text>
                    :
                    <Input className={error && '--error'} value={value}
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
    const [error, setError] = useState(false);
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
        } else if (status === 'REJECTED') {
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
            <EditMyDataIput title='Nick' propValue={nick} propHandler={setNick} setChekEdit={setChekEdit} error={error} setError={setError} />
            <EditMyDataIput title='Login' propValue={login} propHandler={setLogin} setChekEdit={setChekEdit} error={error} setError={setError} />
            <Button type='primary'
                disabled={!error ? false : true}
                className={!checkEdit && '--block'}
                onClick={onSendEdit}> SendEdit</Button>
        </>
    )
}

const CEditMyData = connect(state => ({
    myData: state?.aboutMe,
    status: state?.promise?.upsertAboutMe?.status
}), {
    onUpsert: actionAboutMeUpsertSagaAC
})(EditMyData)


const SettingsPageInner = () =>
    <Row >
        <Col flex={1}>
            <CChangeAvatar />
        </Col>
        <Col flex={4} offset={1} className='EditMyData'>
            <CEditMyData />
        </Col>
    </Row>


const SettingsPage = ({ onLogOut, clearMydata }) => {
    const handlerExitBtn = () => {
        onLogOut()
        clearMydata()
    }
    return (
        <Container>
            <ContainerSettingsPage>
                <Divider>
                    <Title level={2}>
                        Profile Settings
                    </Title>
                </Divider>
                <SettingsPageInner />
                <Space className='Exit-box__btn'>
                    <Button onClick={handlerExitBtn}><LogoutOutlined />
                        Exit
                    </Button>
                </Space>
            </ContainerSettingsPage>
        </Container>
    )
}

export const CSettingsPage = connect(null, {
    onLogOut: actionAuthLogoutAC,
    clearMydata: actionClearAboutMeDataAC
})(SettingsPage)