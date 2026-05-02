import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers); // 👈 C'est cette ligne qui débloque .toBeInTheDocument()

afterEach(() => {
  cleanup();
});