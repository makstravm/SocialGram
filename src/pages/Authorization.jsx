import { Card, Col, Divider, Row } from "antd";
import { NavLink } from "react-router-dom";
import { CLoginForm, CRegisterForm } from "../components/FormAuthorization";

import authBg from "../images/authBg.png"

export const Authorization = ({ match: { params: { _id } } }) =>
    <div className='Authorization' style={{ backgroundImage: `url(${authBg})` }}>
        <Row justify="end" align="middle" className='Authorization__form'>
            <Col >
                <Card  >
                    <NavLink activeClassName='active' to={`/auth/login`}><span>Log In</span></NavLink>
                    <Divider type="vertical" />
                    <NavLink activeClassName='active' to={'/auth/registration'}>Registration</NavLink>
                    <Divider>
                        {_id === 'login'
                            ? 'Log in'
                            : 'Registration'}
                    </Divider >
                    {_id === 'login'
                        ? <CLoginForm buttonTitle={'Sign In'} />
                        : <CRegisterForm buttonTitle={'Sign up'} />}
                </Card>
            </Col>
        </Row >
    </div>
