/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ASSEMBLY_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 