
import React from "react";

const Hero: React.FC = () => {
  return (
    <div className="w-full bg-[#5B0018] relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"
        style={{ mixBlendMode: 'multiply' }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-center text-center text-white">
        <div className="font-serif">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Welcome to The Taj <span className="text-[#D4AF37]">Flavours</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 font-light text-white">
            Experience the finest culinary delights
          </p>
        </div>
        
        <div className="w-24 h-px bg-[#D4AF37] my-6"></div>
        
        <p className="max-w-xl text-sm md:text-base font-sans text-white">
          Indulge in a symphony of flavors, expertly crafted by our master chefs.
          From traditional Indian classics to innovative contemporary cuisine, discover
          a gastronomic journey like no other.
        </p>
        
        <div className="flex gap-4 mt-8">
          <a 
            href="#menu" 
            className="px-6 py-2 bg-[#D4AF37] text-[#5B0018] font-medium rounded hover:bg-[#D4AF37]/90 transition-all"
          >
            View Menu
          </a>
          <a 
            href="#popular" 
            className="px-6 py-2 border border-white text-white font-medium rounded hover:bg-white/10 transition-all"
          >
            Popular Items
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
