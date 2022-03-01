import React, { KeyboardEvent, useState } from 'react'
import { API_URI } from '../../App'

const SignUp = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const Submit = async () => {
    const request = await fetch(`${API_URI}/user/register`, {
      method: "POST",
      body: JSON.stringify({
        phoneOrEmail: phoneOrEmail,
        fullName: fullName,
        username: username,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 201) {
      const responseJson = await request.json()
      localStorage.setItem('userToken', responseJson.accessToken)
      window.location.href = window.location.origin
    } else {
      alert('Something went wrong. \nPlease try again.')
    }
  }

  const Press_Enter_Submit = (e: KeyboardEvent<HTMLInputElement>) => {
    const isSubmitable = phoneOrEmail.length > 0 && fullName.length > 0 && username.length > 0 && password.length > 0
    if (e.key === 'Enter' && isSubmitable) {
      Submit()
    }
  }

  const Redirect_To_Login_Page = () => {
    window.location.hash = 'signin'
  }

  return (
    <div className='full_centered'>
      <div>
        <div className='form-container'>
          <div className='form-logo-box'>
            <div className='form-logo'>
              <span className='form-logo-box-text'>Instaclone</span>
            </div>
          </div>
          <div className='form'>
            <input className='form-input' type='text' placeholder='Numéro de mobile ou e-mail' onChange={e => setPhoneOrEmail(e.target.value)} onKeyDown={Press_Enter_Submit} />
            <input className='form-input' type='text' placeholder='Nom complet' onChange={e => setFullName(e.target.value)} onKeyDown={Press_Enter_Submit} />
            <input className='form-input' type='text' placeholder="Nom d'utilisateur" onChange={e => setUsername(e.target.value)} onKeyDown={Press_Enter_Submit} />
            <input className='form-input' type='password' placeholder='Mot de passe' onChange={e => setPassword(e.target.value)} onKeyDown={Press_Enter_Submit} />
            <button className='form-button' type='submit' onClick={Submit} disabled={phoneOrEmail.length == 0 || fullName.length == 0 || username.length == 0 || password.length == 0}>Suivant</button>
          </div>
        </div>
        <div className='form-container'>
          <span className='form-text'>Vous avez un compte ? <a className='form-text-link' onClick={Redirect_To_Login_Page}>Connectez-vous</a></span>
        </div>
      </div>
    </div>
  )
}

export default SignUp