import { motion } from 'motion/react';
import { Outlet } from 'react-router';
import MainNavigation from './MainNavigation';
import { floatingOrb } from '../animations/presets';

export default function Layout() {
  return (
    <div className="app-container">
      {/* Floating background orbs */}
      <div className="bg-orbs">
        <motion.div
          className="bg-orb bg-orb--1"
          {...floatingOrb(0)}
        />
        <motion.div
          className="bg-orb bg-orb--2"
          {...floatingOrb(1.5)}
        />
        <motion.div
          className="bg-orb bg-orb--3"
          {...floatingOrb(3)}
        />
      </div>

      {/* Page content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Global Navigation */}
      <MainNavigation />
    </div>
  );
}
