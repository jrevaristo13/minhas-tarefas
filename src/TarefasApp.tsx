import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Calendario from './components/Calendario'
import './App.css'

interface Tarefa {
  id: number
  titulo: string
  descricao: string
  concluida: boolean
  prioridade?: 'urgente' | 'importante' | 'normal'
  dataVencimento?: string
}

const TarefasApp: React.FC = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [tarefas, setTarefas] = useState<Tarefa[]>(() => {
    const salvas = localStorage.getItem('tarefas')
    return salvas ? JSON.parse(salvas) : []
  })

  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null)
  const [busca, setBusca] = useState('')

  const excluir = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Excluir esta tarefa?')) {
      const novas = tarefas.filter((t) => t.id !== id)
      setTarefas(novas)
      localStorage.setItem('tarefas', JSON.stringify(novas))
    }
  }

  const tarefasFiltradas = tarefas.filter((t) => {
    const matchBusca = t.titulo.toLowerCase().includes(busca.toLowerCase())
    if (dataSelecionada) {
      const dataTarefa = t.dataVencimento
      const dataSelStr = dataSelecionada.toISOString().split('T')[0]
      return matchBusca && dataTarefa === dataSelStr
    }
    return matchBusca
  })

  return (
    <div className="App">
      <header className="bg-primary text-white py-4 mb-4">
        <div className="container d-flex justify-content-between align-items-center">
          <h1>Gerenciador de Tarefas</h1>
          <button className="btn btn-light" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <input
              className="form-control mb-3"
              placeholder="Procurar..."
              onChange={(e) => setBusca(e.target.value)}
            />

            <Calendario
              tarefas={tarefas}
              dataSelecionada={dataSelecionada}
              onDataSelecionada={setDataSelecionada}
              onTarefaClick={(id) => navigate(`/editar-tarefa/${id}`)}
            />
          </div>

          <div className="col-md-9">
            <div className="d-flex justify-content-between mb-4">
              <h4>{tarefasFiltradas.length} tarefas</h4>
              <Link to="/nova-tarefa" className="btn btn-primary">
                + Nova
              </Link>
            </div>

            {tarefasFiltradas.map((tarefa) => (
              <div
                key={tarefa.id}
                className="card mb-2 shadow-sm"
                onClick={() => navigate(`/editar-tarefa/${tarefa.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">{tarefa.titulo}</h5>
                    <small className="text-muted">{tarefa.prioridade}</small>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={(e) => excluir(tarefa.id, e)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TarefasApp