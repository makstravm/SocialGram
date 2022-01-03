import { Input } from 'antd'
import React from 'react'

const { Search } = Input;

export const Searcha = () => {
    return (
        <div className='Search'>
            <Search
                onSearch={value => console.log(value)}
                placeholder="Search users"
                allowClear
                enterButton="Search"
                enterButton />
        </div>
    )
}
