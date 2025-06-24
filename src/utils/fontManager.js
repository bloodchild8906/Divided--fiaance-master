﻿﻿﻿﻿﻿﻿// BULLETPROOF Font Management System - System Fonts Only
import { Font } from '@react-pdf/renderer';

// SAFEGUARD: Only use system fonts to prevent format errors
const SYSTEM_FONTS = {
  'Helvetica': 'Helvetica',
  'Arial': 'Arial',
  'Times-Roman': 'Times-Roman',
  'Courier': 'Courier'
};

// SAFEGUARD: Font mapping to prevent any external font loading
const FONT_MAPPING = {
  // Popular web fonts -> System fonts
  'Inter': 'Helvetica',
  'Roboto': 'Helvetica',
  'Open Sans': 'Arial',
  'Source Sans Pro': 'Arial',
  'Lato': 'Arial',
  'Montserrat': 'Arial',
  'Playfair Display': 'Times-Roman',
  'Merriweather': 'Times-Roman',
  'Georgia': 'Times-Roman',
  'Courier New': 'Courier',
  'Monaco': 'Courier',
  'Consolas': 'Courier',
  // System fonts -> themselves
  'Helvetica': 'Helvetica',
  'Arial': 'Arial',
  'Times-Roman': 'Times-Roman',
  'Courier': 'Courier'
};

// SAFEGUARD: Track registered fonts
const registeredFonts = new Set();
let fontsInitialized = false;

/**
 * BULLETPROOF: Initialize only system fonts with multiple safeguards
 */
const initializeSystemFonts = () => {
  if (fontsInitialized) return true;

  let successCount = 0;

  // SAFEGUARD 1: Only register known system fonts
  Object.entries(SYSTEM_FONTS).forEach(([family, src]) => {
    try {
      // SAFEGUARD 2: Check if already registered
      if (!registeredFonts.has(family)) {
        // SAFEGUARD 3: Wrap in try-catch for each font
        Font.register({
          family: family,
          src: src
        });
        registeredFonts.add(family);
        successCount++;
        console.log(`🔒 SAFE: Registered system font: ${family}`);
      } else {
        successCount++;
      }
    } catch (error) {
      // SAFEGUARD 4: Continue on individual font failure
      console.warn(`⚠️ SAFEGUARD: Failed to register ${family}, continuing...`, error);
    }
  });

  fontsInitialized = true;
  console.log(`🛡️ BULLETPROOF: ${successCount}/${Object.keys(SYSTEM_FONTS).length} system fonts ready`);

  return successCount > 0; // Return true if at least one font registered
};

// SAFEGUARD 5: Initialize immediately on module load
initializeSystemFonts();

/**
 * BULLETPROOF: Get safe font with guaranteed fallback
 */
export const getSafeFont = (requestedFont, ultimateFallback = 'Helvetica') => {
  // SAFEGUARD 1: Ensure system fonts are initialized
  initializeSystemFonts();

  // SAFEGUARD 2: Clean font name
  const cleanFont = (requestedFont || '').trim();

  // SAFEGUARD 3: Check if it's already a system font
  if (SYSTEM_FONTS[cleanFont]) {
    return cleanFont;
  }

  // SAFEGUARD 4: Map to system font
  const mappedFont = FONT_MAPPING[cleanFont];
  if (mappedFont && SYSTEM_FONTS[mappedFont]) {
    return mappedFont;
  }

  // SAFEGUARD 5: Ultimate fallback
  return ultimateFallback;
};

/**
 * BULLETPROOF: Register all fonts (system fonts only)
 */
export const registerAllFonts = async () => {
  console.log('🛡️ BULLETPROOF: Starting system font registration...');

  // SAFEGUARD: Force re-initialization if needed
  const success = initializeSystemFonts();

  const status = {
    successful: registeredFonts.size,
    total: Object.keys(SYSTEM_FONTS).length,
    registeredFonts: Array.from(registeredFonts),
    bulletproof: true
  };

  console.log(`🛡️ BULLETPROOF: Font system ready - ${status.successful}/${status.total} fonts available`);

  return status;
};

