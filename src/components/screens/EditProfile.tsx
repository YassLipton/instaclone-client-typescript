import { User } from "../models"
import profile from '../../images/profile.jpg'
import { useState } from "react"

const EditProfile = (props: {userInfos: User}) => {
  const { userInfos } = props

  const [fullName, setFullName] = useState(userInfos?.fullName)
  const [username, setUsername] = useState(userInfos?.username)
  const [link, setLink] = useState(userInfos?.link)
  const [bio, setBio] = useState(userInfos?.bio)
  const [email, setEmail] = useState(userInfos?.email)
  const [phone, setPhone] = useState(userInfos?.phone)

  return (
    <div className="content-container edit-profile-container">
      <div className="edit-profile-sidebar"></div>
      <div className="edit-profile-form-container">
        <div className="edit-profile-form-row">
          <div className="edit-profile-form-label">
            <img src={profile} />
          </div>
          <div className="edit-profile-form-input">
            <span className="edit-profile-form-username">yassmald</span>
            <button className="edit-profile-form-upload-btn">Modifier la photo de profil</button>
          </div>
        </div>
        <div className="edit-profile-form-row">
          <div className="edit-profile-form-label">
            <label>Nom</label>
          </div>
          <div className="edit-profile-form-input">
            <input defaultValue={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nom" />
          </div>
        </div>
        <div className="edit-profile-form-row">
          <div className="edit-profile-form-label">
            <label>Nom d'utilisateur</label>
          </div>
          <div className="edit-profile-form-input">
            <input defaultValue={username} onChange={e => setUsername(e.target.value)} placeholder="Nom d'utilisateur" />
          </div>
        </div>
        <div className="edit-profile-form-row">
          <div className="edit-profile-form-label">
            <label>Site web</label>
          </div>
          <div className="edit-profile-form-input">
            <input defaultValue={link} onChange={e => setLink(e.target.value)} placeholder="Site web" />
          </div>
        </div>
        <div className="edit-profile-form-row">
          <div className="edit-profile-form-label">
            <label>Bio</label>
          </div>
          <div className="edit-profile-form-input">
            <input defaultValue={bio} onChange={e => setBio(e.target.value)} placeholder="Bio" />
          </div>
        </div>
        <div className="edit-profile-form-row">
          <div className="edit-profile-form-label">
            <label>Adresse e-mail</label>
          </div>
          <div className="edit-profile-form-input">
            <input defaultValue={email} onChange={e => setEmail(e.target.value)} placeholder="Adresse e-mail" />
          </div>
        </div>
        <div className="edit-profile-form-row">
          <div className="edit-profile-form-label">
            <label>Numéro de téléphone</label>
          </div>
          <div className="edit-profile-form-input">
            <input defaultValue={phone} onChange={e => setPhone(e.target.value)} placeholder="Numéro de téléphone" />
          </div>
        </div>
        <div className="edit-profile-form-row">
          <div className="edit-profile-form-label">
            <label></label>
          </div>
          <div className="edit-profile-form-input">
            <button className="edit-profile-form-submit-btn">Envoyer</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile