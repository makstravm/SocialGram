import { actionPromise } from "./actonsCreators";

const getGQL =
  (url) =>
  async (query, variables = {}) => {
    let obj = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.authToken
          ? { Authorization: "Bearer " + localStorage.authToken }
          : sessionStorage.authToken
          ? { Authorization: "Bearer " + sessionStorage.authToken }
          : {}),
      },
      body: JSON.stringify({ query, variables }),
    });
    let a = await obj.json();
    if (!a.data && a.errors) throw new Error(JSON.stringify(a.errors));
    return a.data[Object.keys(a.data)[0]];
  };

export const backURL = "http://hipstagram.node.ed.asmer.org.ua";

export const gql = getGQL(backURL + "/graphql");

//*************** ACTIONS AUTHORIZATION ******************//

export const actionLogIn = (login, password) =>
  actionPromise(
    "login",
    gql(
      `query login($login:String!, $password:String!){
                login(login:$login, password:$password)
            }`,
      { login, password }
    )
  );

export const actionRegister = (login, password) =>
  actionPromise(
    "register",
    gql(
      `mutation rega ($login:String!,           $password:String!){
                                    createUser(login: $login, password: $password){
                                        _id login
                                    }
                                }`,
      { login, password }
    )
  );

//*************** Action ABOUT ME ******************//

export const actionGetAboutMe = (id) =>
  actionPromise(
    "aboutMe",
    gql(
      `query userOned($myID:String!){
                        UserFindOne(query: $myID){
                            _id  login nick
                            avatar { _id url }
                            following{ _id}
                        }
                }`,
      { myID: JSON.stringify([{ _id: id }]) }
    )
  );

export const actionUpsertAboutMe = (myData) =>
  actionPromise(
    "upsertAboutMe",
    gql(
      `mutation editAboutMe($user:UserInput){
                        UserUpsert(user:$user){
                            _id 
                        }
                }`,
      { user: myData }
    )
  );

//*************** Action Posts Tape ******************//

export const actionGetPostsMyFollowing = (skip, myFollowing) =>
  actionPromise(
    "followingPosts",
    gql(
      `query allposts($query: String!){
            PostFind(query:$query){
                _id, text, title
                owner{_id, nick, login, avatar {url}}
                likes { _id owner {_id}}   
                images{ url _id originalFileName }
                comments{_id text  createdAt  owner {_id login nick}}
                createdAt
        }
    }`,
      {
        query: JSON.stringify([
          {
            ___owner: { $in: myFollowing },
          },
          {
            sort: [{ _id: -1 }],
            skip: [skip || 0],
            limit: [10],
          },
        ]),
      }
    )
  );

export const actionGetPostsTapeCount = (_id) =>
  actionPromise(
    "userPostsCount",
    gql(
      ` query userPostsCount($id:String!){
                PostCount(query:$id)
                }`,
      { id: JSON.stringify([{ ___owner: { $in: _id } }]) }
    )
  );

//*************** Action Profile Data ******************//

export const actionGetProfileData = (_id) =>
  actionPromise(
    "userOneData",
    gql(
      ` query userOned($id:String!){
                        UserFindOne(query: $id){
                            _id  login nick
                            avatar { _id url }     
                            createdAt
                            followers {_id }
                            following {_id }}
                
            } `,
      { id: JSON.stringify([{ _id }]) }
    )
  );

export const actionGetProfilePagePosts = (_id, skip) =>
  actionPromise(
    "profilePosts",
    gql(
      ` query userOned($id:String!){
                    PostFind(query:$id){
                        _id   images{ url _id originalFileName }
                    }
                }`,
      {
        id: JSON.stringify([
          {
            ___owner: _id,
          },
          {
            sort: [{ _id: -1 }],
            skip: [skip || 0],
            limit: [24],
          },
        ]),
      }
    )
  );

//****************---All FIND POSTS---*************************//

export const actionGetAllPosts = (skip) =>
  actionPromise(
    "allPosts",
    gql(
      ` query allPosts($id:String!){
                PostFind(query:$id){
                    _id   images{url _id originalFileName}
                }
            }`,
      {
        id: JSON.stringify([
          {},
          {
            sort: [{ _id: -1 }],
            skip: [skip || 0],
            limit: [36],
          },
        ]),
      }
    )
  );

export const actionAllPostsCount = () =>
  actionPromise(
    "userPostsCount",
    gql(
      ` query userPostsCount($id:String!){
                PostCount(query:$id)
                }`,
      { id: JSON.stringify([{}]) }
    )
  );

