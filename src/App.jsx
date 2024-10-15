import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SurahPage from './pages/SurahPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/surah/:surahNumber" element={<SurahPage />} />
    </Routes>
  );
};

export default App;
