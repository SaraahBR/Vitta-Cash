'use client';

import PropTypes from 'prop-types';
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

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  semFooter: PropTypes.bool,
};
