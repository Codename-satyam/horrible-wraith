import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => { cleanup(); window.localStorage.clear(); });
window.matchMedia = window.matchMedia || ((q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();
HTMLElement.prototype.focus = HTMLElement.prototype.focus || vi.fn();
