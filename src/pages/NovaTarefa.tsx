import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  concluida: boolean;
  prioridade: 'urgente' | 'importante' | 'normal';
  dataCriacao: Date;
}

const NovaTarefa: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<'urgente' | 'importante' | 'normal'>('normal');

  const handleCadastrar = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tarefas = JSON.parse(localStorage.getItem('tarefas') || '[]');
    
    const novaTarefa: Tarefa = {
      id: Date.now(),
      titulo,
      descricao,
      concluida: false,
      prioridade,
      dataCriacao: new Date()
    };
    
    tarefas.push(novaTarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    
    // ✅ Volta automático para lista após cadastrar
    navigate('/');
  };

  return (
    <div className="App" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header className="bg-primary text-white py-4 mb-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-5 mb-0">
                <i className="bi bi-check2-square me-2"></i>
                Gerenciador de Tarefas
              </h1>
              <p className="mb-0 mt-2 opacity-75">
                {user && `Bem-vindo, ${user.nome}!`}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {/* ✅ Botão Voltar no topo */}
            <button 
              className="btn btn-dark mb-4"
              onClick={() => navigate('/')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Voltar a lista de tarefas
            </button>

            <div className="card shadow-sm border-0">
              <div className="card-body p-5">
                <h2 className="mb-4 fw-bold">Nova tarefa</h2>

                <form onSubmit={handleCadastrar}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Título"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="mb-4">
                    <textarea
                      className="form-control form-control-lg"
                      rows={6}
                      placeholder="Descrição"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Prioridade</label>
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="prioridade"
                          id="urgente"
                          value="urgente"
                          checked={prioridade === 'urgente'}
                          onChange={(e) => setPrioridade(e.target.value as any)}
                        />
                        <label className="form-check-label" htmlFor="urgente">
                          Urgente
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="prioridade"
                          id="importante"
                          value="importante"
                          checked={prioridade === 'importante'}
                          onChange={(e) => setPrioridade(e.target.value as any)}
                        />
                        <label className="form-check-label" htmlFor="importante">
                          Importante
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="prioridade"
                          id="normal"
                          value="normal"
                          checked={prioridade === 'normal'}
                          onChange={(e) => setPrioridade(e.target.value as any)}
                        />
                        <label className="form-check-label" htmlFor="normal">
                          Normal
                        </label>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-success btn-lg px-5"
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Cadastrar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovaTarefa;

