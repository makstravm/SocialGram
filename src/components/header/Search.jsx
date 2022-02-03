import { Empty, Input, Popover } from 'antd'
import React from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { UserAvatar } from '../UserAvatar';
import { actionSearchAllUsers } from '../../actions/actonsCreators';


const FindUsersResult = ({ usersRes }) =>
    <div className='Header__search-drop' >
        {
            usersRes.length === 0 ?
                <Empty /> :
                usersRes.map(u =>
                    <Link
                        className='Header__search-link'
                        key={u._id}
                        to={`/profile/${u._id}`} >
                        <UserAvatar avatar={u.avatar} login={u.login} nick={u.nick} avatarSize={'40px'} />
                        <strong>{u?.nick || u?.login || 'User'}</strong>
                    </Link>
                )
        }
    </div >


export const FieldSearch = ({ usersRes, onGetAllUsers }) =>
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
                onChange={e => onGetAllUsers(e.currentTarget.value)}
            />
        </Popover>
    </>



export const CFieldSearch = connect(state => ({ usersRes: state.promise?.findUsersAll?.payload || [] }), { onGetAllUsers: actionSearchAllUsers })(FieldSearch) 
