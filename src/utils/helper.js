import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const getChromeSessionPath = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const rootDir = join(__dirname, '../');

  return join(rootDir, 'storage', 'sessions');
};

export const getChromeBrowserPaths = () => {
  const isMac = process.platform === 'darwin';

  return {
    chromiumPath:
      process.env.CHROMIUM_PATH ||
      (isMac ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : '/usr/bin/chromium-browser'),
  };
};
