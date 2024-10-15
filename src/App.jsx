import { useState, useEffect } from 'react';
import SurahList from './components/SurahList';
import 'react-h5-audio-player/lib/styles.css';
import AudioPlayer from 'react-h5-audio-player';
import axios from 'axios';

const App = () => {
  const [surah, setSurah] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [ayahs, setAyahs] = useState([]);
  const [transliteration, setTransliteration] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const fetchSurahData = async () => {
      try {
        const response = await axios.get('https://api.alquran.cloud/v1/surah');
        setSurah(response.data.data);
      } catch (error) {
        console.error('Error fetching Surah data:', error);
      }
    };
    fetchSurahData();
  }, []);

  const fetchAyahs = async (surahNumber) => {
    try {
      const quranResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
      const translationResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple,en.sahih,bn.bengali`);
      setAyahs(quranResponse.data.data.ayahs);
      setTranslations(translationResponse.data.data);
    } catch (error) {
      console.error('Error fetching Ayahs:', error);
    }
  };

  const fetchAudio = async (surahNumber) => {
    try {
      const response = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
      setAudioUrl(response.data.data.audio);
    } catch (error) {
      console.error('Error fetching audio:', error);
    }
  };

  const handleSurahSelection = (surah) => {
    setSelectedSurah(surah);
    fetchAyahs(surah.number);
    fetchAudio(surah.number);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Al-Quran with Multiple Translations</h1>
      <input
        type="text"
        placeholder="Search Surah"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <select onChange={handleLanguageChange} value={language} className="border p-2 mb-4">
        <option value="en">English</option>
        <option value="bn">Bengali</option>
        {/* Add more languages here */}
      </select>
      <SurahList surah={surah} onSurahSelect={handleSurahSelection} searchQuery={searchQuery} />
      {selectedSurah && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{selectedSurah.name} - {selectedSurah.englishName}</h2>
          <AudioPlayer
            src={audioUrl}
            className="mt-4"
          />
          <div className="mt-4">
            {ayahs.map((ayah, index) => (
              <div key={index} className="mb-4">
                <p className="text-lg text-gray-700">{ayah.text}</p>
                <p className="text-sm text-gray-500">{transliteration[index]?.text}</p>
                <p className="text-sm text-gray-500">{translations[index]?.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
