import React from 'react';

interface ChatPDFIconProps {
  size?: number;
  className?: string;
}

const ChatPDFIcon: React.FC<ChatPDFIconProps> = ({ size = 64, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      {/* <circle cx="32" cy="32" r="32" fill="#ECFDF5" /> */}

      {/* PDF file shape */}
      <path
        d="M18 14H38L46 22V50H18V14Z"
        fill="#22C55E"
        stroke="#16A34A"
        strokeWidth="2"
      />

      {/* PDF text */}
      <path
        d="M22 26H42M22 32H42M22 38H34"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Folded corner */}
      <path d="M38 14V22H46" stroke="#16A34A" strokeWidth="2" />

      {/* Chat bubble */}
      <path
        d="M46 40C46 35.5817 42.4183 32 38 32C33.5817 32 30 35.5817 30 40C30 44.4183 33.5817 48 38 48C39.3261 48 40.5979 47.7077 41.7364 47.1799L46 49L44.9612 45.0541C45.6288 43.5724 46 41.9376 46 40Z"
        fill="#4ADE80"
        stroke="#22C55E"
        strokeWidth="2"
      />

      {/* AI nodes */}
      <circle cx="35" cy="40" r="1.5" fill="white" />
      <circle cx="38" cy="40" r="1.5" fill="white" />
      <circle cx="41" cy="40" r="1.5" fill="white" />
    </svg>
  );
};

export default ChatPDFIcon;