//****************---Action getAllUsers ---*************************//

export const actionGetAllUsers = (value) =>
  actionPromise(
    "findUsersAll",
    gql(
      `query findUsersAll($query:String!) {
                                UserFind(query: $query) {
                                    _id login nick 
                                    avatar { _id url } 
                                }
    }`,
      {
        query: JSON.stringify([
          {
            $or: [{ nick: `/${value}/` }, { login: `/${value}/` }],
          },
          {
            sort: [{ login: 1 }],
          },
        ]),
      }
    )
  );

//****************---Action Like Post ---*************************//

export const actionOnLikePost = (_id) =>
  actionPromise(
    "onLikePost",
    gql(
      `mutation LikePost($like:LikeInput){
        LikeUpsert(like:$like){
            _id
        }
    }`,
      { like: { post: { _id } } }
    )
  );

export const actionDelLikePost = (_id) =>
  actionPromise(
    "delLikePost",
    gql(
      `mutation LikeRemove($like:LikeInput){
            LikeDelete(like:$like){
                _id
            }
        }`,
      { like: { _id } }
    )
  );

export const actionGetMyLikePosts = (findId) =>
  actionPromise(
    "getMyLikes",
    gql(
      `query likeFindPost ($id:String!){
        PostFindOne(query:$id){
        likes { _id owner {_id}}
        }
    }`,
      { id: JSON.stringify([{ _id: findId }]) }
    )
  );

export const actionGetPostUsersLiked = (_id) =>
  actionPromise(
    "usersPostLiked",
    gql(
      ` query usersPostLiked($id:String!) {
                                        LikeFind(query:$id){
                                          owner { _id nick login
                                                avatar{_id url}
                                    }
                }
            } `,
      { id: JSON.stringify([{ "post._id": _id }]) }
    )
  );

//****************---Action Like Comment ---*************************//

export const actionOnLikeComment = (_id) =>
  actionPromise(
    "likePost",
    gql(
      `mutation LikePost($like:LikeInput){
        LikeUpsert(like:$like){
            _id
        }
    }`,
      { like: { comment: { _id } } }
    )
  );

export const actionDelLikeComment = (_id) =>
  actionPromise(
    "removelikeComment",
    gql(
      `mutation LikeRemove($like:LikeInput){
            LikeDelete(like:$like){_id}
        }`,
      { like: { _id } }
    )
  );

export const actionGetLikeComment = (commentId) =>
  actionPromise(
    "findLikeComment",
    gql(
      `query findLikeComment ($id:String!){
        CommentFindOne(query:$id){
        likes { _id owner {_id}}
        }
    }`,
      { id: JSON.stringify([{ _id: commentId }]) }
    )
  );

//****************---Collection---*************************//

export const actionGetMyCollection = (_id) =>
  actionPromise(
    "getMyCollection",
    gql(
      `query getCollections($id:String! ){
        CollectionFindOne(query:$id){
        _id posts{ _id }
        }
    }`,
      { id: JSON.stringify([{ ___owner: _id }]) }
    )
  );

export const actionUpsertPostsInCollections = (collectionId, newCollection) =>
  actionPromise(
    "addInCollections",
    gql(
      `mutation addInCollections($collection:CollectionInput ){
        CollectionUpsert(collection:$collection){
            _id 
        }
    }`,
      { collection: { _id: collectionId, posts: newCollection } }
    )
  );

export const actionGetPostsMyCollection = (_id, skip) =>
  actionPromise(
    "onLoadMyCollections",
    gql(
      `query loadCollections($id:String! ){
       CollectionFind(query:$id){
         posts { _id  images{ _id url originalFileName}}
        }
    }`,
      {
        id: JSON.stringify([
          { _id },
          {
            sort: [{ _id: -1 }],
            skip: [skip || 0],
            limit: [36],
          },
        ]),
      }
    )
  );

//****************---Action Subscribe ---*************************//

export const actionChangeSubscribed = (newFollowing) =>
  actionPromise(
    "subscribe",
    gql(
      `mutation following($user:UserInput){
        UserUpsert( user:$user){
            following{_id}
        }
      }`,
      { user: newFollowing }
    )
  );

export const actiongetMyFollowing = (_id) =>
  actionPromise(
    "upDateFollowing",
    gql(
      ` query followers($id:String!){
        UserFindOne(query: $id){
                            following {_id}
        }
    }`,
      { id: JSON.stringify([{ _id }]) }
    )
  );

