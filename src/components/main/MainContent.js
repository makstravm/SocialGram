import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { myFolowingPosts } from '../../actions'
import { backURL } from '../../helpers'

const Post = ({ postData: { text, title, owner, images, createdAt, comments } }) => {
    const date = new Date(createdAt * 1)
    const resultDate = new Intl.DateTimeFormat('default').format(date)
    return (
        <div style={{ padding: '50px '}}>
            <a href='/asd'>asd</a>
            <Link to={`/${owner?._id}`} className='owner'>
                {owner?.avatar?.url && <img src={backURL + '/' + owner.avatar.url} alt='avatar' />}
                <span>{owner?.login}</span>
            </Link>
            {images && images[0] && images[0].url && < img src={backURL + '/' + images[0].url} alt='post' />}
            <div>
                <span>
                    {resultDate}
                </span>
                <span>
                    {title}
                </span>
                <span>
                    {text}
                </span>
            </div>
            {comments ? 'yes' : 'no'}
        </div>
    )

}




const MainContent = ({ posts, postsFollowing }) => {

    useEffect(() => {
        postsFollowing()
    }, [])

    console.log(posts);
    return (
        <div>
            {posts.map(p => <Post key={p._id} postData={p} />)}
        </div>
    )
}

export const CMainContent = connect(state => ({ posts: state.promise?.followingPosts?.payload || [] }), { postsFollowing: myFolowingPosts })(MainContent)