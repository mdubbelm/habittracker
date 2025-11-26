/**
 * Main Entry Point
 *
 * This is the entry point for the Vite build.
 * It imports styles and initializes the application.
 */

// Import styles (Vite handles CSS bundling)
import './styles/main.css';

// Import and initialize the app
import { initializeApp } from './js/app.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
