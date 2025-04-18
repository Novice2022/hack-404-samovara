import { useState } from 'react'
import './App.scss'
import Registration from './components/registration/registration'
import MainRegistration from './components/registration/mainRegistration'
import LkVeteran from './components/lk/lkVeteran'
import {
  Route,
  BrowserRouter,
  Routes
} from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainRegistration />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/lk" element={<LkVeteran />} />

          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
