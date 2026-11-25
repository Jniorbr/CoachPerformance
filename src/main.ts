import type { Session, SupabaseClient } from '@supabase/supabase-js'
import './style.css'

function requireElement<T extends Element>(element: T | null) {
  if (!element) {
    throw new Error('Não foi possível iniciar a tela de autenticação.')
  }
  return element
}

const authScreen = requireElement(document.querySelector<HTMLElement>('#auth-screen'))
const authForm = requireElement(document.querySelector<HTMLFormElement>('#auth-form'))
const authMessage = requireElement(document.querySelector<HTMLElement>('#auth-message'))
const authSubmit = requireElement(document.querySelector<HTMLButtonElement>('#auth-submit'))
const emailInput = requireElement(document.querySelector<HTMLInputElement>('#email'))
const passwordInput = requireElement(document.querySelector<HTMLInputElement>('#password'))
const signInMode = requireElement(document.querySelector<HTMLButtonElement>('#sign-in-mode'))
const signUpMode = requireElement(document.querySelector<HTMLButtonElement>('#sign-up-mode'))
const coachApp = requireElement(document.querySelector<HTMLElement>('#coach-app'))
const sessionAccount = requireElement(document.querySelector<HTMLElement>('#session-account'))
const sessionMessage = requireElement(document.querySelector<HTMLElement>('#session-message'))

let mode: 'signIn' | 'signUp' = 'signIn'
let coachMounted = false
let supabaseClient: SupabaseClient | null = null

async function getSupabaseClient() {
  if (!supabaseClient) {
    const module = await import('./lib/supabase')
    supabaseClient = module.supabase
  }
  return supabaseClient
}

function showAuthMessage(message: string, isError = false) {
  authMessage.textContent = message
  authMessage.classList.toggle('is-error', isError)
}

function setMode(nextMode: 'signIn' | 'signUp') {
  mode = nextMode
  const isSignUp = mode === 'signUp'
  signInMode.setAttribute('aria-pressed', String(!isSignUp))
  signUpMode.setAttribute('aria-pressed', String(isSignUp))
  signInMode.classList.toggle('button-quiet', isSignUp)
  signUpMode.classList.toggle('button-quiet', !isSignUp)
  authSubmit.textContent = isSignUp ? 'Criar conta' : 'Entrar'
  passwordInput.autocomplete = isSignUp ? 'new-password' : 'current-password'
  showAuthMessage('')
}

function translateAuthError(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error &&
    typeof error.code === 'string' ? error.code : ''
  switch (code) {
    case 'invalid_credentials':
      return 'E-mail ou senha inválidos.'
    case 'email_not_confirmed':
      return 'Confirme seu e-mail antes de entrar.'
    case 'user_already_exists':
      return 'Este e-mail já possui uma conta.'
    case 'weak_password':
      return 'A senha não atende aos requisitos de segurança.'
    case 'over_email_send_rate_limit':
      return 'Muitas tentativas. Aguarde um pouco antes de tentar novamente.'
    default:
      return 'Não foi possível concluir a autenticação. Verifique sua conexão e tente novamente.'
  }
}

async function showSession(session: Session | null) {
  authScreen.hidden = Boolean(session)
  coachApp.hidden = !session
  sessionMessage.textContent = ''
  sessionAccount.replaceChildren()

  if (!session) {
    showAuthMessage('')
    if (coachMounted) {
      // não deixa os dados de um usuário na tela do próximo
      const { desmontarCoach } = await import('./mount')
      desmontarCoach()
      coachMounted = false
    }
    return
  }

  const email = document.createElement('span')
  email.textContent = session.user.email || 'Conta conectada'
  const signOutButton = document.createElement('button')
  signOutButton.type = 'button'
  signOutButton.className = 'button button-quiet small-button'
  signOutButton.textContent = 'Sair'
  signOutButton.addEventListener('click', async () => {
    signOutButton.disabled = true
    try {
      const { error } = await (await getSupabaseClient()).auth.signOut()
      if (!error) return
      sessionMessage.textContent = 'Não foi possível sair da conta. Tente novamente.'
      sessionMessage.classList.add('is-error')
    } catch {
      sessionMessage.textContent = 'Não foi possível sair da conta. Verifique sua conexão e tente novamente.'
      sessionMessage.classList.add('is-error')
    }
    signOutButton.disabled = false
  })
  sessionAccount.append(email, signOutButton)

  if (!coachMounted) {
    const { montarCoach } = await import('./mount')
    montarCoach(requireElement(document.querySelector<HTMLElement>('#app')))
    coachMounted = true
  }
}

signInMode.addEventListener('click', () => setMode('signIn'))
signUpMode.addEventListener('click', () => setMode('signUp'))

authForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  authSubmit.disabled = true
  showAuthMessage('')

  try {
    const supabase = await getSupabaseClient()
    const email = emailInput.value.trim()
    const password = passwordInput.value

    if (mode === 'signUp') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      if (!data.session) {
        showAuthMessage('Cadastro realizado. Verifique seu e-mail para confirmar a conta.')
      } else {
        await showSession(data.session)
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      await showSession(data.session)
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Configure VITE_SUPABASE_')) {
      showAuthMessage(error.message, true)
    } else {
      showAuthMessage(translateAuthError(error), true)
    }
  } finally {
    authSubmit.disabled = false
  }
})

async function initializeAuth() {
  try {
    const supabase = await getSupabaseClient()
    supabase.auth.onAuthStateChange((_event, session) => {
      void showSession(session).catch(() => {
        coachApp.hidden = true
        authScreen.hidden = false
        showAuthMessage('Não foi possível carregar o aplicativo. Atualize a página e tente novamente.', true)
      })
    })
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Configure VITE_SUPABASE_')) {
      showAuthMessage(error.message, true)
    } else {
      showAuthMessage('Não foi possível conectar ao Supabase. Confira a configuração e tente novamente.', true)
    }
  }
}

void initializeAuth()
