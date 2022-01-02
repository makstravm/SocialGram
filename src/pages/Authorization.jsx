import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { actionFullLogin } from '../actions'

const LogIn = ({ logInput, setLogInput, pasInput, setPasInput , onLogIn}) => {
    return (
        <div className='Form'>
            <div className="LoginForm__inner">
                <h4>Login</h4>
                <label >
                    Login:
                    <input value={logInput}
                        onChange={e => setLogInput(e.currentTarget.value)}
                        placeholder='login' />
                </label>
                <label>
                    Password:
                    <input value={pasInput}
                        onChange={e => setPasInput(e.currentTarget.value)}
                        placeholder='password' />
                </label>
                <button onClick={()=>onLogIn(logInput, pasInput )}
                >Login
                </button>
                <Link to={'/registration'}>Registration</Link>
            </div >
        </div >
    )
}


const Form = ({ auth, onLogIn }) => {
    const [logInput, setLogInput] = useState('')
    const [pasInput, setPasInput] = useState('')

    return (
        <div className='UserPanel'>
            <LogIn
                logInput={logInput}
                setLogInput={setLogInput}
                pasInput={pasInput}
                setPasInput={setPasInput}
                onLogIn={onLogIn}
            />

        </div>
    )
}

const CForm = connect(state => ({ auth: state.auth }), { onLogIn: actionFullLogin })(Form)




export const Authorization = () => {
    return (
        <div className='Authorization'>
            asjgsdg
            <CForm />
        </div>
    )
}


