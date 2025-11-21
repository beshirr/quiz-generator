import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClerkProviderRoutes from './auth/ClerkProviderRoutes';
import { Layout } from './layout/Layout';
import { AuthenticationPage } from './auth/AuthenticationPage';
import { QuizGenerator } from './quiz/QuizGenerator';
import { HistoryPanel } from './history/HistoryPanel';

function App() {
  return (
    <BrowserRouter>
      <ClerkProviderRoutes>
        <Routes>
          <Route path='/sign-in/*' element={<AuthenticationPage />} />
          <Route path='/sign-up' element={<AuthenticationPage />} />
          <Route element={<Layout />}>
            <Route path='/' element={<QuizGenerator />} />
            <Route path='/history' element={<HistoryPanel />} />
          </Route>
        </Routes>
      </ClerkProviderRoutes>
    </BrowserRouter>
  );
}

export default App
