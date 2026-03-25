import React from 'react';

const SectionHeader = ({ title }) => (
  <div className="text-center my-3">
    <h2 className="display-6 fw-bold text-warning" style={{ fontFamily: 'cursive', letterSpacing: 2 }}>{title}</h2>
    <hr className="mx-auto" style={{ width: '60px', borderTop: '3px solid #ffc107' }} />
  </div>
);

export default SectionHeader;
