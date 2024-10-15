import React from 'react';

const Pagination = ({ ayahsPerPage, totalAyahs, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalAyahs / ayahsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="inline-flex items-center -space-x-px">
        {pageNumbers.map(number => (
          <li key={number} className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">
            <a onClick={() => paginate(number)} href="!#" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
