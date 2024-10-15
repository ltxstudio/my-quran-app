import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'react-h5-audio-player/lib/styles.css';
import AudioPlayer from 'react-h5-audio-player';
import { ClipLoader } from 'react-spinners';

const SurahPage = () => {
  const { number } = useParams();
  const [surah, setSurah] = useState({});
  const [audioUrl, setAudioUrl] = useState('');
  const [ayahs, setAyahs] = useState([]);
  const [transliteration, setTransliteration] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const languages = {
    en: "Sahih International",
    bn: "Muhiuddin Khan",
    ur: "Urdu",
    fr: "French",
    de: "German",
    id: "Indonesian",
    // Add more languages as needed
  };

  useEffect(() => {
    const fetchSurahData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/surah/${number}`);
        setSurah(response.data.data);
      } catch (error) {
        setError('Error fetching Surah data');
      } finally {
        setLoading(false);
      }
    };

    const fetchAyahs = async () => {
      setLoading(true);
      try {
        const quranResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/surah/${number}`);
        const translationResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/surah/${number}/editions/quran-simple,en.sahih,bn.bengali,ur.jalandhary,fr.hamidullah,de.aburida,id.indonesian`);
        setAyahs(quranResponse.data.data.ayahs);
        setTranslations(translationResponse.data.data);
      } catch (error) {
        setError('Error fetching Ayahs');
      } finally {
        setLoading(false);
      }
    };

    const fetchAudio = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/surah/${number}`);
        setAudioUrl(response.data.data.audio);
      } catch (error) {
        setError('Error fetching audio');
      } finally {
        setLoading(false);
      }
    };

    fetchSurahData();
    fetchAyahs();
    fetchAudio();
  }, [number]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      {loading && (
        <div className="flex justify-center items-center">
          <ClipLoader color={"#123abc"} loading={loading} size={50} />
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && (
        <>
          <h2 className="text-xl font-semibold text-center">{surah.name} - {surah.englishName}</h2>
          <select onChange={handleLanguageChange} value={language} className="border p-2 mb-4">
            {Object.entries(languages).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          <AudioPlayer
            src={audioUrl}
            className="mt-4"
          />
          <div className="mt-4">
            {ayahs.map((ayah, index) => (
              <div key={index} className="mb-4">
                <p className="text-lg text-gray-700">{ayah.text}</p>
                <p className="text-sm text-gray-500">{transliteration[index]?.text}</p>
                <p className="text-sm text-gray-500">{translations.find(t => t.language === language)?.ayahs[index]?.text}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SurahPage;
