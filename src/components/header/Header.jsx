import React from 'react'
import logo from '../../logo.svg';
import { Link } from 'react-router-dom';
import { Search } from './Search';
import { connect } from 'react-redux';
import { actionProfilData } from '../../actions';
import { backURL } from '../../helpers';

const UserNav = ({ id, profileData }) => {
    profileData(id)
    return <div className='UserNav'>
        <CUserNavIcon />
    </div>
}
const UserNavIcon = ({ userData: { _id, login, avatar } }) => {
    return <>
        <Link to='/'>Home</Link>
        <Link to='/message'>Messsege</Link>
        <Link to='/add'>addq</Link>
        <Link to='/rar'>Random</Link>
        <Link to={`/${_id}`}>
            <img src={(avatar && avatar?.url ? backURL + '/' + avatar.url : 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/3f81dce0-ac68-4e9f-97e9-fb25a0e03e3e/d1uebpu-a14c9f16-52ed-46e1-b488-05f6f3bf5aa2.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzNmODFkY2UwLWFjNjgtNGU5Zi05N2U5LWZiMjVhMGUwM2UzZVwvZDF1ZWJwdS1hMTRjOWYxNi01MmVkLTQ2ZTEtYjQ4OC0wNWY2ZjNiZjVhYTIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.TIPinTcurrjsKdUxqM8NEZsXrIoA2UJW6rxxX3O-DLw')} alt='avatar' width='50px' />
        </Link>
    </>
}

const CUserNav = connect(state => ({ id: state.auth?.payload.sub.id || {} }), { profileData: actionProfilData })(UserNav)
const CUserNavIcon = connect(state => ({ userData: state.promise?.dataProfileAuth.payload || {} }))(UserNavIcon)

const Logo = () => {
    return <Link to='/'>
        <img src={logo} alt='logo' width='180vw' />
    </Link>

}
const Header = () => {
    return (
        <div className='Header'>
            <Logo />
            <Search />
            <CUserNav />
        </div>
    )
}

export default Header
