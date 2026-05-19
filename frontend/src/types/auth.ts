export interface User {
  email: string
  provider: 'LOCAL' | 'GOOGLE' | 'GITHUB'
  mfaEnabled: boolean
}

export interface AuthResponse {
  token: string
  mfaRequired?: boolean
  email?: string
}

export interface MfaSetupResponse {
  secret: string
  qrCode: string
}

export interface MeResponse {
  id: number
  email: string
  name: string
  provider: 'LOCAL' | 'GOOGLE' | 'GITHUB'
  mfaEnabled: boolean
  createdAt: string
}