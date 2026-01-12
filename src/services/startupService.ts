import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { requestStoragePermission } from '../utils/permissions';
import log from '../utils/logger';

// App-specific download directory names
export const APP_DOWNLOAD_DIR_NAME = 'AiCRM_Documents';

// Full paths for app downloads per platform
export const APP_DOWNLOAD_DIR = Platform.select({
  android: `${RNFS.DownloadDirectoryPath}/${APP_DOWNLOAD_DIR_NAME}`,
  ios: `${RNFS.DocumentDirectoryPath}/Downloads`,
}) as string;

/**
 * Ensures the app-specific download directory exists.
 * Creates it if missing. Returns the absolute path.
 */
export async function ensureDownloadDirectory(): Promise<string> {
  const dirPath = APP_DOWNLOAD_DIR;
  const exists = await RNFS.exists(dirPath);
  if (!exists) {
    await RNFS.mkdir(dirPath);
  }
  return dirPath;
}

/**
 * Request necessary permissions and prepare filesystem locations
 * to be used across the app at startup.
 */
export async function initializeAppOnStart(): Promise<void> {
  if (Platform.OS === 'android') {
    // Request legacy external storage permission (for Android <=12)
    await requestStoragePermission();
  }

  // Ensure app download directory exists on both platforms
  try {
    await ensureDownloadDirectory();
  } catch (error) {
    log.error('Failed to ensure download directory', error);
  }
}

export default {
  initializeAppOnStart,
  ensureDownloadDirectory,
  APP_DOWNLOAD_DIR,
  APP_DOWNLOAD_DIR_NAME,
};