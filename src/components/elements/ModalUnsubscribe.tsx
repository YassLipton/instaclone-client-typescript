import { API_URI } from "../../App"
import { User, Post } from "../models"

export const ModalUnsubscribe = (props: {
  isOpen: boolean,
  CloseModal: () => void,
  updatePost: (postInfos: Post) => void,
  UnfollowUser?: () => void,
  postInfos: Post,
  userInfos: User
}) => {

  const {
    isOpen,
    CloseModal,
    updatePost,
    postInfos,
    userInfos
  } = props

  const UnFollow_User = async () => {
    postInfos.user.followers.splice(postInfos.user.followers.indexOf(userInfos._id))
    const request = await fetch(`${API_URI}/user/update/${postInfos.user._id}`, {
      method: "PUT",
      body: JSON.stringify(postInfos.user),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 200) {
      if(postInfos._id) updatePost(postInfos)
      CloseModal()
    }
  }
  
  return (
    <div className='fullpage-centered' style={{display: isOpen ? 'flex' : 'none'}}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-header-image flex-center">
            <img src={postInfos?.user?.profilePicUrl} />
          </div>
          <div className="modal-header-text flex-center">
            <span>Se désabonner de @{postInfos?.user?.username} ?</span>
          </div>
        </div>
        <div className='modal-buttons'>
          <button className='btn-text-red btn-text-bold' onClick={props.UnfollowUser ? props.UnfollowUser : UnFollow_User}>Se désabonner</button>
          <button onClick={CloseModal}>Annuler</button>
        </div>
      </div>
    </div>
  )
}