/**
 * BULLETPROOF: Get safe font family (alias for getSafeFont)
 */
export const getSafeFontFamily = (requestedFont) => {
  return getSafeFont(requestedFont);
};

/**
 * BULLETPROOF: Validate font availability
 */
export const validateFont = (fontFamily, weight = 400) => {
  // SAFEGUARD: Always return true for system fonts
  const safeFont = getSafeFont(fontFamily);
  return SYSTEM_FONTS[safeFont] !== undefined;
};

/**
 * BULLETPROOF: Get font registration status
 */
export const getFontStatus = () => {
  // SAFEGUARD: Ensure fonts are initialized
  initializeSystemFonts();

  return {
    registeredFonts: Array.from(registeredFonts),
    totalRegistered: registeredFonts.size,
    availableFamilies: Object.keys(SYSTEM_FONTS),
    systemFontsOnly: true,
    bulletproof: true
  };
};

/**
 * BULLETPROOF: Emergency font reset
 */
export const resetFonts = () => {
  console.log('🛡️ BULLETPROOF: Resetting to system fonts...');

  // SAFEGUARD: Clear and re-initialize
  registeredFonts.clear();
  fontsInitialized = false;

  // SAFEGUARD: Re-initialize system fonts
  const success = initializeSystemFonts();

  console.log(`🛡️ BULLETPROOF: Font reset complete - ${success ? 'SUCCESS' : 'PARTIAL'}`);
  return success;
};

/**
 * BULLETPROOF: Register custom font with safeguards
 */
export const registerCustomFont = (fontFamily, src, weight = 400) => {
  // SAFEGUARD 1: Validate inputs
  if (!fontFamily || !src) {
    console.warn('🛡️ SAFEGUARD: Invalid font parameters');
    return false;
  }

  // SAFEGUARD 2: Ensure system fonts are ready first
  initializeSystemFonts();

  const fontKey = `${fontFamily}-${weight}`;

  // SAFEGUARD 3: Check if already registered
  if (registeredFonts.has(fontKey)) {
    console.log(`🛡️ SAFEGUARD: Font ${fontFamily} (${weight}) already registered`);
    return true;
  }

  try {
    // SAFEGUARD 4: Validate font format before registration
    if (typeof src === 'string' && (
      src.includes('unknown') ||
      src.includes('invalid') ||
      (!src.startsWith('http') && !SYSTEM_FONTS[src])
    )) {
      console.warn(`🛡️ SAFEGUARD: Suspicious font source: ${src}`);
      return false;
    }

    // SAFEGUARD 5: Register with error handling
    Font.register({
      family: fontFamily,
      src: src,
      fontWeight: weight
    });

    registeredFonts.add(fontKey);
    registeredFonts.add(fontFamily);
    console.log(`🛡️ SAFE: Registered custom font: ${fontFamily} (${weight})`);
    return true;

  } catch (error) {
    // SAFEGUARD 6: Graceful failure
    console.warn(`🛡️ SAFEGUARD: Failed to register custom font ${fontFamily}, using system fallback:`, error);
    return false;
  }
};

/**
 * BULLETPROOF: Register multiple custom fonts
 */
export const registerCustomFonts = (fonts) => {
  if (!Array.isArray(fonts)) {
    console.warn('🛡️ SAFEGUARD: Invalid fonts array');
    return [];
  }

  const results = [];

  fonts.forEach(font => {
    if (font && typeof font === 'object') {
      const { family, src, weight = 400 } = font;
      const success = registerCustomFont(family, src, weight);
      results.push({ family, weight, success });
    } else {
      results.push({ family: 'invalid', weight: 0, success: false });
    }
  });

  return results;
};
