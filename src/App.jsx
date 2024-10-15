import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SurahList from './components/SurahList';
import SurahPage from './pages/SurahPage';
import 'react-h5-audio-player/lib/styles.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';

const App = () => {
  const [surah, setSurah] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurahData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/surah`);
        setSurah(response.data.data);
      } catch (error) {
        setError('Error fetching Surah data');
      } finally {
        setLoading(false);
      }
    };
    fetchSurahData();
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <div className="container mx-auto p-4">
          <Helmet>
            <title>Al-Quran App</title>
            <meta name="description" content="Read and listen to the Al-Quran with multiple translations and audio in various languages." />
          </Helmet>
          <Switch>
            <Route exact path="/">
              <h1 className="text-2xl font-bold mb-4 text-center">Al-Quran with Multiple Translations</h1>
              <input
                type="text"
                placeholder="Search Surah"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border p-2 mb-4 w-full"
              />
              {loading && (
                <div className="flex justify-center items-center">
                  <ClipLoader color={"#123abc"} loading={loading} size={50} />
                </div>
              )}
              {error && <p className="text-center text-red-500">{error}</p>}
              <SurahList surah={surah} searchQuery={searchQuery} />
            </Route>
            <Route path="/surah/:number">
              <SurahPage />
            </Route>
          </Switch>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
