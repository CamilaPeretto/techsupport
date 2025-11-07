/// <reference types="vite/client" />

// Declarações de módulos para arquivos estáticos importados no TypeScript.
// Isso permite `import logo from './logo.png'` sem erros de tipagem.

declare module '*.svg' {
  // Importar SVGs como string (path/URL) — útil para <img src={logo} />
  const content: string;
  export default content;
}

declare module '*.png' {
  // Imagens raster — exporta o caminho como string
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}
