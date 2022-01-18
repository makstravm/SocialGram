import React from 'react'

export const DateCreated = ({ date = '' }) => {
    const newDate = new Date(date * 1)
    const resultDate = new Intl.DateTimeFormat('default').format(newDate)
    return (
        <>
            {resultDate}
        </>
    )
}
