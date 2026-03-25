import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import CreatePage from './pages/CreatePage';
import UrlsPage from './pages/UrlsPage';
import './App.css';

function App() {
  return (
   <> 
      <Header />
      
      <BrowserRouter>
        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/create" replace />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/urls" element={<UrlsPage />} />
          </Routes>
        </main>
      </BrowserRouter>

      </>  
  );
}

export default App;
