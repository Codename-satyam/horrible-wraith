// Tiny, failure-proof save slot so a refresh never sends her back to the cover.
// Everything stays on this device. Add ?reset to the URL to start fresh (handy while you test).
const KEY = 'birthday-canvas:v1';

const read = () => {
  try { return JSON.parse(window.localStorage.getItem(KEY)) || {}; } catch { return {}; }
};

export const loadProgress = () => {
  try {
    if (new URLSearchParams(window.location.search).has('reset')) { window.localStorage.removeItem(KEY); return {}; }
  } catch { /* ignore */ }
  return read();
};

export const saveProgress = (patch) => {
  try { window.localStorage.setItem(KEY, JSON.stringify({ ...read(), ...patch })); } catch { /* storage blocked: fine */ }
};

export const clearProgress = () => {
  try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
};
