import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './Calendario.css'

interface Tarefa {
  id: number
  titulo: string
  dataVencimento?: string
  concluida: boolean
}

interface CalendarioProps {
  tarefas: Tarefa[]
  dataSelecionada: Date | null
  onDataSelecionada: (date: Date | null) => void
  onTarefaClick?: (id: number) => void
}

const Calendario: React.FC<CalendarioProps> = ({
  tarefas,
  dataSelecionada,
  onDataSelecionada,
  onTarefaClick
}) => {
  const diasComTarefas = tarefas
    .filter(
      (t): t is Tarefa & { dataVencimento: string } =>
        !!t.dataVencimento && !t.concluida
    )
    .map((t) => {
      const date = new Date(t.dataVencimento + 'T00:00:00')
      return date.toISOString().split('T')[0]
    })

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )
        .toISOString()
        .split('T')[0]

      const count = diasComTarefas.filter((d) => d === dateStr).length

      if (count > 0) {
        return (
          <div className="task-dot" title={`${count} tarefa(s) for este dia`}>
            <span
              className={`badge rounded-pill ${
                count > 3 ? 'bg-danger' : 'bg-warning text-dark'
              }`}
              onClick={(e) => {
                if (onTarefaClick) {
                  e.stopPropagation()
                  const tarefaId = tarefas.find(
                    (t) => t.dataVencimento === dateStr
                  )?.id
                  if (tarefaId) onTarefaClick(tarefaId)
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {count}
            </span>
          </div>
        )
      }
    }
    return null
  }

  const handleChange = (value: unknown) => {
    if (value instanceof Date) {
      const normalized = new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate()
      )
      onDataSelecionada(normalized)
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      const normalized = new Date(
        value[0].getFullYear(),
        value[0].getMonth(),
        value[0].getDate()
      )
      onDataSelecionada(normalized)
    } else {
      onDataSelecionada(null)
    }
  }

  return (
    <div className="calendario-wrapper">
      <Calendar
        onChange={handleChange}
        value={dataSelecionada}
        tileContent={tileContent}
        locale="pt-BR"
        className="custom-calendar"
        nextLabel="Próximo"
        prevLabel="Anterior"
        next2Label={null}
        prev2Label={null}
      />
    </div>
  )
}

export default Calendario