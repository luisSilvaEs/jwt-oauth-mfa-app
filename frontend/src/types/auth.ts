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
  qrCodeUri: string
}