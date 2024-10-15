import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import { Helmet } from 'react-helmet-async';
import { ClipLoader } from 'react-spinners';

const SurahPage = () => {
  const { surahNumber } = useParams();
  const [surah, setSurah] = useState(null);
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
    const fetchAyahs = async () => {
      setLoading(true);
      try {
        const quranResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/surah/${surahNumber}`);
        const translationResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/surah/${surahNumber}/editions/quran-simple,en.sahih,bn.bengali,ur.jalandhary,fr.hamidullah,de.aburida,id.indonesian`);
        setSurah(quranResponse.data.data);
        setAyahs(quranResponse.data.data.ayahs);
        setTranslations(translationResponse.data.data);
        setAudioUrl(quranResponse.data.data.audio);
      } catch (error) {
        setError('Error fetching Ayahs');
      } finally {
        setLoading(false);
      }
    };
    fetchAyahs();
  }, [surahNumber]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>{surah ? surah.englishName : 'Surah'} - Al-Quran App</title>
        <meta name="description" content={`Read and listen to Surah ${surah ? surah.englishName : ''} with multiple translations and audio in various languages.`} />
      </Helmet>
      {loading && (
        <div className="flex justify-center items-center">
          <ClipLoader color={"#123abc"} loading={loading} size={50} />
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {surah && !loading && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-center">{surah.name} - {surah.englishName}</h1>
          <AudioPlayer
            src={audioUrl}
            className="mt-4"
          />
          <select onChange={handleLanguageChange} value={language} className="border p-2 mb-4">
            {Object.entries(languages).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          <div className="mt-4">
            {ayahs.map((ayah, index) => (
              <div key={index} className="mb-4">
                <p className="text-lg text-gray-700">{ayah.text}</p>
                <p className="text-sm text-gray-500">{transliteration[index]?.text}</p>
