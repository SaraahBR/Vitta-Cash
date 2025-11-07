'use client';

import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import './layout.css';

export default function Layout({ children, semFooter = false }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-main">{children}</main>
      {!semFooter && <Footer />}
    </div>
  );
}
