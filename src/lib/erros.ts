// Traduz erros técnicos (rede, sessão expirada, RLS) em mensagens claras.
// O erro bruto vai para o console; o usuário nunca vê stack trace.

function texto(valor: unknown): string {
  return typeof valor === 'string' ? valor : ''
}

export function mensagemDeErro(erro: unknown, acao: string): string {
  console.error(`[Coach] Falha ao ${acao}:`, erro)

  const obj = typeof erro === 'object' && erro !== null ? (erro as Record<string, unknown>) : {}
  const codigo = texto(obj.code)
  const mensagem = texto(obj.message) || (erro instanceof Error ? erro.message : '')

  if (/failed to fetch|networkerror|network request failed|load failed/i.test(mensagem)) {
    return `Sem conexão. Verifique sua internet e tente ${acao} novamente.`
  }
  if (codigo === 'PGRST301' || /jwt/i.test(mensagem)) {
    return 'Sua sessão expirou. Saia e entre novamente.'
  }
  if (codigo === '42501' || /row-level security|permission denied/i.test(mensagem)) {
    return 'Sem permissão para acessar esses dados.'
  }
  return `Não foi possível ${acao}. Tente novamente em instantes.`
}
