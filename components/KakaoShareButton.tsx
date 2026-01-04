import React from 'react';
import { KakaoShareIcon } from './icons/KakaoShareIcon';

interface KakaoShareButtonProps {
  title: string;
  description: string;
  translations: { [key: string]: string };
}

export const KakaoShareButton: React.FC<KakaoShareButtonProps> = ({ title, description, translations }) => {
  const handleShare = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Share.sendDefault({
        objectType: 'text',
        text: `Bible Speak\n\n${title}\n${description}`,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
        buttons: [
          {
            title: 'Read More',
            link: {
                // This is the crucial part that forces the link to open in the external browser
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
          },
        ],
      });
    } else {
      alert('Kakao SDK not initialized.');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 text-slate-400 hover:text-yellow-400 transition"
      aria-label={translations.shareOnKakao}
    >
      <KakaoShareIcon className="h-6 w-6" />
    </button>
  );
};
