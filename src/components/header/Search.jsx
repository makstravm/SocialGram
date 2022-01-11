import { Empty, Input, Popover } from 'antd'
import React from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionFindUsers } from '../../actions';
import { UserAvatar } from './Header';

const { Search } = Input;
const FindUsersResult = ({ usersRes }) => {
    return <div className='Header__search-drop' >
        {
            usersRes.length === 0 ?
                <Empty /> :
                usersRes.map(u => {
                    return (<Link
                        className='Header__search-link'
                        key={u._id}
                        to={`/profile/${u._id}`} >
                        <UserAvatar avatar={u.avatar} login={u.login} nick={u.nick} avatarSize={'40px'} />
                        <strong>{u?.nick || u?.login || 'User'}</strong>
                    </Link>)
                })
        }
    </div >
}

export const FieldSearch = ({ usersRes, findUsers }) => {
    return (
        <>
            <Popover placement="bottom"
                content={<FindUsersResult usersRes={usersRes} />}
                destroyTooltipOnHide={true}
                trigger="focus">
                <></>
                <Search className='Header__search'
                    onSearch={value => findUsers(value)}
                    placeholder="Search users"
                    allowClear
                    enterButton="Search"
                    enterButton />
            </Popover>
        </>
    )
}

export const CFieldSearch = connect(state => ({ usersRes: state.promise?.findUsersAll?.payload || [] }), { findUsers: actionFindUsers })(FieldSearch) 
