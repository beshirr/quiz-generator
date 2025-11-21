import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import ClerkProviderRoutes from './auth/ClerkProviderRoutes';

function App() {
  return (
    <ClerkProviderRoutes>
      <Routes>
        
      </Routes>
    </ClerkProviderRoutes>
  );
}

export default App
