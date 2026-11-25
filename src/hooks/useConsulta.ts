import { useCallback, useEffect, useRef, useState } from 'react'
import { mensagemDeErro } from '../lib/erros'

// Os 4 futuros de toda chamada de rede (slide 15): cada tela decide o que
// desenhar para cada um deles.
export type Status = 'loading' | 'success' | 'empty' | 'error'

export interface Consulta<T> {
  status: Status
  dados: T | null
  erro: string
  /** Busca de novo SEM piscar a tela (usado depois de salvar). */
  recarregar: () => void
  /** Volta para "loading" e busca de novo (botão "Tentar novamente"). */
  tentarNovamente: () => void
}

/**
 * @param buscar  função que chama a camada de dados (data.ts)
 * @param acao    verbo + objeto, usado na mensagem de erro ("carregar o treino")
 * @param ehVazio decide se o resultado conta como "vazio" (opcional)
 * @param chave   quando muda, a consulta roda de novo (ex.: a data)
 */
export function useConsulta<T>(
  buscar: () => Promise<T>,
  acao: string,
  ehVazio: (dados: T) => boolean,
  chave: string
): Consulta<T> {
  const [status, setStatus] = useState<Status>('loading')
  const [dados, setDados] = useState<T | null>(null)
  const [erro, setErro] = useState('')

  // refs: sempre a versão mais recente das funções, sem disparar o efeito
  const buscarRef = useRef(buscar)
  const ehVazioRef = useRef(ehVazio)
  const acaoRef = useRef(acao)
  useEffect(() => {
    buscarRef.current = buscar
    ehVazioRef.current = ehVazio
    acaoRef.current = acao
  })

  // evita que uma resposta antiga sobrescreva uma mais nova
  const pedido = useRef(0)

  const executar = useCallback(async (silencioso: boolean) => {
    const meu = ++pedido.current
    if (!silencioso) setStatus('loading')
    try {
      const resultado = await buscarRef.current()
      if (meu !== pedido.current) return
      setDados(resultado)
      setErro('')
      setStatus(ehVazioRef.current(resultado) ? 'empty' : 'success')
    } catch (e) {
      if (meu !== pedido.current) return
      setErro(mensagemDeErro(e, acaoRef.current))
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    // `void`: a promise é tratada dentro de executar() (try/catch)
    void executar(false)
    return () => {
      pedido.current += 1 // invalida resposta pendente ao desmontar/trocar a chave
    }
  }, [chave, executar])

  const recarregar = useCallback(() => void executar(true), [executar])
  const tentarNovamente = useCallback(() => void executar(false), [executar])

  return { status, dados, erro, recarregar, tentarNovamente }
}
