import React, { useRef, useEffect, useState } from 'react';
import Galaxy from './Galaxy';
import { FaInstagram, FaWhatsapp, FaLinkedinIn } from 'react-icons/fa6';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import './App.css';

export default function App() {
  const heroRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Pointer position normalized to [-0.5, 0.5] relative to center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apple WWDC critically damped spring physics
  const springConfig = { damping: 28, stiffness: 220, mass: 0.9 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Subtle physical 3D parallax tilt (restrained, max +/- 4 deg)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], reducedMotion ? [0, 0] : [4, -4]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], reducedMotion ? [0, 0] : [-4, 4]);

  const handlePointerMove = (e) => {
    if (reducedMotion || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const brandIdentity = "ORIGINS RISE CONQUER • EVOLVE";

  // Reusable spring for interactive buttons (instant tactile response on pointer-down)
  const buttonSpring = {
    type: 'spring',
    damping: 20,
    stiffness: 380,
    mass: 0.6
  };

  return (
    <main
      className="maintenance-viewport"
      role="main"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* 1. Full-screen Animated Galaxy Background Layer */}
      <div className="galaxy-bg-layer" aria-hidden="true">
        <Galaxy
          density={1}
          glowIntensity={0.3}
          flareIntensity={1}
          starSpeed={0.5}
          mouseRepulsion={true}
          clickWarp={true}
          className="fullscreen-galaxy"
        />
      </div>

      {/* Atmospheric Spatial Lighting */}
      <div className="ambient-glow ambient-glow-top" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-bottom" aria-hidden="true" />

      {/* 2. Vertically & Horizontally Centered Content Overlay (No glass card background) */}
      <div className="content-container">
        <motion.article
          ref={heroRef}
          className="floating-content-hero"
          aria-label={brandIdentity}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            perspective: 1000
          }}
          initial={{
            opacity: 0,
            scale: reducedMotion ? 1 : 0.96
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            type: 'spring',
            damping: 26,
            stiffness: 180,
            mass: 1
          }}
        >
          {/* Big Centered Logo & Brand Identity */}
          <section className="brand-logo-container" aria-label={brandIdentity}>
            <span className="sr-only">{brandIdentity}</span>

            <motion.div
              className="logo-wrapper"
              whileHover={reducedMotion ? {} : { scale: 1.02 }}
              transition={buttonSpring}
            >
              <img
                src="/origins-logo-white.svg"
                alt={brandIdentity}
                className="brand-image"
              />
            </motion.div>
          </section>

          {/* Subheading */}
          <div className="typography-section">
            <p className="maintenance-subheading">
              We&apos;re currently upgrading our experience. Stay connected with us below.
            </p>
          </div>

          {/* Apple-style Frosted Social Pills */}
          <nav className="social-links-row" aria-label="Social media connections">
            <motion.a
              href="https://www.instagram.com/originsindia"
              target="_blank"
              rel="noopener noreferrer"
              className="apple-social-pill social-pill-instagram"
              aria-label="Follow ORIGINS on Instagram"
              whileHover={reducedMotion ? {} : { scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96, y: 0 }}
              transition={buttonSpring}
            >
              <FaInstagram className="social-icon" aria-hidden="true" />
              <span>Instagram</span>
            </motion.a>

            <motion.a
              href="https://chat.whatsapp.com/DFzBqXjA7CW3ahiEPE5z5S"
              target="_blank"
              rel="noopener noreferrer"
              className="apple-social-pill social-pill-whatsapp"
              aria-label="Join ORIGINS WhatsApp Community"
              whileHover={reducedMotion ? {} : { scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96, y: 0 }}
              transition={buttonSpring}
            >
              <FaWhatsapp className="social-icon" aria-hidden="true" />
              <span>WhatsApp</span>
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/company/origins-india/home/"
              target="_blank"
              rel="noopener noreferrer"
              className="apple-social-pill social-pill-linkedin"
              aria-label="Connect with ORIGINS on LinkedIn"
              whileHover={reducedMotion ? {} : { scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96, y: 0 }}
              transition={buttonSpring}
            >
              <FaLinkedinIn className="social-icon" aria-hidden="true" />
              <span>LinkedIn</span>
            </motion.a>
          </nav>
        </motion.article>
      </div>
    </main>
  );
}
