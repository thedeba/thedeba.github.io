"use client";

import { useState, useEffect, useRef } from 'react';

const Clock = () => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time (HH:MM:SS AM/PM)
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      
      // Format date (Weekday, Month Day, Year)
      const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      setTime(timeString);
      setDate(dateString);
    };

    // Update immediately and then every second
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            // Scrolling down
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY.current) {
            // Scrolling up
            setIsVisible(true);
          }
          
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-4 right-4 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl ${isVisible ? 'translate-y-0' : '-translate-y-20'} transition-transform duration-300`}>
      <div className="text-right">
        <div className="text-2xl font-mono font-bold text-gray-800 dark:text-gray-100">
          {time}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {date}
        </div>
      </div>
    </div>
  );
};

export default Clock;
