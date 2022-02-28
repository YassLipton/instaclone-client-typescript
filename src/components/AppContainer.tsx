import React, { useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from "react-router-dom"
import { API_URI } from '../App'
import logo from '../images/instafont_logo.png'
import CreatePostModal from './elements/CreatePostModal'
// import { ModalCreatePost } from './elements'
import Nav from './elements/Nav'
import { User } from './models'

interface IProps extends RouteComponentProps<any> {
  isLogged: boolean,
  userInfos: User | undefined
}

const AppContainer : React.FC<IProps> = (props) => {
  const [isLogged, setLoginStatus] = useState(false)
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)

  const { history } = props

  useEffect(() => {
    props.history.listen(async (location, action) => {
      // alert(location)
      console.log(location)
      const userToken = localStorage.getItem('userToken')
      if (userToken !== null) {
        const request = await fetch(`${API_URI}/user/checkToken/${userToken}`)
        const response = await request
        if (response.status == 401) {
          localStorage.removeItem('userToken')
          if (window.location.hash != '#/signin' && window.location.hash != '#/signup') window.location.hash = '/signin'
          setLoginStatus(false)
        } else {
          setLoginStatus(true)
        }
      } else {
        setLoginStatus(false)
      }
    })
  }, [props.history])

  const HandleCreatePostModal = () => {
    setIsCreatePostModalOpen(!isCreatePostModalOpen)
  }

  return (
    <div>
      {
        (isLogged || props.isLogged) && props.userInfos && props.location.pathname != '/signin' && props.location.pathname != '/signup'
          ?
          <Nav
            HandleCreatePostModal={HandleCreatePostModal}
            userInfos={props.userInfos}
          />
          :
          undefined
      }
      {isCreatePostModalOpen && props.userInfos && <CreatePostModal isOpen={isCreatePostModalOpen} CloseModal={HandleCreatePostModal} userInfos={props.userInfos} />}
      {props.children}
    </div>
  )
}
export default withRouter(AppContainer)