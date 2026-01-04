import React, { useState } from 'react';

interface InAppBrowserMessageProps {
  translations: { [key: string]: string };
}

export const InAppBrowserMessage: React.FC<InAppBrowserMessageProps> = ({ translations }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      alert('Failed to copy link. Please manually copy the URL.');
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50 p-4">
      <div className="text-center p-8 bg-slate-800 rounded-lg max-w-md mx-auto w-full flex flex-col items-center gap-4 border border-amber-800">
        <h3 className="text-2xl font-bold text-amber-400">{translations.inAppBrowserTitle}</h3>
        <p className="text-slate-400">{translations.inAppBrowserBody}</p>
        
        <button
          onClick={handleCopyLink}
          disabled={isCopied}
          className={`mt-4 px-6 py-3 font-bold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-amber-500 text-lg w-48
            ${isCopied 
              ? 'bg-green-600 text-white cursor-default' 
              : 'bg-amber-500 text-slate-900 hover:bg-amber-600'
            }`}
        >
          {isCopied ? translations.linkCopiedButton : translations.copyLinkButton}
        </button>
      </div>
    </div>
  );
};
