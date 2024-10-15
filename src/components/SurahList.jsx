import React from 'react';

const SurahList = ({ surah, onSurahSelect, searchQuery }) => {
  return (
    <ul className="max-h-96 overflow-y-auto">
      {surah
        .filter((s) => s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((s) => (
          <li
            key={s.number}
            onClick={() => onSurahSelect(s)}
            className="cursor-pointer hover:bg-gray-200 p-2 rounded mb-1"
          >
            <div className="font-semibold">{s.englishName} ({s.name})</div>
            <div className="text-sm text-gray-500">Surah {s.number}</div>
          </li>
      ))}
    </ul>
  );
};

export default SurahList;
