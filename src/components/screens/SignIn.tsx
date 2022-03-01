import React, { ChangeEvent, EventHandler, KeyboardEvent, useState } from 'react'
import { API_URI } from '../../App'

const SignIn = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const Submit = async () => {
    let fet = await fetch(`${API_URI}/user/login`, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let rep = await fet.json()
    if (rep.successfullyLogged) {
      localStorage.setItem('userToken', rep.accessToken)
      window.location.href = window.location.origin
    } else {
      alert('Your credentials are incorrects. \nPlease try again.')
    }
  }

  const Press_Enter_Submit = (e: KeyboardEvent<HTMLInputElement>) => {
    const isSubmitable = username.length > 0 && password.length > 0
    if (e.key === 'Enter' && isSubmitable) {
      Submit()
    }
  }

  const Redirect_To_Register_Page = () => {
    window.location.hash = 'signup'
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
            <input className='form-input' type='text' placeholder='Num. téléphone, nom d’utilisateur ou e-mail' onChange={e => setUsername(e.target.value)} onKeyDown={Press_Enter_Submit} />
            <input className='form-input' type='password' placeholder='Mot de passe' onChange={e => setPassword(e.target.value)} onKeyDown={Press_Enter_Submit} />
            <button className='form-button' type='submit' onClick={Submit} disabled={username.length == 0 || password.length == 0}>Connexion</button>
          </div>
        </div>
        <div className='form-container'>
          <span className='form-text'>Vous n'avez pas de compte ? <a className='form-text-link' onClick={Redirect_To_Register_Page}>Inscrivez-vous</a></span>
        </div>
      </div>
    </div>
  )
}

export default SignIn