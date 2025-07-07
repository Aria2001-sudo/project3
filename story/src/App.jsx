import { useState, useEffect } from 'react'
import './App.css'
import { NavLink } from 'react-router-dom';
import { useMqtt } from './contexts/MqttContext.jsx';

function App() {
  const { client, isConnected } = useMqtt();

  return (
    <>
      <div>
        <h1>MQTT Story App</h1>
        <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <nav className="nav">
        <NavLink className="button" to="/">Home</NavLink>
        <NavLink className="button" to="/orchestrator">Orchestrator</NavLink>
        <NavLink className="button" to="/projector">Projector</NavLink>
      </nav>
      </div>
    </>
  )
}

export default App