// Entrypoint do frontend: cria a raiz React, injeta Provider do Redux e dispara
// a inicialização da autenticação.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import global de CSS (Bootstrap + estilos do projeto)
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
// Componente raiz da aplicação
import App from './App.tsx'
// Redux Provider e store tipada
import { Provider } from 'react-redux'
import store from './store/store'
// Thunk que checa token/localStorage e chama /api/me se existir token
import { authInit } from './store/authThunks'
// Tipo do dispatch para evitar casts desnecessários
import type { AppDispatch } from './store/store'

// Cria e monta a árvore React dentro do elemento #root
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />   
    </Provider>
  </StrictMode>
);

// Dispara inicialização de auth (checa token local e chama /api/me)
// Usamos o tipo AppDispatch para manter tipagem forte
(store.dispatch as AppDispatch)(authInit());
