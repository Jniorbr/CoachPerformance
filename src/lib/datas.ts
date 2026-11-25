// Datas "locais" no formato AAAA-MM-DD. O banco guarda `data` como date,
// então o front envia a data do dispositivo (e não o default UTC do banco).

export function chaveData(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${data.getFullYear()}-${mes}-${dia}`
}

export function dataDeChave(chave: string): Date {
  const [ano, mes, dia] = chave.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

export function somarDias(chave: string, dias: number): string {
  const data = dataDeChave(chave)
  data.setDate(data.getDate() + dias)
  return chaveData(data)
}

export function hoje(): string {
  return chaveData(new Date())
}

export function rotuloData(chave: string, opcoes?: Intl.DateTimeFormatOptions): string {
  return dataDeChave(chave).toLocaleDateString('pt-BR', opcoes ?? { day: '2-digit', month: '2-digit' })
}
