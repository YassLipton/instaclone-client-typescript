import { API_URI } from "../../App"
import { Post, User } from "../models"
import liked from '../../images/liked.png'
import validate_account from '../../images/validate_account.png'
import moment from 'moment'

const Is_User_Followed = (postUser: User, loggedUser: User) => {
  if (postUser?.followers.find(follower => follower == loggedUser._id) !== undefined) {
    return true
  } else {
    return false
  }
}

export const PostContainer = (props: {
  isOpen: boolean,
  closePost: () => void,
  updatePost: (postInfos: Post) => void,
  LikePost: (index: number | undefined) => void,
  DislikePost: (index: number | undefined) => void,
  LikeComment: (commentIndex: number) => void,
  DislikeComment: (commentIndex: number) => void,
  openModal: () => void,
  postInfos: Post,
  userInfos: User
}) => {

  const {
    isOpen,
    closePost,
    updatePost,
    LikePost,
    DislikePost,
    LikeComment,
    DislikeComment,
    openModal,
    postInfos,
    userInfos
  } = props

  const Follow_User = async () => {
    postInfos.user.followers.push(userInfos._id)
    const request = await fetch(`${API_URI}/user/update/${postInfos.user._id}`, {
      method: "PUT",
      body: JSON.stringify(postInfos.user),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    console.log(response)
    if (response.status == 200) {
      updatePost(postInfos)
    }
  }

  const Go_To_Profile = (userId: string) => {
    window.location.hash = `profile/${userId}`
  }

  return (
    <div className='profile-post-opened-fullpage' style={{display: isOpen ? 'flex' : 'none'}}>
      <div className='fullpage-close' onClick={closePost}>
        <svg viewBox="0 0 311 311.07733" xmlns="http://www.w3.org/2000/svg"><path d="m16.035156 311.078125c-4.097656 0-8.195312-1.558594-11.308594-4.695313-6.25-6.25-6.25-16.382812 0-22.632812l279.0625-279.0625c6.25-6.25 16.382813-6.25 22.632813 0s6.25 16.382812 0 22.636719l-279.058594 279.058593c-3.136719 3.117188-7.234375 4.695313-11.328125 4.695313zm0 0" /><path d="m295.117188 311.078125c-4.097657 0-8.191407-1.558594-11.308594-4.695313l-279.082032-279.058593c-6.25-6.253907-6.25-16.386719 0-22.636719s16.382813-6.25 22.636719 0l279.058594 279.0625c6.25 6.25 6.25 16.382812 0 22.632812-3.136719 3.117188-7.230469 4.695313-11.304687 4.695313zm0 0" /></svg>
      </div>
      <article className='profile-post-opened'>
        <div className="post-box">
          <div className='post-box-img'>
            <img src={postInfos?.images[0]?.link} />
          </div>
          <div className='post-box-infos'>
            <div className="post-box-infos-header">
              <div className="post-box-infos-header-main">
                <div className='post-box-infos-image'>
                  <div className='post-box-infos-color flex-center'>
                    <div className='post-box-infos-white flex-center'>
                      <div className='post-box-infos-img flex-center'>
                        <img src={postInfos.user.profilePicUrl} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='post-box-infos-header-text'>
                  <div className='post-box-infos-header-text-row'>
                    <span className='title' onClick={() => Go_To_Profile(postInfos?.user?._id)}>{postInfos?.user?.username}</span>
                    <img id='validate' src={validate_account} />
                    <span id='dot'>•</span>
                    {
                      isOpen && Is_User_Followed(postInfos?.user, userInfos)
                      ?
                      <span id='status' onClick={openModal}>Abonné(e)</span> 
                      :
                      <span id='status' className='follow_from_post' onClick={Follow_User}>S'abonner</span>
                    }
                  </div>
                  <span id='location'>Dubai, United Arab Emiratesدبي</span>
                </div>
              </div>
              <div className='post-box-infos-header-options flex-center'>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2" /><circle cx="4" cy="12" r="2" /><circle cx="20" cy="12" r="2" /></svg>
              </div>
            </div>
            <div className="post-box-infos-comments">
              <div className='main-comment'>
                <div className='post-box-infos-image'>
                  <div className='post-box-infos-color flex-center'>
                    <div className='post-box-infos-white flex-center'>
                      <div className='post-box-infos-img flex-center'>
                        <img src={postInfos.user.profilePicUrl} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='main-comment-text'>
                  <p>
                    <span className='title' onClick={() => Go_To_Profile(postInfos?.user?._id)}>{postInfos?.user?.username}</span>
                    {postInfos?.user?.isVerified ? <img id='validate' src={validate_account} /> : undefined}
                    {postInfos?.caption}
                  </p>
                  <div className='main-comment-below'>
                    <span id='posted_time'>{moment().diff(moment(postInfos?.createdAt), 'days')} j</span>
                  </div>
                </div>
              </div>
            {
              postInfos?.comments?.map((comment, commentIndex) => {
                return (
                  <div className='comment' key={`comment#${commentIndex}`}>
                    <div className='post-box-infos-image'>
                      <div className='post-box-infos-color flex-center'>
                        <div className='post-box-infos-white flex-center'>
                          <div className='post-box-infos-img flex-center'>
                            <img src={comment.user.profilePicUrl} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='comment-text'>
                      <p>
                        <span className='title' onClick={() => Go_To_Profile(comment.user._id)}>{comment.user.username}</span>
                        {/* <img id='validate' src={validate_account} /> */}
                        {comment.text}
                      </p>
                      <div className='comment-below'>
                        <span id='posted_time'>{moment().diff(moment(comment.createdAt), 'days')} j</span>
                        <span id='likes'>{comment.usersWhoLiked.length} mentions J'aime</span>
                        <span id='reply'>Répondre</span>
                      </div>
                    </div>
                    <div className='comment-like'>
                    {
                      comment.usersWhoLiked.find(id => id == userInfos._id) !== undefined
                      ?
                      <img src={liked} onClick={() => DislikeComment(commentIndex)} />
                      :
                      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" onClick={() => LikeComment(commentIndex)}><path d="m366.763 52.242c-55.361 0-84.61 26.631-109.467 70.722-24.856-44.091-54.105-70.722-109.466-70.722-65.874 0-119.466 53.593-119.466 119.467 0 40.249 13.648 76.775 42.952 114.948 25.864 33.693 62.063 66.07 100.388 100.348 25.502 22.809 51.872 46.395 78.522 73.045 1.953 1.952 4.512 2.929 7.071 2.929 2.56 0 5.118-.977 7.071-2.929 26.688-26.689 53.104-50.305 78.65-73.143 38.32-34.258 74.515-66.616 100.381-100.295 29.308-38.16 42.958-74.672 42.958-114.903-.001-65.874-53.65-119.467-119.594-119.467zm-37.075 319.755c-23.507 21.015-47.744 42.683-72.393 66.901-24.606-24.18-48.797-45.816-72.26-66.801-76.358-68.296-136.672-122.241-136.672-200.388 0-54.847 44.62-99.467 99.466-99.467 46.532 0 71.897 19.322 100.522 76.572 1.694 3.388 5.157 5.528 8.944 5.528 3.788 0 7.25-2.141 8.944-5.528 28.626-57.25 53.991-76.572 100.522-76.572 54.916 0 99.594 44.62 99.594 99.467.001 78.106-60.31 132.024-136.667 200.288z" /></svg>
                    }
                    </div>
                  </div>
                )
              })
            }
            </div>
            <div className='post-box-infos-below'>
              <div className='post-box-infos-actions post-below-box'>
                <div className='post-below-actions'>
                {
                  postInfos?.usersWhoLiked.find(id => id == userInfos._id) !== undefined
                  ?
                  <img className='post-below-icon' src={liked} onClick={() => DislikePost(undefined)} />
                  :
                  <svg className='post-below-icon' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" onClick={() => LikePost(undefined)}><path d="m366.763 52.242c-55.361 0-84.61 26.631-109.467 70.722-24.856-44.091-54.105-70.722-109.466-70.722-65.874 0-119.466 53.593-119.466 119.467 0 40.249 13.648 76.775 42.952 114.948 25.864 33.693 62.063 66.07 100.388 100.348 25.502 22.809 51.872 46.395 78.522 73.045 1.953 1.952 4.512 2.929 7.071 2.929 2.56 0 5.118-.977 7.071-2.929 26.688-26.689 53.104-50.305 78.65-73.143 38.32-34.258 74.515-66.616 100.381-100.295 29.308-38.16 42.958-74.672 42.958-114.903-.001-65.874-53.65-119.467-119.594-119.467zm-37.075 319.755c-23.507 21.015-47.744 42.683-72.393 66.901-24.606-24.18-48.797-45.816-72.26-66.801-76.358-68.296-136.672-122.241-136.672-200.388 0-54.847 44.62-99.467 99.466-99.467 46.532 0 71.897 19.322 100.522 76.572 1.694 3.388 5.157 5.528 8.944 5.528 3.788 0 7.25-2.141 8.944-5.528 28.626-57.25 53.991-76.572 100.522-76.572 54.916 0 99.594 44.62 99.594 99.467.001 78.106-60.31 132.024-136.667 200.288z" /></svg>
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
                <span>{postInfos?.usersWhoLiked?.length} J’aime</span>
              </div>
              <div className="post-box-infos-time">
                <span>IL Y A {moment().diff(moment(postInfos?.createdAt), 'days')} JOURS</span>
              </div>
            </div>
            <div className="post-box-infos-input">
              <svg id='smiley' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 295.996 295.996"><g><path d="M147.998,0C66.392,0,0,66.392,0,147.998s66.392,147.998,147.998,147.998s147.998-66.392,147.998-147.998S229.605,0,147.998,0z M147.998,279.996c-36.256,0-69.143-14.696-93.022-38.44c-9.536-9.482-17.631-20.41-23.934-32.42C21.442,190.847,16,170.047,16,147.998C16,75.214,75.214,16,147.998,16c34.523,0,65.987,13.328,89.533,35.102c12.208,11.288,22.289,24.844,29.558,39.996c8.27,17.239,12.907,36.538,12.907,56.9C279.996,220.782,220.782,279.996,147.998,279.996z" /><circle cx="99.666" cy="114.998" r="16" /><circle cx="198.666" cy="114.998" r="16" /><path d="M147.715,229.995c30.954,0,60.619-15.83,77.604-42.113l-13.439-8.684c-15.597,24.135-44.126,37.604-72.693,34.308c-22.262-2.567-42.849-15.393-55.072-34.308l-13.438,8.684c14.79,22.889,39.716,38.409,66.676,41.519C140.814,229.8,144.27,229.995,147.715,229.995z" /></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
              <textarea placeholder='Ajouter un commentaire...'></textarea>
              <button disabled>Publier</button>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}