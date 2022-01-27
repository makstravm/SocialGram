export const queries = {
    "/post/:id": match => ({
        name: 'postOne',
        query: `query post($id:String!) {
                    PostFindOne(query:$id) {
                        _id createdAt title text 
                        images{_id url originalFileName}
                        comments {
                            _id createdAt text 
                            likes { _id owner {_id}}   
                            owner {_id login nick
                                    avatar {url}
                                }
                            answers{
                                _id 
                                }
                               answerTo{_id} 
                            }
                        likes{ _id
                            owner{_id}
                        }
                        owner {_id login nick
                            avatar {url}
                            }
                        }
                    }`,
        variables: {
            id: JSON.stringify([{ _id: match.params.id }])
        }
    }),
}

