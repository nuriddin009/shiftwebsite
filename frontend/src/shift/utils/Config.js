const env = {
    development: 'http://localhost:81/api',
    production: '/api',
    test: 'http://localhost:81/api',
}

const getEnv = () => env[process.env.NODE_ENV]

export const APP_NAME = 'Starter Boilerplate'
export const API_BASE_URL = getEnv() //! `/api` bilan tugashi kerak (MainEditor'da xato berishi mumkin)
export const AUTH_TOKEN = 'token'
export const REFRESH_TOKEN = 'refresh_token'
export const EDITOR_API_KEY = 'dy39vi4i52jj26k5m6my8uv5hyuwl1dly99ibaiykd98dc65'
export const EDITOR_HEIGHT = 100
// export const REFRESH_TOKEN = 'refresh_token'
