/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY?: string
  readonly VITE_GOOGLE_GEOLOCATION_API_KEY?: string
  readonly VITE_API_URL?: string
  readonly PROD?: boolean
  readonly DEV?: boolean
  readonly MODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

