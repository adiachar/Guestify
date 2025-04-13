import { useState } from 'react'
import {Provider} from "react-redux";
import { store } from './app/store.js';
import HomePage from './components/home/HomePage.jsx';
import './App.css';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <HomePage/>
      </Provider>
    </>
  )
}

export default App
