import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import Orchestrator from './components/orchestrator.jsx'
import Projector from './components/projector.jsx'
import { MqttProvider } from './contexts/MqttContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MqttProvider>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/orchestrator' element={<Orchestrator />} />
        <Route path='/projector' element={<Projector />} />
      </Routes>
    </MqttProvider>
  </BrowserRouter>
)