export const actionGetUserFollowers = (_id) =>
  actionPromise(
    "upDateFollowers",
    gql(
      ` query followers($id:String!){
        UserFindOne(query: $id){
                            followers {_id nick login}
        }
    }`,
      { id: JSON.stringify([{ _id }]) }
    )
  );

//****************---Action Comments ---*************************//

export const actionAddComment = (postId, text) =>
  actionPromise(
    "addcomment",
    gql(
      `mutation addcomment($comment: CommentInput ){
        CommentUpsert(comment:$comment){
            _id text
        }
    }`,
      { comment: { post: { _id: postId }, text } }
    )
  );

export const actionGetCommentPost = (findId) =>
  actionPromise(
    "commentPost",
    gql(
      `query commentFindPost ($id:String!){
        PostFindOne(query:$id){
            comments {
                _id text createdAt 
                owner{
                    _id nick login
                    avatar{
                        _id url
                        }
                    } 
                    likes{_id}
                }
        }
    }`,
      { id: JSON.stringify([{ _id: findId }]) }
    )
  );

export const actionGetSubComment = (commentId) =>
  actionPromise(
    "subComments",
    gql(
      `query commentFindOne ($id:String!){
                                CommentFindOne(query:$id){
                                _id text answers { 
                                        _id text
                                        post {_id }
                                        answers { _id}
                                        createdAt
                                        likes { _id owner { _id login nick } }
                                        owner {
                                            _id login nick 
                                            avatar { url } 
                                            } 
                                        }
                                } 
                            }`,
      {
        id: JSON.stringify([{ _id: commentId }]),
      }
    )
  );

export const actionSubAddComment = (commentId, text) =>
  actionPromise(
    "addSubcomment",
    gql(
      `mutation addSubcomment($comment: CommentInput ){
        CommentUpsert(comment:$comment){
            _id text
        }
    }`,
      { comment: { answerTo: { _id: commentId }, text } }
    )
  );

export const actionGetCommentOne = (findId) =>
  actionPromise(
    "subComments",
    gql(
      `query commentFindOne ($id:String!){
        CommentFindOne(query:$id){
       _id text 
        } 
    }`,
      {
        id: JSON.stringify([{ _id: findId }]),
      }
    )
  );

export const actionEditComment = (commentId, text) =>
  actionPromise(
    "editcomment",
    gql(
      `mutation addSubcomment($comment: CommentInput ){
        CommentUpsert(comment:$comment){
            _id text
        }
    }`,
      { comment: { _id: commentId, text } }
    )
  );

//****************---Action Udate Avatar ---*************************//

export const actionSetAvatar = (file, id) =>
  actionPromise(
    "uploadPhoto",
    gql(
      `mutation avaUpsert($ava: UserInput){
                UserUpsert(user: $ava){
                    _id avatar {_id}
                }
            }`,
      { ava: { _id: id, avatar: { _id: file._id } } }
    )
  );

export const actionGetAvatar = (id) =>
  actionPromise(
    "uploadPhoto",
    gql(
      `query userOned($myID: String!){
        UserFindOne(query: $myID) {
                            avatar { _id url }
        }
    }`,
      { myID: JSON.stringify([{ _id: id }]) }
    )
  );

//****************--- Get user FOllowing/Follovwrs---*************************//

export const actionGetFindFollowing = (_id) =>
  actionPromise(
    "findFollow",
    gql(
      ` query findFollowing($id:String!){
                        UserFindOne(query: $id){
                            following {
                                _id nick login
                                avatar { _id url }
                                followers{_id}
                            }
                }
            } `,
      { id: JSON.stringify([{ _id }]) }
    )
  );

export const actionGetFindFollowers = (_id) =>
  actionPromise(
    "findFollow",
    gql(
      ` query findFollowers($id:String!){
                        UserFindOne(query: $id){
                            followers {
                                _id  nick login
                                avatar { _id url }
                                followers{_id}
                            }
                }
            } `,
      { id: JSON.stringify([{ _id }]) }
    )
  );

//****************--- Create / Edit Post ---*************************/

export const actionCreatOrEditPost = (upSertPostObj) =>
  actionPromise(
    "sentPost",
    gql(
      `mutation sentPost($post: PostInput){
              PostUpsert(post: $post){
                    _id images{_id url originalFileName}
                }
            }`,
      { post: upSertPostObj }
    )
  );
