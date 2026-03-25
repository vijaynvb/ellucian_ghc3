import React from 'react';

const MenuList = ({ items, type }) => (
  <div className="list-group list-group-flush">
    {items.map(item => (
      <div key={item.id} className="list-group-item bg-transparent border-0 d-flex justify-content-between align-items-center">
        <div>
          <span className="fw-bold text-white">{item.name}</span>
          {item.description && <div className="small text-light">{item.description}</div>}
        </div>
        <span className="badge bg-warning text-dark fs-6">{item.price} $</span>
      </div>
    ))}
  </div>
);

export default MenuList;
