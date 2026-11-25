import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { ErrorState } from './ErrorState'

interface Props {
  children: ReactNode
}

interface Estado {
  falhou: boolean
}

/** Nível 2 e 3 do slide 17: erro de renderização não derruba o app inteiro. */
export class ErrorBoundary extends Component<Props, Estado> {
  state: Estado = { falhou: false }

  static getDerivedStateFromError(): Estado {
    return { falhou: true }
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    console.error('[Coach] Erro de renderização:', erro, info.componentStack)
  }

  render() {
    if (this.state.falhou) {
      return (
        <ErrorState
          mensagem="Algo deu errado ao montar esta tela."
          onTentarNovamente={() => this.setState({ falhou: false })}
        />
      )
    }
    return this.props.children
  }
}
