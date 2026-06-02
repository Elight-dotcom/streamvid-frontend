import { Route, Routes } from 'react-router-dom'
import './App.css'
import AddMoviePage from './pages/AddMoviePage'
import DetailPage from './pages/DetailPage'
import Homepage from './pages/HomePage'
import StreamPage from './pages/StreamPage'

function App() {
  return (
    <>
    <Routes>
      <Route 
        path="/" 
        element={<Homepage />} 
      />

      <Route 
        path="/movies/:id" 
        element={<DetailPage />} 
      />

      <Route 
        path="/stream/:tmdbId/:id" 
        element={<StreamPage />} 
      />

      <Route 
        path="/add" 
        element={<AddMoviePage />} 
      />
    </Routes>
    </>
  )
}

export default App
