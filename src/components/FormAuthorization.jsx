import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { actionFullLogIn, actionFullRegister } from '../actions';

const FormAuthorization = ({ buttonTitle, onSignIn, loginChek }) => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (loginChek.status === "PENDING") {
            setLoading(loading => loading = true)
        }
        if (loginChek.status === "RESOLVED" && loginChek.payload === null) {
            message.error({
                content: 'Wrong login or password',
                className: 'custom-class',
                style: {
                    marginTop: '20vh',
                },
            })
            setLoading(loading => loading = false)
        }
    }, [loginChek.status]);


    const onFinish = ({ login, password, remember }) => {
        onSignIn(login, password, remember)
    };

    return (
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            labelCol={{ flex: '25px' }}
            layout={'vertical'}
            size='middle'
            onFinish={onFinish}
        >
            <Form.Item
                name="login"
                label='Login'
                rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                label='Password'
                rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item
                name="remember"
                valuePropName="checked"
            >
                <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Form.Item >
                <Button type="primary" className="login-form-button" loading={loading} htmlType="submit">
                    {buttonTitle}
                </Button>
            </Form.Item>
        </Form>
    )
}
export const CLoginForm = connect(state => ({ loginChek: state?.promise?.login || {} }), { onSignIn: actionFullLogIn, })(FormAuthorization)
export const CRegisterForm = connect(state => ({ status: state?.promise?.login }), { onSignIn: actionFullRegister, })(FormAuthorization)




// import { Button, Space } from 'antd';
// import { PoweroffOutlined } from '@ant-design/icons';

// class App extends React.Component {
//     state = {
//         loadings: [],
//     };

//     enterLoading = index => {
//         this.setState(({ loadings }) => {
//             const newLoadings = [...loadings];
//             newLoadings[index] = true;

//             return {
//                 loadings: newLoadings,
//             };
//         });
//         setTimeout(() => {
//             this.setState(({ loadings }) => {
//                 const newLoadings = [...loadings];
//                 newLoadings[index] = false;

//                 return {
//                     loadings: newLoadings,
//                 };
//             });
//         }, 6000);
//     };

//     render() {
//         const { loadings } = this.state;
//         return (
//             <>
//                 <Space style={{ width: '100%' }}>
//                     <Button type="primary" loading>
//                         Loading
//                     </Button>
//                     <Button type="primary" size="small" loading>
//                         Loading
//                     </Button>
//                     <Button type="primary" icon={<PoweroffOutlined />} loading />
//                 </Space>

//                 <Space style={{ width: '100%' }}>
//                     <Button type="primary" loading={loadings[0]} onClick={() => this.enterLoading(0)}>
//                         Click me!
//                     </Button>
//                     <Button
//                         type="primary"
//                         icon={<PoweroffOutlined />}
//                         loading={loadings[1]}
//                         onClick={() => this.enterLoading(1)}
//                     >
//                         Click me!
//                     </Button>
//                     <Button
//                         type="primary"
//                         icon={<PoweroffOutlined />}
//                         loading={loadings[2]}
//                         onClick={() => this.enterLoading(2)}
//                     />
//                 </Space>
//             </>
//         );
//     }
// }
