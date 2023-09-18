import { env } from 'node:process'
import _ from 'lodash'

type AppEnv = 'local' | 'development' | 'production'

export type EnvKey = 'PORT' | 'DATABASE_URL' | 'AUTH_JWT_SECRET'

export interface Config {
  port: number
  database: {
    url: string
  }
  auth: {
    jwt: {
      issuer: string
      secret: string
      algorithm: string
      cookieDomain: string
      refreshToken: {
        expires: number
      }
      accessToken: {
        expires: number
      }
    }
  }
}

function getAppEnv(defaultEnv: AppEnv): AppEnv {
  return env.NODE_ENV !== undefined ? (env.NODE_ENV as AppEnv) : defaultEnv
}

const appEnv: AppEnv = getAppEnv('local')

export async function loadConfig(): Promise<Partial<Config>> {
  const baseConfig = await import('./base')
  const appEnvConfig = await import(`./${appEnv}`)
  return _.merge(baseConfig['default'], appEnvConfig['default'])
}

export function loadEnvFilePath(): string[] {
  return [`.env.${appEnv}`, '.env']
}
