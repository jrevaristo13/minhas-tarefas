import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NovaTarefa: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [prioridade, setPrioridade] = useState<'urgente' | 'importante' | 'normal'>('normal')
  const [dataVencimento, setDataVencimento] = useState('')

  useEffect(() => {
    if (id) {
      const tarefas = JSON.parse(localStorage.getItem('tarefas') || '[]')
      const tarefa = tarefas.find((t: any) => t.id === Number(id))
      if (tarefa) {
        setTitulo(tarefa.titulo)
        setDescricao(tarefa.descricao)
        setPrioridade(tarefa.prioridade)
        setDataVencimento(tarefa.dataVencimento || '')
      }
    }
  }, [id])

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault()
    const tarefas = JSON.parse(localStorage.getItem('tarefas') || '[]')

    if (id) {
      const novasTarefas = tarefas.map((t: any) =>
        t.id === Number(id)
          ? { ...t, titulo, descricao, prioridade, dataVencimento }
          : t
      )
      localStorage.setItem('tarefas', JSON.stringify(novasTarefas))
    } else {
      const nova = {
        id: Date.now(),
        titulo,
        descricao,
        prioridade,
        dataVencimento,
        concluida: false
      }
      tarefas.push(nova)
      localStorage.setItem('tarefas', JSON.stringify(tarefas))
    }
    navigate('/')
  }

  return (
    <div className="container py-5">
      <button className="btn btn-dark mb-4" onClick={() => navigate('/')}>
        Voltar
      </button>
      <div className="card shadow-sm border-0 p-4">
        <h2 className="fw-bold mb-4">{id ? 'Editar tarefa' : 'Nova tarefa'}</h2>
        <form onSubmit={handleSalvar}>
          <input
            className="form-control mb-3"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <textarea
            className="form-control mb-3"
            placeholder="Descrição"
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
          <input
            type="date"
            className="form-control mb-3"
            value={dataVencimento}
            onChange={(e) => setDataVencimento(e.target.value)}
          />

          <div className="mb-4">
            <label className="d-block mb-2 fw-bold">Prioridade</label>
            <div className="d-flex gap-3">
              {['urgente', 'importante', 'normal'].map((p) => (
                <div key={p} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="prioridade"
                    value={p}
                    checked={prioridade === p}
                    onChange={() => setPrioridade(p as any)}
                  />
                  <label className="form-check-label">
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-success px-5">
            {id ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NovaTarefa

