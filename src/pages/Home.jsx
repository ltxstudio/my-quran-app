import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { ClipLoader } from 'react-spinners';

const Home = () => {
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
    <div className="container mx-auto p-4">
      <Helmet>
        <title>Al-Quran App</title>
        <meta name="description" content="Read and listen to the Al-Quran with multiple translations and audio in various languages." />
      </Helmet>
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
      <ul className="max-h-96 overflow-y-auto">
        {surah.filter((s) => s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((s) => (
          <li key={s.number} className="cursor-pointer hover:bg-gray-200 p-2 rounded mb-1">
            <Link to={`/surah/${s.number}`} className="font-semibold">{s.englishName} ({s.name})</Link>
            <div className="text-sm text-gray-500">Surah {s.number}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
