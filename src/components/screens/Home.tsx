import React, { useEffect, useReducer, useState } from "react"
import { ModalUnsubscribe } from "../elements/ModalUnsubscribe"
import { PostContainer } from "../elements/PostContainer"
import mufc from '../../images/mufc.jpg'
import therock from '../../images/therock.jpg'
import validate_account from '../../images/validate_account.png'
import liked from '../../images/liked.png'
import moment from 'moment'
import { Post, User } from "../models"
import { API_URI } from "../../App"

const Is_User_Followed = (postUser: User, loggedUser: User) => {
  if (postUser?.followers.find(follower => follower == loggedUser._id) !== undefined) {
    return true
  } else {
    return false
  }
}

const Home = (props: {userInfos: User}) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [sideContainerLeftPosition, setSideContainerLeftPositionState] = useState<number>(0)
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([])
  const [isPostOpen, setPostOpen] = useState<boolean>(false)
  const [isModalSubscribeOpen, setModalSubscribeOpen] = useState<boolean>(false)
  const [selectedPostIndex, setSelectedPostIndex] = useState<number>()
  const [commentText, setCommentText] = useState<string>('')
  const [usersSuggested, setUsersUggested] = useState<User[]>([])

  const { userInfos } = props

  useEffect(() => {
    const Posts_Listing = async (): Promise<void> => {
      const request = await fetch(`${API_URI}/post`)
      const responseJson = await request.json()
      setDisplayedPosts(responseJson)
      const usersToSuggest: any[] = [...new Map(responseJson.map((post: Post, postIndex: number) => [post.user.username, post.user])).values()]
      setUsersUggested(usersToSuggest)
    }
    Posts_Listing()
  }, [])

  const Update_A_Post = (postUpdated: Post): void => {
    let allPosts: Post[] = displayedPosts
    if (typeof selectedPostIndex === 'number') allPosts[selectedPostIndex] = postUpdated
    setDisplayedPosts(allPosts)
    forceUpdate()
  }

  const Like_A_Post = async (index: number | undefined): Promise<void> => {
    const currentIndex = index! | selectedPostIndex!
    displayedPosts[currentIndex].usersWhoLiked.push(userInfos?._id)
    const request = await fetch(`${API_URI}/post/update/${displayedPosts[currentIndex]._id}`, {
      method: "PUT",
      body: JSON.stringify(displayedPosts[currentIndex]),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 200) {
      setDisplayedPosts(displayedPosts)
      forceUpdate()
    }
  }

  const Dislike_A_Post = async (index: number | undefined): Promise<void> => {
    const currentIndex = index! | selectedPostIndex!
    displayedPosts[currentIndex].usersWhoLiked.splice(displayedPosts[currentIndex].usersWhoLiked.indexOf(userInfos?._id))
    const request = await fetch(`${API_URI}/post/update/${displayedPosts[currentIndex]._id}`, {
      method: "PUT",
      body: JSON.stringify(displayedPosts[currentIndex]),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 200) {
      setDisplayedPosts(displayedPosts)
      forceUpdate()
    }
  }

  const Open_A_Post = (index: number): void => {
    setSelectedPostIndex(index)
    setPostOpen(true)
  }

  const Close_A_Post = (): void => {
    setPostOpen(false)
    setSelectedPostIndex(undefined)
  }

  const Like_A_Comment = async (commentIndex: number): Promise<void> => {
    displayedPosts[selectedPostIndex!].comments[commentIndex].usersWhoLiked.push(userInfos?._id)
    const request = await fetch(`${API_URI}/post/comment/update/${displayedPosts[selectedPostIndex!].comments[commentIndex]._id}`, {
      method: "PUT",
      body: JSON.stringify(displayedPosts[selectedPostIndex!].comments[commentIndex]),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 200) {
      setDisplayedPosts(displayedPosts)
      forceUpdate()
    }
  }

  const Dislike_A_Comment = async (commentIndex: number): Promise<void> => {
    displayedPosts[selectedPostIndex!].comments[commentIndex].usersWhoLiked.splice(displayedPosts[selectedPostIndex!].comments[commentIndex].usersWhoLiked.indexOf(userInfos?._id))
    const request = await fetch(`${API_URI}/post/comment/update/${displayedPosts[selectedPostIndex!].comments[commentIndex]._id}`, {
      method: "PUT",
      body: JSON.stringify(displayedPosts[selectedPostIndex!].comments[commentIndex]),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 200) {
      setDisplayedPosts(displayedPosts)
      forceUpdate()
    }
  }

  const Add_A_Comment = async (postId: string): Promise<void> => {
    const request = await fetch(`${API_URI}/post/comment/add`, {
      method: "POST",
      body: JSON.stringify({
        userId: userInfos?._id,
        postId: postId,
        commentText: commentText
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
  }

  const Open_Subscribe_Modal = () => {
    setModalSubscribeOpen(true)
  }

  const Close_Subscribe_Modal = () => {
    setModalSubscribeOpen(false)
  }

  const setSideContainerLeftPosition = (e: any): void => {
    const element_positions = e.currentTarget.getBoundingClientRect()
    const margin_right = 28
    const left_position = element_positions.right + margin_right
    setSideContainerLeftPositionState(left_position)
  }

  const Go_To_Profile = (userId: string): void => {
    window.location.hash = `profile/${userId}`
  }

  return (
    <>
      <div className='content-container home-container'>
        <div className='live-container' onLoad={e => setSideContainerLeftPosition(e)}>
          <div className='stories-container'>
            <div className='stories-box'>
              <div className='stories-box-color flex-center'>
                <div className='stories-box-white flex-center'>
                  <div className='stories-box-img flex-center'>
                    <img src={mufc} />
                  </div>
                </div>
              </div>
              <span className='stories-box-username'>manchester united</span>
            </div>
          </div>
          {
            displayedPosts.map((post, postIndex) => {
              return (
                <div className='post-container' key={postIndex}>
                  <div className='post-header-box'>
                    <div className='post-header-box-poster'>
                      <div className='post-header-box-color flex-center'>
                        <div className='post-header-box-white flex-center'>
                          <div className='post-header-box-img flex-center'>
                            <img src={post.user?.profilePicUrl} />
                          </div>
                        </div>
                      </div>
                      <div className='post-header-box-text'>
                        <span id='title' onClick={() => Go_To_Profile(post.user?._id)}>{post.user?.username}</span>
                        <span id='location'>{post.location}</span>
                      </div>
                    </div>
                    <div className='post-header-box-options'>
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" /><circle cx="4" cy="12" r="2" /><circle cx="20" cy="12" r="2" /></svg>
                    </div>
                  </div>
                  <div className='post-main-box'>
                    {post.images.length > 0 ? <img src={post.images[0].link} /> : undefined}
                  </div>
                  <div className='post-below-box'>
                    <div className='post-below-actions'>
                      {
                        post.usersWhoLiked.find(id => id == userInfos?._id) !== undefined
                        ?
                        <img className='post-below-icon' src={liked} onClick={() => Dislike_A_Post(postIndex)} />
                        :
                        <svg className='post-below-icon' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" onClick={() => Like_A_Post(postIndex)}><path d="m366.763 52.242c-55.361 0-84.61 26.631-109.467 70.722-24.856-44.091-54.105-70.722-109.466-70.722-65.874 0-119.466 53.593-119.466 119.467 0 40.249 13.648 76.775 42.952 114.948 25.864 33.693 62.063 66.07 100.388 100.348 25.502 22.809 51.872 46.395 78.522 73.045 1.953 1.952 4.512 2.929 7.071 2.929 2.56 0 5.118-.977 7.071-2.929 26.688-26.689 53.104-50.305 78.65-73.143 38.32-34.258 74.515-66.616 100.381-100.295 29.308-38.16 42.958-74.672 42.958-114.903-.001-65.874-53.65-119.467-119.594-119.467zm-37.075 319.755c-23.507 21.015-47.744 42.683-72.393 66.901-24.606-24.18-48.797-45.816-72.26-66.801-76.358-68.296-136.672-122.241-136.672-200.388 0-54.847 44.62-99.467 99.466-99.467 46.532 0 71.897 19.322 100.522 76.572 1.694 3.388 5.157 5.528 8.944 5.528 3.788 0 7.25-2.141 8.944-5.528 28.626-57.25 53.991-76.572 100.522-76.572 54.916 0 99.594 44.62 99.594 99.467.001 78.106-60.31 132.024-136.667 200.288z" /></svg>
                      }
                      <svg className='post-below-icon' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m385.621 390.771c39.335-35.996 61.739-86.636 61.739-140.162 0-104.766-85.233-190-190-190s-190 85.234-190 190c0 125.188 119.958 217.084 241.508 182.919 95.322 21.903 90.336 21.081 92.492 21.081 7.419 0 12.269-7.822 8.944-14.473zm-77.032 22.429c-.958 0-1.915.138-2.842.412-109.47 32.448-218.387-50.188-218.387-163.004 0-93.738 76.262-170 170-170s170 76.262 170 170c0 50.256-22.078 97.672-60.573 130.089-3.535 2.978-4.569 7.988-2.503 12.122l18.637 37.271c-75.846-17.41-72.19-16.89-74.332-16.89z" /></svg>
                      <svg className='post-below-icon' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m448.279 66.692c-2.709-2.708-6.725-3.631-10.343-2.378l-367.695 127.279c-3.741 1.295-6.366 4.675-6.694 8.62-.329 3.945 1.701 7.713 5.177 9.608l152.981 83.444 83.444 152.98c1.763 3.23 5.141 5.212 8.776 5.212.276 0 .554-.012.832-.034 3.945-.329 7.326-2.954 8.621-6.694l127.28-367.695c1.252-3.618.328-7.634-2.379-10.342zm-44.885 30.743-176.099 176.098-129.139-70.439zm-91.517 319.378-70.439-129.138 176.099-176.1z" /></svg>
                    </div>
                    <div className='post-below-pagination'></div>
                    <div className='post-below-bookmark'>
                      <svg className='post-below-icon' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m427.36 27.61h-340c-5.523 0-10 4.478-10 10v440c0 4.012 2.398 7.636 6.09 9.204 3.692 1.567 7.965.779 10.853-2.007l163.057-157.302 163.057 157.303c1.902 1.834 4.403 2.803 6.945 2.803 1.318 0 2.646-.261 3.907-.796 3.693-1.568 6.091-5.192 6.091-9.204v-440c0-5.523-4.477-10.001-10-10.001zm-10 426.458-153.057-147.655c-1.937-1.868-4.439-2.803-6.942-2.803s-5.006.935-6.943 2.803l-153.058 147.655v-406.458h320z" /></svg>
                    </div>
                  </div>
                  <div className="post-box-infos-likes">
                    <span>{post.usersWhoLiked?.length} J’aime</span>
                  </div>
                  <div className='main-comment-text'>
                    <p>
                      <span className='title' onClick={() => Go_To_Profile(post.user?._id)}>{post.user?.username}</span>
                      {post.user?.isVerified ? <img id='validate' src={validate_account} /> : undefined}
                      {post.caption}
                    </p>
                  </div>
                  <div className="post-box-infos-display_comments">
                    <span onClick={() => Open_A_Post(postIndex)}>Afficher les {post.comments.length} commentaires</span>
                  </div>
                  <div className='main-comment-text new-comment'>
                    <p>
                      <span className='title'>{post.user?.username}</span>
                      {post.user?.isVerified ? <img id='validate' src={validate_account} /> : undefined}
                      {post.caption}
                    </p>
                  </div>
                  <div className="post-box-infos-time">
                    <span>IL Y A {moment().diff(moment(post.createdAt), 'days')} JOURS</span>
                  </div>
                  <div className="post-box-infos-input">
                    <svg id='smiley' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 295.996 295.996"><g><path d="M147.998,0C66.392,0,0,66.392,0,147.998s66.392,147.998,147.998,147.998s147.998-66.392,147.998-147.998S229.605,0,147.998,0z M147.998,279.996c-36.256,0-69.143-14.696-93.022-38.44c-9.536-9.482-17.631-20.41-23.934-32.42C21.442,190.847,16,170.047,16,147.998C16,75.214,75.214,16,147.998,16c34.523,0,65.987,13.328,89.533,35.102c12.208,11.288,22.289,24.844,29.558,39.996c8.27,17.239,12.907,36.538,12.907,56.9C279.996,220.782,220.782,279.996,147.998,279.996z" /><circle cx="99.666" cy="114.998" r="16" /><circle cx="198.666" cy="114.998" r="16" /><path d="M147.715,229.995c30.954,0,60.619-15.83,77.604-42.113l-13.439-8.684c-15.597,24.135-44.126,37.604-72.693,34.308c-22.262-2.567-42.849-15.393-55.072-34.308l-13.438,8.684c14.79,22.889,39.716,38.409,66.676,41.519C140.814,229.8,144.27,229.995,147.715,229.995z" /></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                    <textarea onChange={e => setCommentText(e.target.value)} placeholder='Ajouter un commentaire...'></textarea>
                    <button disabled={commentText.length == 0} onClick={() => Add_A_Comment(post._id)}>Publier</button>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className='side-container' style={{ left: sideContainerLeftPosition }}>
          <div className='side-profil-box'>
            <img src={userInfos?.profilePicUrl} onClick={() => Go_To_Profile(userInfos?._id)} />
            <div className='side-profil-box-text'>
              <span id='username' onClick={() => Go_To_Profile(userInfos?._id)}>{userInfos?.username}</span>
              <span id='fullname'>{userInfos?.fullName}</span>
            </div>
          </div>
          <div className='suggestions-container'>
            <div className='suggestions-header'>
              <span id='text'>Suggestions pour vous</span>
              <a id='show_all'>Voir tout</a>
            </div>
            <div className='suggestions-boxes'>
            {
              usersSuggested.map((user: User, userIndex: number) => {
                if (user.username != userInfos.username && userIndex <= 5 && !Is_User_Followed(user, userInfos)) {
                  return (
                    <div className='suggestions-box'>
                      <div>
                        <img src={user.profilePicUrl} />
                        <div className='suggestions-box-text'>
                          <a id='title' href={`#/profile/${user._id}`}>{user.username}</a>
                          <span id='subtitle'>{user.fullName}</span>
                        </div>
                      </div>
                      <a className='suggestions-box-sub'>S'abonner</a>
                    </div>
                  )
                }
              })
            }
            </div>
          </div>
        </div>
        {isPostOpen && <PostContainer
          isOpen={isPostOpen} 
          closePost={Close_A_Post} 
          updatePost={Update_A_Post}
          LikePost={Like_A_Post}
          DislikePost={Dislike_A_Post}
          LikeComment={Like_A_Comment}
          DislikeComment={Dislike_A_Comment}
          openModal={Open_Subscribe_Modal}
          postInfos={displayedPosts[selectedPostIndex!]} 
          userInfos={props.userInfos} 
        />}
        <ModalUnsubscribe
          isOpen={isModalSubscribeOpen}
          updatePost={Update_A_Post}
          CloseModal={Close_Subscribe_Modal}
          postInfos={displayedPosts[selectedPostIndex!]} 
          userInfos={props.userInfos} 
        />
      </div>
    </>
  )
}

export default Home