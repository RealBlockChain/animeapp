import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnimeList from './components/AnimeList';
import AnimeDetail from './components/AnimeDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<AnimeList />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
