import React, { useEffect, Suspense, useState, useReducer } from "react";

import { BrowserRouter as Router, Switch, Route, HashRouter } from "react-router-dom"
import { API_URI } from "../App";
import AppContainer from "./AppContainer";
import { User } from "./models";
import EditProfile from "./screens/EditProfile";

import Home from "./screens/Home";
import Profile from "./screens/Profile";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";

const Components = () => {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [userInfos, setUserInfos] = useState<User>()
  const [isLogged, setLoginStatus] = useState<boolean>(false)
  const [isChecking, setCheckingStatus] = useState<boolean>(true)


  useEffect(() => {
    CheckToken()
  }, [])

  const CheckToken = async () => {
    const userToken = localStorage.getItem('userToken')
    const request = await fetch(`${API_URI}/user/checkToken/${userToken}`)
    const response = await request
    if (response.status == 401) {
      localStorage.removeItem('userToken')
      if (window.location.hash != '#/signin' && window.location.hash != '#/signup') window.location.hash = '/signin'
      setLoginStatus(false)
      setCheckingStatus(false)
    } else {
      const responseJson = await request.json()
      console.log(responseJson)
      setUserInfos(responseJson)
      setLoginStatus(true)
      setCheckingStatus(false)
    }
  }

  const loading = (
    <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  )

  const Routes = (props: {isChecking: boolean}) => {
    const { isChecking } = props
    if (!isChecking) {

      let currentRoutes
      
      if (userInfos) {
        currentRoutes = [
          { url: "", component: <Home userInfos={userInfos} /> },
          { url: "profile/:id", component: <Profile userInfos={userInfos} /> },
          { url: "edit", component: <EditProfile userInfos={userInfos} /> },
          { url: "signin", component: <SignIn /> },
          { url: "signup", component: <SignUp /> }
        ]
      } else {
        currentRoutes = [
          { url: "signin", component: <SignIn /> },
          { url: "signup", component: <SignUp /> }
        ]
      }
        
        return (
          <AppContainer isLogged={isLogged} userInfos={userInfos}>
            <Switch>
              {/* <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} /> */}
              {currentRoutes.map((data, i) => (
                <Route
                  key={i}
                  exact
                  path={`/${data.url}`}
                  //component={data.component}
                  render={() => data.component}
                />
              ))}
            </Switch>
          </AppContainer>
        )
    } else {
      return (
        <div className='fullpage-loader'>
          <div className="loader"></div>
        </div>
      )
    }
  }

  return (
  
    <HashRouter basename="/">
      <Suspense fallback={loading}>
        <Routes isChecking={isChecking} />
      </Suspense>
    </HashRouter>

  )
}

export default Components