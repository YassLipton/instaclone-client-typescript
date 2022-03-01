import React, { useEffect, useReducer, useState } from 'react'
import validate_account from '../../images/validate_account.png'
import { useParams } from 'react-router-dom'
import { Post, User } from '../models'
import { PostContainer } from '../elements/PostContainer'
import { ModalUnsubscribe } from '../elements/ModalUnsubscribe'
import { API_URI } from '../../App'

const Is_User_Followed = (postUser: User, loggedUser: User): boolean => {
  if (postUser?.followers.find(follower => follower == loggedUser._id) !== undefined) {
    return true
  } else {
    return false
  }
}

interface ParamTypes {
  id: string
}

const Profile = (props: {userInfos: User}) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [userDetails, setUserDetails] = useState<User>()
  const [allUserPosts, setAllUserPosts] = useState<Post[]>([])
  const [isPostOpen, setPostOpen] = useState<boolean>(false)
  const [isModalSubscribeOpen, setModalSubscribeOpen] = useState<boolean>(false)
  const [selectedPostIndex, setSelectedPostIndex] = useState<number>()

  const { userInfos } = props

  const { id } = useParams<ParamTypes>()

  useEffect(() => {
    const User_Details = async (id: string): Promise<void> => {
      const request = await fetch(`${API_URI}/user/${id}`)
      const responseJson = await request.json()
      setUserDetails(responseJson)
    }
    const Posts_Listing = async (id: string): Promise<void> => {
      const request = await fetch(`${API_URI}/post/listByUser/${id}`)
      const responseJson = await request.json()
      setAllUserPosts(responseJson)
    }
    window.addEventListener('hashchange', (e) => {
      const newId = e.newURL.split('/')[e.newURL.split('/').length - 1]
      console.log(newId)
      User_Details(newId)
      Posts_Listing(newId)
    })
    User_Details(id)
    Posts_Listing(id)
    setLoading(false)
  }, [])

  const Update_A_Post = (postUpdated: Post): void => {
    let allPosts = allUserPosts
    allPosts[selectedPostIndex!] = postUpdated
    setAllUserPosts(allPosts)
    forceUpdate()
  }

  const Like_A_Post = async (index: number | undefined): Promise<void> => {
    const currentIndex = index! | selectedPostIndex!
    allUserPosts[currentIndex].usersWhoLiked.push(userInfos._id)
    const request = await fetch(`${API_URI}/post/update/${allUserPosts[currentIndex]._id}`, {
      method: "PUT",
      body: JSON.stringify(allUserPosts[currentIndex]),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 200) {
      setAllUserPosts(allUserPosts)
      forceUpdate()
    }
  }

  const Dislike_A_Post = async (index: number | undefined): Promise<void> => {
    const currentIndex = index! | selectedPostIndex!
    allUserPosts[currentIndex].usersWhoLiked.splice(allUserPosts[currentIndex].usersWhoLiked.indexOf(userInfos._id))
    const request = await fetch(`${API_URI}/post/update/${allUserPosts[currentIndex]._id}`, {
      method: "PUT",
      body: JSON.stringify(allUserPosts[currentIndex]),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 200) {
      setAllUserPosts(allUserPosts)
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
    allUserPosts[selectedPostIndex!].comments[commentIndex].usersWhoLiked.push(userInfos._id)
    const request = await fetch(`${API_URI}/post/comment/update/${allUserPosts[selectedPostIndex!].comments[commentIndex]._id}`, {
      method: "PUT",
      body: JSON.stringify(allUserPosts[selectedPostIndex!].comments[commentIndex]),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 200) {
      setAllUserPosts(allUserPosts)
      forceUpdate()
    }
  }

  const Dislike_A_Comment = async (commentIndex: number): Promise<void> => {
    allUserPosts[selectedPostIndex!].comments[commentIndex].usersWhoLiked.splice(allUserPosts[selectedPostIndex!].comments[commentIndex].usersWhoLiked.indexOf(userInfos._id))
    const request = await fetch(`${API_URI}/post/comment/update/${allUserPosts[selectedPostIndex!].comments[commentIndex]._id}`, {
      method: "PUT",
      body: JSON.stringify(allUserPosts[selectedPostIndex!].comments[commentIndex]),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 200) {
      setAllUserPosts(allUserPosts)
      forceUpdate()
    }
  }

  const Open_Subscribe_Modal = (): void => {
    setModalSubscribeOpen(true)
  }

  const Close_Subscribe_Modal = (): void => {
    setModalSubscribeOpen(false)
  }

  const Follow_User = async (): Promise<void> => {
    userDetails?.followers.push(userInfos._id)
    const request = await fetch(`${API_URI}/user/update/${userDetails?._id}`, {
      method: "PUT",
      body: JSON.stringify(userDetails),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    console.log(response)
    if (response.status == 200) {
      userInfos.following.push(userDetails?._id || '')
      const request2 = await fetch(`${API_URI}/user/update/${userInfos._id}`, {
        method: "PUT",
        body: JSON.stringify({
          following: userInfos.following
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const response2 = await request2
      const responseJson2 = await request2.json()
      if (response2.status == 200) {
        localStorage.setItem('userToken', responseJson2.accessToken)
      }
      setUserDetails(userDetails)
      forceUpdate()
    }
  }

  const Unfollow_User = async () => {
    if (userDetails) {
      const id = userDetails._id
      const index = userDetails.followers.indexOf(id)
      userDetails?.followers.splice(index, 1)
      const request = await fetch(`${API_URI}/user/update/${userDetails?._id}`, {
        method: "PUT",
        body: JSON.stringify({
          followers: userDetails.followers
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const response = await request
      if (response.status == 200) {
        const id = userInfos._id
        const index = userInfos.following.indexOf(id)
        userInfos?.following.splice(index, 1)
        setUserDetails(userDetails)
        forceUpdate()
        const request = await fetch(`${API_URI}/user/update/${userInfos?._id}`, {
          method: "PUT",
          body: JSON.stringify({
            following: userInfos.following
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const response = await request
        if (response.status == 200) {
          const responseJson = await request.json()
          localStorage.setItem('userToken', responseJson.accessToken)
          Close_Subscribe_Modal()
        }
      }
    }
  }
  
  return (
    <>
    {
      !isLoading && userDetails
      ?
      <div className='content-container profile-container'>
        <div className='profile-header-container'>
          <div className='profile-header-image'>
            <div className='profile-header-color flex-center'>
              <div className='profile-header-white flex-center'>
                <div className='profile-header-img flex-center'>
                  <img src={userDetails?.profilePicUrl} />
                </div>
              </div>
            </div>
          </div>
          <div className='profile-header-box'>
            <div className='profile-header-box-title-row'>
              <h2>{userDetails.username}</h2>
              {userDetails.isVerified ? <img id='validate' src={validate_account} /> : undefined}
              {
                userInfos._id !== id
                ?
                userDetails && Is_User_Followed(userDetails, userInfos)
                ?
                <>
                  <button>Contacter</button>
                  <button id='already_sub' onClick={Open_Subscribe_Modal}>
                    <span>
                      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="8" r="7"/><path d="m20.97 17h-9.94a8.04 8.04 0 0 0 -8.03 8.03v4.97a1 1 0 0 0 1 1h24a1 1 0 0 0 1-1v-4.97a8.04 8.04 0 0 0 -8.03-8.03z"/></svg>
                      <svg fill="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m20.6136 5.64877c.4199.36742.458 1.00751.0845 1.42204l-10.5139 11.66979c-.37544.4167-1.02006.4432-1.42843.0588l-6.08403-5.7276c-.37942-.3572-.41574-.9524-.09021-1.3593.3592-.449 1.02811-.5108 1.4556-.1263l4.72039 4.2459c.41022.369 1.04179.336 1.41138-.0737l9.0435-10.02691c.3659-.40576.99-.44254 1.4012-.08272z"/></svg>
                    </span>
                  </button>
                  <button>
                    <span>
                      <svg id='arrow' viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path id="Down_Arrow_3_" d="m64 88c-1.023 0-2.047-.391-2.828-1.172l-40-40c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0l37.172 37.172 37.172-37.172c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656l-40 40c-.781.781-1.805 1.172-2.828 1.172z"/></svg>
                    </span>
                  </button>
                  <div id='options_btn'>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2"/><circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/></svg>
                  </div>
                </>
                :
                <>
                  <button id='subscribe' onClick={Follow_User}>S'abonner</button>
                  <button id='colored'>
                    <span>
                      <svg id='arrow' viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path id="Down_Arrow_3_" d="m64 88c-1.023 0-2.047-.391-2.828-1.172l-40-40c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0l37.172 37.172 37.172-37.172c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656l-40 40c-.781.781-1.805 1.172-2.828 1.172z"/></svg>
                    </span>
                  </button>
                  <div id='options_btn'>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2"/><circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/></svg>
                  </div>
                </>
                :
                <>
                <button id='edit_profile'>Modifier profil</button>
                <div id='options_btn'>
                  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m452.738 196.61h-24.747c-1.889-5-4.215-10.95-7.021-16.815l17.598-17.574c1.878-1.878 2.938-4.427 2.936-7.083-.003-2.657-1.051-5.203-2.934-7.077l-72.005-71.669c-3.908-3.889-10.177-3.881-14.075.018l-17.225 17.325c-5.578-2.555-11.904-4.885-16.904-6.97v-24.532c0-5.523-4.877-9.623-10.399-9.623h-101.563c-5.523 0-10.04 4.1-10.04 9.623v24.532c-6 2.105-11.476 4.423-16.841 6.934l-17.606-17.347c-3.915-3.853-10.202-3.829-14.085.055l-71.668 71.667c-3.883 3.883-3.908 10.167-.056 14.081l17.346 17.615c-2.511 5.364-4.829 10.841-6.934 16.841h-24.533c-5.523 0-9.622 4.517-9.622 10.04v101.562c0 5.522 4.099 10.398 9.622 10.398h24.533c2.085 5 4.415 11.32 6.97 16.896l-17.325 17.117c-3.898 3.898-3.906 10.201-.018 14.109l71.668 71.996c1.874 1.883 4.42 2.881 7.076 2.881h.013c2.652 0 5.186-.988 7.062-2.863l17.584-17.529c5.865 2.807 11.815 5.136 16.815 7.024v24.747c0 5.522 4.517 9.621 10.04 9.621h101.562c5.522 0 10.399-4.099 10.399-9.621v-24.741c5-1.856 10.68-4.19 16.879-7.099l17.094 17.541c1.87 1.899 4.422 2.92 7.088 2.92h.04c2.651 0 5.195-.976 7.071-2.851l72.029-71.952c1.885-1.885 2.939-4.42 2.929-7.086s-1.086-5.167-2.985-7.037l-17.574-17.196c2.908-6.198 5.21-11.878 7.066-16.878h24.741c5.522 0 9.622-4.876 9.622-10.398v-101.562c-.001-5.523-4.1-10.04-9.623-10.04zm-10.378 102h-21.675c-4.465 0-8.387 2.761-9.613 7.054-2.313 8.096-5.771 16.36-11.213 27.246-1.938 3.876-1.156 8.56 1.933 11.599l15.512 15.26-57.761 57.773-15.233-15.505c-3.04-3.088-7.674-3.868-11.55-1.93-10.885 5.442-19.249 8.9-27.347 11.214-4.293 1.227-7.053 5.15-7.053 9.615v21.674h-82v-21.674c0-4.465-2.94-8.387-7.233-9.613-8.239-2.354-17.033-5.997-26.925-11.141-3.871-2.013-8.6-1.281-11.685 1.804l-15.6 15.607-57.562-57.839 15.276-15.252c3.043-3.044 3.798-7.645 1.873-11.494-4.433-8.865-8.238-18.104-11.309-27.658-1.329-4.135-5.176-6.74-9.52-6.74h-21.315v-82h21.314c4.344 0 8.191-2.784 9.52-6.92 3.156-9.817 6.937-18.969 11.237-27.238 2-3.845 1.295-8.54-1.745-11.628l-15.372-15.618 57.638-57.639 15.616 15.371c3.088 3.04 7.78 3.744 11.623 1.745 8.273-4.302 17.434-8.083 27.249-11.237 4.136-1.33 6.92-5.177 6.92-9.521v-21.315h82v21.315c0 4.344 2.605 8.191 6.74 9.521 9.553 3.07 18.691 6.874 27.56 11.308 3.85 1.925 8.5 1.171 11.543-1.873l15.275-15.277 57.852 57.561-15.601 15.597c-3.085 3.085-3.813 7.809-1.801 11.68 5.144 9.892 8.788 18.696 11.142 26.935 1.227 4.293 5.15 7.233 9.615 7.233h21.675z"/><path d="m257.204 119.772c-75.919 0-137.683 61.764-137.683 137.683 0 76.091 61.764 137.995 137.683 137.995 76.091 0 137.995-61.904 137.995-137.995 0-75.919-61.904-137.683-137.995-137.683zm0 255.678c-64.891 0-117.683-52.933-117.683-117.995 0-64.891 52.792-117.683 117.683-117.683 65.063 0 117.995 52.792 117.995 117.683 0 65.063-52.932 117.995-117.995 117.995z"/></svg>
                </div>
                </>
              }
            </div>
            <div className='profile-header-box-count-row'>
              <div>
                <span id='count'>{allUserPosts?.length}</span>
                <label id='text'> publications</label>
              </div>
              <div>
                <span id='count'>{userDetails?.followers?.length}</span>
                <label id='text'> abonnés</label>
              </div>
              <div>
                <span id='count'>{userDetails?.following?.length}</span>
                <label id='text'> abonnements</label>
              </div>
            </div>
            <div className='profile-header-box-bio-col'>
              <span className='bio-username'>{userDetails?.fullName}</span>
              <span className='bio-text'>{userDetails.bio}</span>
              <a className='bio-link'>{userDetails.link}</a>
            </div>
            <span className='profile-header-box-followers'><span id='username'>yassmald</span> est abonné(e)</span>
          </div>
        </div>
        <div className='profile-post-container'>
          <div className='profile-post-links-row'>
            <div className='post-link active'>
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m422.36 82.61h-330c-5.523 0-10 4.477-10 10v330c0 5.522 4.477 10 10 10h330c5.522 0 10-4.478 10-10v-330c0-5.523-4.477-10-10-10zm-320 130h90v90h-90zm110 0h90v90h-90zm110 0h90v90h-90zm90-20h-90v-90h90zm-110 0h-90v-90h90zm-200-90h90v90h-90zm0 220h90v90h-90zm110 0h90v90h-90zm200 90h-90v-90h90z"/></svg>
              <span>Publications</span>
            </div>
            <div className='post-link'>
              <svg viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg"><g><g><g><g><path d="m210.26 318.06c-.89 0-1.77-.2-2.59-.62l-3.77-1.9c-43.32-21.83-94.35-24.93-139.99-8.5-1.76.64-3.73.37-5.26-.71-1.54-1.08-2.45-2.84-2.45-4.71v-210.83c0-2.43 1.52-4.6 3.81-5.42 24.3-8.75 49.69-12.39 75.47-10.82s50.54 8.25 73.61 19.88l3.77 1.9c1.94.98 3.17 2.97 3.17 5.14v210.83c0 2-1.04 3.86-2.74 4.9-.93.57-1.98.86-3.03.86zm-86.4-33.04c3.86 0 7.73.12 11.61.35 24.08 1.46 47.28 7.39 69.03 17.64v-198l-.61-.31c-42.12-21.23-91.52-24.75-136.18-9.82v198.72c18.25-5.7 37.07-8.58 56.15-8.58z"/></g><g><path d="m171.41 216.44c-.33 0-.67-.03-1.01-.09-22.47-3.97-45.57-5.01-68.66-3.09-3.17.27-5.95-2.09-6.22-5.26s2.09-5.95 5.26-6.22c24.08-2 48.17-.91 71.62 3.23 3.13.55 5.22 3.54 4.67 6.67-.49 2.79-2.92 4.76-5.66 4.76z"/></g><g><path d="m171.24 239.83c-.33 0-.67-.03-1.01-.09-22.47-3.97-45.57-5.01-68.66-3.09-3.17.26-5.95-2.09-6.22-5.26-.26-3.17 2.09-5.95 5.26-6.22 24.08-2 48.17-.92 71.62 3.23 3.13.55 5.22 3.54 4.67 6.67-.49 2.8-2.91 4.76-5.66 4.76z"/></g><g><path d="m171.08 263.23c-.33 0-.67-.03-1.01-.09-22.47-3.97-45.57-5.01-68.66-3.09-3.17.26-5.95-2.09-6.22-5.26-.26-3.17 2.09-5.95 5.26-6.22 24.08-2 48.17-.92 71.62 3.23 3.13.55 5.22 3.54 4.67 6.67-.49 2.8-2.92 4.76-5.66 4.76z"/></g><g><path d="m249.02 216.44c-2.74 0-5.17-1.96-5.67-4.76-.55-3.13 1.54-6.12 4.67-6.67 23.45-4.14 47.54-5.23 71.62-3.23 3.17.26 5.53 3.05 5.26 6.22-.26 3.17-3.04 5.53-6.22 5.26-23.09-1.92-46.19-.88-68.66 3.09-.32.06-.66.09-1 .09z"/></g><g><path d="m249.19 239.83c-2.74 0-5.17-1.96-5.67-4.76-.55-3.13 1.54-6.12 4.67-6.67 23.45-4.14 47.54-5.23 71.62-3.23 3.17.26 5.53 3.05 5.26 6.22-.26 3.17-3.05 5.52-6.22 5.26-23.09-1.92-46.19-.88-68.66 3.09-.33.07-.67.09-1 .09z"/></g><g><path d="m249.36 263.23c-2.74 0-5.17-1.96-5.67-4.76-.55-3.13 1.54-6.12 4.67-6.67 23.45-4.14 47.54-5.23 71.62-3.23 3.17.26 5.53 3.05 5.26 6.22-.26 3.17-3.04 5.52-6.22 5.26-23.09-1.92-46.19-.88-68.66 3.09-.33.06-.67.09-1 .09z"/></g><g><path d="m210.26 347.29c-6.86 0-13.73-1.58-19.98-4.73-4.01-2.02-8.17-3.88-12.37-5.53-17.05-6.69-35.69-10.22-53.89-10.22-17.04 0-33.82 2.93-49.86 8.7l-27.09 9.75c-4.83 1.74-10.22 1.02-14.42-1.94-4.2-2.95-6.71-7.78-6.71-12.91v-217.69c0-3.18 2.58-5.76 5.76-5.76h28.94c3.18 0 5.76 2.58 5.76 5.76s-2.58 5.76-5.76 5.76h-23.18v211.92c0 1.41.66 2.68 1.81 3.49s2.57 1 3.89.52l27.09-9.75c17.3-6.23 35.38-9.38 53.76-9.38 19.63 0 39.72 3.81 58.1 11.02 4.54 1.78 9.03 3.79 13.35 5.97 9.26 4.67 20.33 4.67 29.59 0 4.32-2.18 8.82-4.19 13.35-5.97 18.38-7.21 38.47-11.02 58.1-11.02 18.38 0 36.47 3.16 53.76 9.39l27.09 9.75c1.32.48 2.74.29 3.89-.52s1.81-2.08 1.81-3.49v-211.93h-22.8c-3.18 0-5.76-2.58-5.76-5.76s2.58-5.76 5.76-5.76h28.57c3.18 0 5.76 2.58 5.76 5.76v217.68c0 5.13-2.51 9.96-6.71 12.91s-9.59 3.67-14.42 1.94l-27.09-9.75c-16.04-5.77-32.82-8.7-49.86-8.7-18.2 0-36.84 3.54-53.89 10.22-4.2 1.65-8.37 3.51-12.37 5.53-6.25 3.16-13.12 4.74-19.98 4.74z"/></g><g><path d="m210.26 318.06c-1.05 0-2.1-.29-3.02-.86-1.7-1.05-2.74-2.9-2.74-4.9v-210.83c0-2.18 1.23-4.16 3.17-5.14l3.77-1.9c23.06-11.62 47.83-18.31 73.61-19.88s51.17 2.08 75.47 10.82c2.29.82 3.81 2.99 3.81 5.42v210.83c0 1.88-.91 3.63-2.45 4.71s-3.5 1.34-5.26.71c-45.64-16.43-96.67-13.33-139.99 8.5l-3.77 1.9c-.82.41-1.71.62-2.6.62zm5.76-213.04v198c21.75-10.25 44.95-16.18 69.03-17.64 23.07-1.4 45.82 1.37 67.76 8.23v-198.72c-44.66-14.92-94.06-11.41-136.18 9.82z"/></g><g><g><g><path d="m283.74 186.26c-22.64 0-41.05-18.42-41.05-41.05s18.42-41.05 41.05-41.05 41.05 18.42 41.05 41.05c.01 22.64-18.41 41.05-41.05 41.05zm0-70.59c-16.29 0-29.54 13.25-29.54 29.54s13.25 29.54 29.54 29.54 29.54-13.25 29.54-29.54-13.25-29.54-29.54-29.54z"/></g><g><path d="m273.65 161.06c-1.47 0-2.95-.56-4.07-1.69-2.25-2.25-2.25-5.9 0-8.15l20.19-20.19c2.25-2.25 5.9-2.25 8.15 0s2.25 5.9 0 8.15l-20.19 20.19c-1.13 1.13-2.61 1.69-4.08 1.69z"/></g><g><path d="m293.84 161.06c-1.47 0-2.95-.56-4.07-1.69l-20.19-20.19c-2.25-2.25-2.25-5.9 0-8.15s5.9-2.25 8.15 0l20.19 20.19c2.25 2.25 2.25 5.9 0 8.15-1.14 1.13-2.61 1.69-4.08 1.69z"/></g></g><g><g><path d="m136.78 186.26c-22.64 0-41.06-18.42-41.06-41.05s18.42-41.05 41.05-41.05 41.05 18.42 41.05 41.05c.01 22.64-18.4 41.05-41.04 41.05zm0-70.59c-16.29 0-29.54 13.25-29.54 29.54s13.25 29.54 29.54 29.54 29.54-13.25 29.54-29.54-13.26-29.54-29.54-29.54z"/></g><g><path d="m130.74 163.07c-1.47 0-2.95-.56-4.07-1.69l-8.12-8.12c-2.25-2.25-2.25-5.9 0-8.15s5.9-2.25 8.15 0l4.04 4.04 16.11-16.11c2.25-2.25 5.9-2.25 8.15 0s2.25 5.9 0 8.15l-20.19 20.19c-1.12 1.13-2.59 1.69-4.07 1.69z"/></g></g></g></g></g></g></svg>
              <span>GUIDES</span>
            </div>
            <div className='post-link'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><g id="object_3_"><g><path d="M416.78,0H95.22C42.657,0.061,0.061,42.657,0,95.22v321.56c0.061,52.563,42.657,95.159,95.22,95.22h321.56 c52.563-0.061,95.159-42.657,95.22-95.22V95.22C511.939,42.657,469.343,0.061,416.78,0z M476.655,95.22v30.871h-89.539 l-66.966-90.746h96.631C449.833,35.382,476.618,62.167,476.655,95.22z M276.222,35.345l66.966,90.746H235.778l-66.966-90.746 H276.222z M35.345,95.22c0.037-33.052,26.822-59.837,59.875-59.875h29.665l66.966,90.746H35.345V95.22z M416.78,476.655H95.22 c-33.052-0.037-59.837-26.822-59.875-59.875V161.437h441.31V416.78C476.617,449.832,449.832,476.617,416.78,476.655z"/></g><g><path d="M350.289,303.74l-139.815-80.722c-8.453-4.88-19.261-1.984-24.141,6.469c-1.551,2.687-2.368,5.734-2.368,8.837v161.445 c0,9.76,7.912,17.673,17.672,17.673c3.102,0,6.15-0.816,8.837-2.368l139.815-80.723c8.453-4.88,11.349-15.688,6.469-24.141 C355.206,307.522,352.975,305.291,350.289,303.74L350.289,303.74z M219.31,369.159V268.933l86.798,50.112L219.31,369.159z"/></g></g></g></svg>
              <span>REELS</span>
            </div>
            <div className='post-link'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><g><g><path d="M256,0C114.833,0,0,114.844,0,256s114.833,256,256,256s256-114.844,256-256S397.167,0,256,0z M256,490.667C126.604,490.667,21.333,385.396,21.333,256S126.604,21.333,256,21.333S490.667,126.604,490.667,256S385.396,490.667,256,490.667z"/><path d="M357.771,247.031l-149.333-96c-3.271-2.135-7.5-2.25-10.875-0.396C194.125,152.51,192,156.094,192,160v192c0,3.906,2.125,7.49,5.563,9.365c1.583,0.865,3.354,1.302,5.104,1.302c2,0,4.021-0.563,5.771-1.698l149.333-96c3.042-1.958,4.896-5.344,4.896-8.969S360.813,248.99,357.771,247.031z M213.333,332.458V179.542L332.271,256L213.333,332.458z"/></g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
              <span>VIDEO</span>
            </div>
            <div className='post-link'>
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m256.11 152.61c-44.112 0-80 35.888-80 80s35.888 80 80 80c44.113 0 80-35.888 80-80s-35.887-80-80-80zm0 140c-33.084 0-60-26.916-60-60s26.916-60 60-60 60 26.916 60 60-26.916 60-60 60z"/><path d="m424.86 92.61h-126.756l-32.106-55.039c-1.792-3.072-5.081-4.961-8.638-4.961s-6.846 1.89-8.638 4.962l-32.106 55.038h-126.756c-26.191 0-47.5 21.309-47.5 47.5v295c0 26.191 21.309 47.5 47.5 47.5h335c26.191 0 47.5-21.309 47.5-47.5v-295c0-26.191-21.308-47.5-47.5-47.5zm-285.5 370v-71.5c0-26.743 22.257-48.5 49-48.5h135.5c26.743 0 48.5 21.757 48.5 48.5v71.5zm313-27.5c0 15.163-12.337 27.5-27.5 27.5h-32.5v-71.5c0-37.771-30.729-68.5-68.5-68.5h-135.5c-37.771 0-69 30.729-69 68.5v71.5h-29.5c-15.164 0-27.5-12.337-27.5-27.5v-295c0-15.163 12.336-27.5 27.5-27.5h132.5c3.557 0 6.846-1.89 8.638-4.962l26.363-45.191 26.362 45.192c1.792 3.072 5.081 4.961 8.638 4.961h132.5c15.163 0 27.5 12.337 27.5 27.5v295z"/></svg>
              <span>Identifié(e)</span>
            </div>
          </div>
          <div className='profile-post-box'>
          {
            allUserPosts.map((post, postIndex) => (
              <div className='profile-post-box-img' onClick={() => Open_A_Post(postIndex)} key={`post${postIndex}`}>
                <img src={post.images[0].link} />
              </div>
            ))
          }
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
            postInfos={allUserPosts[selectedPostIndex!]} 
            userInfos={userInfos} 
          />}
          <ModalUnsubscribe
            isOpen={isModalSubscribeOpen}
            updatePost={Update_A_Post}
            UnfollowUser={Unfollow_User}
            CloseModal={Close_Subscribe_Modal}
            postInfos={allUserPosts[selectedPostIndex ? selectedPostIndex : 0]} 
            userInfos={userInfos} 
          />
        </div>
      </div>
      :
      <div className='fullpage-loader'>
        <div className="loader"></div>
      </div>
    }
    </>
  )
}

export default Profile