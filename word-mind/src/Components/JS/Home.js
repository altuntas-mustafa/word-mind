import React from 'react';

function Home() {
  return (
    <div className="bg-black h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
          Welcome To Word Mind App.
        </h1>
        <p className="mt-4 text-sm md:text-base lg:text-lg xl:text-xl text-white">
          Be ready to learn amazing words quickly :D
        </p>
      </div>
    </div>
  );
}

export default Home;
