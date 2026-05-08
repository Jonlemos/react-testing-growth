import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FormLogin } from '../LoginForm'

// ── Mock hook auth ──────────────────────────────────────────
vi.mock('@/feature/auth/hooks/useAuth')
import { useAuth } from '@/feature/auth/hooks/useAuth'

const mockUseAuth = vi.mocked(useAuth)

const makeMockAuth = (overrides = {}) => ({
  user: null,
  isAuthenticated: false,
  login: vi.fn(),
  logout: vi.fn(),
  isLoggingIn: false,
  loginError: null,
  isLoggingOut: false,
  handleApiError: vi.fn(),
  ...overrides,
})

const renderForm = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <FormLogin />
    </QueryClientProvider>
  )
}

describe('FormLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue(makeMockAuth() as ReturnType<typeof useAuth>)
  })

  describe('Render', () => {
    it('displays the email and password fields', () => {
      renderForm()

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    })

    it('displays the submit button with the text "Entrar"', () => {
      renderForm()

      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
    })

    it('button is disabled and shows "Entrando..." during login', () => {
      mockUseAuth.mockReturnValue(
        makeMockAuth({ isLoggingIn: true }) as ReturnType<typeof useAuth>
      )
      renderForm()

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent(/Entrando/i)
    })

    it('display error message when loginError is present', () => {
      mockUseAuth.mockReturnValue(
        makeMockAuth({ loginError: new Error('Credenciais inválidas') }) as ReturnType<typeof useAuth>
      )
      renderForm()

      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument()
    })
  })

  describe('Form validation', () => {
    it('display error for invalid email when trying to submit', async () => {
      const user = userEvent.setup()
      renderForm()

      await user.type(screen.getByLabelText(/email/i), 'nao-e-email')
      await user.click(screen.getByRole('button', { name: /entrar/i }))

      await waitFor(() => {
        expect(screen.getByText(/email inválido/i)).toBeInTheDocument()
      })
    })

    it('display error for empty password when trying to submit', async () => {
      const user = userEvent.setup()
      renderForm()

      await user.type(screen.getByLabelText(/email/i), 'user@teste.com')
      await user.click(screen.getByRole('button', { name: /entrar/i }))

      await waitFor(() => {
        expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument()
      })
    })

    it('does not call login when the form has validation errors', async () => {
      const loginMock = vi.fn()
      mockUseAuth.mockReturnValue(
        makeMockAuth({ login: loginMock }) as ReturnType<typeof useAuth>
      )
      const user = userEvent.setup()
      renderForm()

      await user.click(screen.getByRole('button', { name: /entrar/i }))

      await waitFor(() => {
        expect(loginMock).not.toHaveBeenCalled()
      })
    })
  })

  describe('Submit with valid data', () => {
    it('calls login with correct email and password', async () => {
      const loginMock = vi.fn()
      mockUseAuth.mockReturnValue(
        makeMockAuth({ login: loginMock }) as ReturnType<typeof useAuth>
      )
      const user = userEvent.setup()
      renderForm()

      await user.type(screen.getByLabelText(/email/i), 'user@empresa.com')
      await user.type(screen.getByLabelText(/senha/i), 'senha123')
      await user.click(screen.getByRole('button', { name: /entrar/i }))

      await waitFor(() => {
        expect(loginMock).toHaveBeenCalledWith({
          email: 'user@empresa.com',
          password: 'senha123',
        })
      })
    })
  })
})
