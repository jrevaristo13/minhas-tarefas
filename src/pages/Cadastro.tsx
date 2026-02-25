import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  // ✅ Função marcada como async
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }

    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    // ✅ Aguarda o resultado do register (Promise<boolean>)
    const sucesso = await register(nome.trim(), email.trim(), senha)

    if (sucesso) {
      navigate('/')
    } else {
      setError('Este email já está cadastrado')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div
                    className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i
                      className="bi bi-person-plus text-white"
                      style={{ fontSize: '3rem' }}
                    ></i>
                  </div>
                  <h2 className="fw-bold text-success">Criar Conta</h2>
                  <p className="text-muted">Preencha os dados abaixo</p>
                </div>

                {error && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError('')}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-person me-2"></i>Nome completo
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="João Silva"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-envelope me-2"></i>Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-lock me-2"></i>Senha
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Mínimo 6 caracteres"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-lock-fill me-2"></i>Confirmar senha
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Repita a senha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success btn-lg w-100 mb-3"
                  >
                    <i className="bi bi-check-circle me-2"></i>Cadastrar
                  </button>

                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Já tem uma conta?{' '}
                      <Link
                        to="/login"
                        className="text-success text-decoration-none fw-semibold"
                      >
                        Faça login
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cadastro
