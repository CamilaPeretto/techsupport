import * as React from "react";

// Ponto de corte para considerar a tela como mobile (pixels)
const MOBILE_BREAKPOINT = 768;

// Hook reutilizável para detectar se estamos em uma viewport mobile
export function useIsMobile() {
  // Estado booleano que pode ser indefinido inicialmente (SSR-safe)
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // matchMedia para observar alterações no breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      // Atualiza usando window.innerWidth como fallback seguro
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    // Adiciona listener de mudança
    mql.addEventListener("change", onChange);
    // Define valor inicial imediatamente
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    // Cleanup: remove listener ao desmontar
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Normaliza para boolean (evita undefined no retorno)
  return !!isMobile;
}
