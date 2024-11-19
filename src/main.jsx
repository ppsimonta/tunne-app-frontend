import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import { InstanceProvider } from './contexts/instances';
import { UserProvider } from './contexts/user.jsx';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <InstanceProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </InstanceProvider>
    </UserProvider>
  </React.StrictMode>
)
