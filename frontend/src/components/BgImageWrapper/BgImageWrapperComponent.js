import React from 'react';
import './BgImageWrapper.css'; // Make sure to create the corresponding CSS file

const BgImageWrapper = ({ children }) => {
  return (
    <div className="bg-image-wrapper">
      <div className="decoration-tab">
        {/* Decorative visual block */}
      </div>
      {children}
    </div>
  );
};

export default BgImageWrapper;
