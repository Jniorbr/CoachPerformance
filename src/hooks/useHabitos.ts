import { useCallback, useRef, useState } from 'react'
import {
  carregarHabitos,
  HABITOS_PADRAO,
  salvarHabitos,
  type HabitosDia,
  type MapaHabitos
} from '../lib/habitos'

export function useHabitos() {
  const [inicial] = useState(carregarHabitos)
  const [dias, setDias] = useState<MapaHabitos>(inicial.dias)
  const [erro, setErro] = useState(inicial.erro)
  const bloqueado = useRef(inicial.bloqueado)

  const obter = useCallback(
    (chave: string): HabitosDia => dias[chave] ?? HABITOS_PADRAO,
    [dias]
  )

  const atualizar = useCallback(
    (chave: string, mudar: (dia: HabitosDia) => HabitosDia) => {
      const proximo = { ...dias, [chave]: mudar(dias[chave] ?? HABITOS_PADRAO) }
      setDias(proximo)
      if (!bloqueado.current) setErro(salvarHabitos(proximo))
    },
    [dias]
  )

  return { dias, obter, atualizar, erro }
}
