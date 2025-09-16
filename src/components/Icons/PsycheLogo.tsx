import React from 'react';

const PsycheLogo: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => {
  return (
    <img src="/felicidad.png" alt="" className={className} />
  );
};

export default PsycheLogo;
