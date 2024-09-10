import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">This is the online notice board</h1>
      <Link
        to="/login"
        className="mt-4 inline-block rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Click the button to login first
      </Link>
    </div>
  );
}

export default Home;
