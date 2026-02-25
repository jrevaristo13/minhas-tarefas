import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

// ✅ Interface com campos opcionais para evitar erro com dados antigos
interface Tarefa { 
  id: number;
  titulo: string;
  descricao: string;
  concluida: boolean;
  prioridade?: 'urgente' | 'importante' | 'normal';
  dataCriacao?: Date;
}

const TarefasApp: React.FC = () => {
  const { user, logout } = useAuth();
  
  // ✅ Carregamento seguro do localStorage
  const [tarefas, setTarefas] = useState<Tarefa[]>(() => {
    try {
      const salvas = localStorage.getItem('tarefas');
      return salvas ? JSON.parse(salvas) : [];
    } catch {
      return [];
    }
  });
  
  const [filtroAtual, setFiltroAtual] = useState<string>('todas');
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<{texto: string, tipo: 'sucesso' | 'erro' | 'info'} | null>(null);
  
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editPrioridade, setEditPrioridade] = useState<'urgente' | 'importante' | 'normal'>('normal');

  // ✅ Salvar no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tarefas', JSON.stringify(tarefas));
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  }, [tarefas]);

  // ✅ Mostrar mensagem temporária
  const mostrarMensagem = (texto: string, tipo: 'sucesso' | 'erro' | 'info' = 'info') => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 3000);
  };

  // ✅ Função segura para prioridade (NUNCA quebra)
  const getPrioridadeSegura = (tarefa: Tarefa | undefined | null): 'urgente' | 'importante' | 'normal' => {
    if (!tarefa?.prioridade) return 'normal';
    return tarefa.prioridade;
  };

  // ✅ Contadores com proteção
  const contadores = {
    pendentes: tarefas.filter(t => !t.concluida).length,
    concluidas: tarefas.filter(t => t.concluida).length,
    urgentes: tarefas.filter(t => getPrioridadeSegura(t) === 'urgente' && !t.concluida).length,
    importantes: tarefas.filter(t => getPrioridadeSegura(t) === 'importante' && !t.concluida).length,
    normais: tarefas.filter(t => getPrioridadeSegura(t) === 'normal' && !t.concluida).length,
    todas: tarefas.length
  };

  // ✅ Filtrar com proteção total
  const tarefasFiltradas = tarefas.filter(tarefa => {
    if (!tarefa?.id) return false;
    
    const titulo = tarefa.titulo || '';
    const descricao = tarefa.descricao || '';
    const prioridade = getPrioridadeSegura(tarefa);
    
    const matchBusca = titulo.toLowerCase().includes(busca.toLowerCase()) ||
                      descricao.toLowerCase().includes(busca.toLowerCase());
    
    if (!matchBusca) return false;
    
    switch (filtroAtual) {
      case 'pendentes': return !tarefa.concluida;
      case 'concluidas': return tarefa.concluida;
      case 'urgentes': return prioridade === 'urgente';
      case 'importantes': return prioridade === 'importante';
      case 'normais': return prioridade === 'normal';
      default: return true;
    }
  });

  // ✅ Iniciar edição
  const iniciarEdicao = (tarefa: Tarefa) => {
    setEditandoId(tarefa.id);
    setEditTitulo(tarefa.titulo || '');
    setEditDescricao(tarefa.descricao || '');
    setEditPrioridade(getPrioridadeSegura(tarefa));
    mostrarMensagem('Modo de edição ativado', 'info');
  };

  // ✅ Salvar edição
  const salvarEdicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (editandoId === null) return;
    
    setTarefas(prev => prev.map(t => 
      t.id === editandoId 
        ? { ...t, titulo: editTitulo, descricao: editDescricao, prioridade: editPrioridade }
        : t
    ));
    setEditandoId(null);
    mostrarMensagem('Tarefa atualizada com sucesso!', 'sucesso');
  };

  // ✅ Cancelar edição
  const cancelarEdicao = () => {
    setEditandoId(null);
    mostrarMensagem('Edição cancelada', 'info');
  };

  // ✅ Toggle concluída
  const toggleConcluida = (id: number) => {
    setTarefas(prev => prev.map(t => 
      t.id === id ? { ...t, concluida: !t.concluida } : t
    ));
    mostrarMensagem('Status atualizado!', 'sucesso');
  };

  // ✅✅✅ EXCLUIR - VERSÃO FINAL CORRIGIDA ✅✅✅
  const excluir = (id: number) => {
    // 1️⃣ Pergunta ANTES de qualquer coisa
    const confirmou = window.confirm('❓ Deseja realmente excluir esta tarefa?');
    
    // 2️⃣ Se cancelou, PARA AQUI e mostra mensagem
    if (!confirmou) {
      mostrarMensagem('Exclusão cancelada', 'info');
      return;
    }
    
    // 3️⃣ Atualiza estado COM FUNÇÃO (evita estado stale)
    setTarefas(prev => {
      const novas = prev.filter(t => t.id !== id);
      // Salva no localStorage
      localStorage.setItem('tarefas', JSON.stringify(novas));
      return novas;
    });
    
    // 4️⃣ Mostra mensagem de sucesso
    mostrarMensagem('✅ Tarefa excluída com sucesso!', 'sucesso');
  };

  // ✅ Helpers visuais
  const getPrioridadeClass = (prioridade: string) => {
    switch(prioridade) {
      case 'urgente': return 'bg-danger';
      case 'importante': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  };

  const getPrioridadeLabel = (prioridade: string) => {
    switch(prioridade) {
      case 'urgente': return 'Urgente';
      case 'importante': return 'Importante';
      default: return 'Normal';
    }
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
            <button 
              type="button"
              className="btn btn-light"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* ✅ Mensagem de Feedback */}
      {mensagem && (
        <div className="container">
          <div className={`alert alert-${mensagem.tipo === 'sucesso' ? 'success' : mensagem.tipo === 'erro' ? 'danger' : 'info'} alert-dismissible fade show shadow-sm`} role="alert">
            <i className={`bi bi-${mensagem.tipo === 'sucesso' ? 'check-circle' : mensagem.tipo === 'erro' ? 'exclamation-triangle' : 'info-circle'} me-2`}></i>
            {mensagem.texto}
            <button type="button" className="btn-close" onClick={() => setMensagem(null)}></button>
          </div>
        </div>
      )}

      <div className="container">
        <div className="row">
          {/* Sidebar - Filtros */}
          <div className="col-md-3 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  <i className="bi bi-funnel me-2"></i>
                  Filtragem
                </h5>
                
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Procurar"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>

                <div className="row g-2">
                  {[
                    { key: 'pendentes', label: 'pendentes', class: 'secondary', count: contadores.pendentes },
                    { key: 'concluidas', label: 'concluídas', class: 'success', count: contadores.concluidas },
                    { key: 'urgentes', label: 'urgentes', class: 'danger', count: contadores.urgentes },
                    { key: 'importantes', label: 'importantes', class: 'warning', count: contadores.importantes },
                    { key: 'normais', label: 'normal', class: 'info', count: contadores.normais },
                    { key: 'todas', label: 'todas', class: 'primary', count: contadores.todas },
                  ].map((f) => (
                    <div className="col-6" key={f.key}>
                      <button
                        type="button"
                        className={`btn btn-outline-${f.class} w-100 ${filtroAtual === f.key ? 'active' : ''}`}
                        onClick={() => setFiltroAtual(f.key)}
                      >
                        <strong>{f.count}</strong><br />
                        <small>{f.label}</small>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Tarefas */}
          <div className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">
                {tarefasFiltradas.length} tarefa{tarefasFiltradas.length !== 1 ? 's' : ''} 
                {filtroAtual !== 'todas' && ` marcadas como: "${filtroAtual}"`}
              </h4>
              
              <Link to="/nova-tarefa" className="btn btn-primary">
                <i className="bi bi-plus-lg me-2"></i>
                Nova Tarefa
              </Link>
            </div>

            {/* ✅ Lista com KEY ESTÁVEL */}
            <div className="row">
              {tarefasFiltradas.map((tarefa) => (
                <div className="col-12 mb-3" key={`tarefa-${tarefa.id}`}>
                  <div className={`card shadow-sm border-0 ${tarefa.concluida ? 'opacity-75' : ''}`}>
                    <div className="card-body">
                      {editandoId === tarefa.id ? (
                        // Modo Edição
                        <form onSubmit={salvarEdicao}>
                          <h6 className="mb-2">
                            <span className="text-primary">Editando:</span> {editTitulo}
                          </h6>
                          <div className="mb-2">
                            <input
                              type="text"
                              className="form-control"
                              value={editTitulo}
                              onChange={(e) => setEditTitulo(e.target.value)}
                              required
                            />
                          </div>
                          <div className="mb-2">
                            <textarea
                              className="form-control"
                              rows={3}
                              value={editDescricao}
                              onChange={(e) => setEditDescricao(e.target.value)}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <span className={`badge ${getPrioridadeClass(editPrioridade)}`}>
                              {getPrioridadeLabel(editPrioridade)}
                            </span>
                          </div>
                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success btn-sm">
                              <i className="bi bi-check me-1"></i> Salvar
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-danger btn-sm"
                              onClick={cancelarEdicao}
                            >
                              <i className="bi bi-x me-1"></i> Cancelar
                            </button>
                          </div>
                        </form>
                      ) : (
                        // Modo Visualização
                        <div className="d-flex align-items-start">
                          <div className="form-check me-3 mt-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={tarefa.concluida}
                              onChange={() => toggleConcluida(tarefa.id)}
                              id={`check-${tarefa.id}`}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className={`card-title mb-2 ${tarefa.concluida ? 'text-decoration-line-through' : ''}`}>
                              {tarefa.titulo}
                            </h5>
                            <p className={`card-text text-muted mb-2 ${tarefa.concluida ? 'text-decoration-line-through' : ''}`}>
                              {tarefa.descricao}
                            </p>
                            <div className="d-flex gap-2 flex-wrap mb-2">
                              <span className={`badge ${getPrioridadeClass(getPrioridadeSegura(tarefa))}`}>
                                {getPrioridadeLabel(getPrioridadeSegura(tarefa))}
                              </span>
                              {tarefa.concluida && (
                                <span className="badge bg-success">
                                  <i className="bi bi-check-circle me-1"></i> Concluída
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ms-3">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => iniciarEdicao(tarefa)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            {/* ✅✅✅ BOTÃO EXCLUIR CORRETO ✅✅✅ */}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => excluir(tarefa.id)}
                              title="Excluir tarefa"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {tarefasFiltradas.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-inbox display-1 text-muted"></i>
                <p className="text-muted mt-3">Nenhuma tarefa encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarefasApp;