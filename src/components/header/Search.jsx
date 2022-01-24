import { Empty, Input, Popover } from 'antd'
import React from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {  actionSearchUsers } from '../../actions';
import { SearchOutlined } from '@ant-design/icons';
import { UserAvatar } from './UserAvatar';
const FindUsersResult = ({ usersRes }) =>
    <div className='Header__search-drop' >
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


export const FieldSearch = ({ usersRes, findUsers }) =>
    <>
        <Popover placement="bottom"
            content={<FindUsersResult usersRes={usersRes} />}
            destroyTooltipOnHide={true}
            trigger="focus">
            <></>
            <Input
                placeholder="Search users"
                allowClear
                prefix={<SearchOutlined style={{ color: '#c9c9c9' }} />}
                onChange={e => findUsers(e.currentTarget.value)}
            />
        </Popover>
    </>



export const CFieldSearch = connect(state => ({ usersRes: state.promise?.findUsersAll?.payload || [] }), { findUsers: actionSearchUsers })(FieldSearch) 
