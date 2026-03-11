import React from 'react';
import RegisterCard from '../components/RegisterCard';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Abstract Background Orbs */}
      <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] bg-secondary/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="mb-12 text-center z-10 relative">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 text-xs font-semibold tracking-wider uppercase text-primary shadow-pink-glow">
          Attendance System
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4 tracking-tight">
          DeepFace Portal
        </h1>
      </header>
      
      <main className="z-10 w-full flex justify-center">
        <RegisterCard />
      </main>
      
      <footer className="mt-12 text-center z-10 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Access Control. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
