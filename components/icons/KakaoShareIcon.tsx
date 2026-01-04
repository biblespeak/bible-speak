import React from 'react';

export const KakaoShareIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 5.58 2 10c0 2.97 2.16 5.43 5 6.45V22l3.36-2.24C10.88 19.92 11.44 20 12 20c5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
    </svg>
  );
};