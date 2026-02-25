import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import NovaTarefa from './pages/NovaTarefa';
import ProtectedRoute from './components/ProtectedRoute';
import TarefasApp from './TarefasApp';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TarefasApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nova-tarefa"
            element={
              <ProtectedRoute>
                <NovaTarefa />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;