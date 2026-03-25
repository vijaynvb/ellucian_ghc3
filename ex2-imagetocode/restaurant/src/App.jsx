import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SectionHeader from './components/SectionHeader';
import MenuList from './components/MenuList';
import './App.css';

function App() {
  const [menu, setMenu] = useState({ appetizers: [], mainCourses: [], desserts: [], drinks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/appetizers').then(res => res.json()),
      fetch('http://localhost:3001/mainCourses').then(res => res.json()),
      fetch('http://localhost:3001/desserts').then(res => res.json()),
      fetch('http://localhost:3001/drinks').then(res => res.json())
    ]).then(([appetizers, mainCourses, desserts, drinks]) => {
      setMenu({ appetizers, mainCourses, desserts, drinks });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center text-light mt-5">Loading menu...</div>;

  return (
    <div className="bg-dark min-vh-100 text-light" style={{ fontFamily: 'sans-serif' }}>
      <div className="container py-4">
        <div className="text-center mb-4">
          <img src="/images/logo.png" alt="Logo" style={{ width: 80, borderRadius: '50%' }} />
          <h1 className="display-4 fw-bold text-warning" style={{ fontFamily: 'cursive' }}>Tasty Food</h1>
          <h2 className="h4 fw-bold text-white">RESTAURANT</h2>
        </div>
        <div className="row g-4">
          <div className="col-md-3">
            <SectionHeader title="Appetizers" />
            <MenuList items={menu.appetizers} type="appetizer" />
          </div>
          <div className="col-md-6">
            <SectionHeader title="Main Courses" />
            <MenuList items={menu.mainCourses} type="main" />
            <SectionHeader title="Drinks" />
            <MenuList items={menu.drinks} type="drink" />
          </div>
          <div className="col-md-3">
            <SectionHeader title="Desserts" />
            <MenuList items={menu.desserts} type="dessert" />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-3 d-flex align-items-center justify-content-center">
            <div className="bg-warning text-dark rounded p-3 text-center">
              <div className="fw-bold">FREE DELIVERY</div>
              <div>25% OFF</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
