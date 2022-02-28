import { Fragment } from 'react';
import './App.css';
import Components from './components';

function App() {
  return (
    <Fragment>
      <Components />
    </Fragment>
  );
}

export const API_URI = 'https://instaclone-server-ts.herokuapp.com'

export default App;
