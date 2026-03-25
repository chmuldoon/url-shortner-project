import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { UrlsProvider } from './context/UrlsContext';
import Header from './components/Header';
import CreatePage from './pages/CreatePage';
import UrlsPage from './pages/UrlsPage';
import RedirectPage from './pages/RedirectPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <UrlsProvider>
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/create" replace />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/urls" element={<UrlsPage />} />
            <Route path="/:shortCode" element={<RedirectPage />} />
          </Routes>
        </main>
      </UrlsProvider>
    </BrowserRouter>
  );
}

export default App;
