import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import { requestStoragePermission } from '../utils/permissions';
import { APP_DOWNLOAD_DIR, ensureDownloadDirectory } from './startupService';

type Primitive = string | number | boolean | undefined | null;
type Query = Record<string, Primitive | Primitive[] | undefined> | undefined;

function buildQueryString(query: Query): string {
  if (!query) return '';
  const params = Object.entries(query)
    .filter(([, v]) => typeof v !== 'undefined' && v !== null && v !== '')
    .flatMap(([k, v]) => {
      if (Array.isArray(v)) {
        // join arrays by comma, e.g. columns=name,email,phone
        const joined = v
          .filter(
            item => typeof item !== 'undefined' && item !== null && item !== '',
          )
          .map(item => String(item))
          .join(',');
        return `${encodeURIComponent(k)}=${encodeURIComponent(joined)}`;
      }
      return `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`;
    })
    .join('&');
  return params ? `?${params}` : '';
}

function getBaseUrl(): string {
  // Prefer env BASE_URL; fallback to common local defaults used in the app
  const fromEnv = (Config as any)?.BASE_URL;
  if (fromEnv) return String(fromEnv).replace(/\/$/, '');
  // Fallbacks seen elsewhere in the codebase
  return 'http://192.168.7.7:8005';
}

function resolveUrl(endpoint: string, query?: Query): string {
  const base = getBaseUrl();
  const isAbsolute = /^https?:\/\//i.test(endpoint);
  const url = isAbsolute
    ? endpoint
    : `${base}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  return `${url}${buildQueryString(query)}`;
}

export interface DownloadOptions {
  endpoint: string; // absolute or relative API path
  query?: Query; // optional query params
  fileName: string; // e.g., report.xlsx
  mimeType?: string; // defaults to xlsx
  description?: string; // Android download manager description
  // Optional: specific columns to include in export; if omitted, server returns full dataset
  selectedColumns?: string[];
  // Optional: override server parameter name for columns; defaults to 'columns'
  columnsParam?: string;
  // If provided or when selectedColumns is set, performs a POST with JSON body
  transport?: 'get' | 'post';
  // Body key for selected columns when using POST JSON (e.g., 'fields')
  fieldsParam?: string;
  // Custom POST body to send as JSON; overrides fieldsParam/selectedColumns
  postBody?: Record<string, any>;
  // Extra headers to include in request (merged with Authorization)
  headers?: Record<string, string>;
}

export interface DownloadResult {
  path: string;
}

export async function downloadExcel(
  options: DownloadOptions,
): Promise<DownloadResult> {
  const {
    endpoint,
    query,
    fileName,
    mimeType,
    description,
    selectedColumns,
    columnsParam,
    transport,
    fieldsParam,
    postBody,
    headers,
  } = options;

  // Android storage permission for legacy devices
  if (Platform.OS === 'android') {
    const granted = await requestStoragePermission();
    if (!granted) {
      throw new Error('Storage permission not granted');
    }
  }

  // Determine if we should use POST (JSON body) or GET (querystring)
  const shouldPost =
    transport === 'post' ||
    (!!selectedColumns && selectedColumns.length > 0 && transport !== 'get');

  // For GET: add columns into query; For POST: keep query untouched for non-column filters
  const mergedQuery: Query = shouldPost
    ? query || {}
    : {
        ...(query || {}),
        ...(selectedColumns && selectedColumns.length > 0
          ? { [columnsParam || 'columns']: selectedColumns }
          : {}),
      };

  const url = resolveUrl(endpoint, mergedQuery);

  // Attach auth token manually when using DownloadManager is not available
  const token = await AsyncStorage.getItem('authToken');

  if (!shouldPost) {
    if (Platform.OS === 'android') {
      // Prefer Android DownloadManager for proper user-visible downloads
      const downloadsDir = await ensureDownloadDirectory().catch(
        () => RNFS.DownloadDirectoryPath,
      );
      const destination = `${downloadsDir}/${fileName}`;

      // Ensure Downloads directory exists
      const dirExists = await RNFS.exists(downloadsDir);
      if (!dirExists) {
        try {
          await RNFS.mkdir(downloadsDir);
        } catch (e) {
          // If creation fails, still attempt download manager path write
        }
      }

      const download = RNFS.downloadFile({
        fromUrl: url,
        toFile: destination,
        background: true,
        discretionary: true,
        headers: token
          ? { Authorization: `Bearer ${token}`, ...(headers || {}) }
          : headers || undefined,
        progressDivider: 5,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: fileName,
          description: description || 'Downloading file',
          mime:
            mimeType ||
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          mediaScannable: true,
          path: destination,
        },
      } as any);

      const result = await download.promise;
      if (result.statusCode >= 200 && result.statusCode < 300) {
        return { path: destination };
      }
      throw new Error(`Download failed with status ${result.statusCode}`);
    }

    // iOS: save into app-specific Documents/Downloads directory
    const documentsDir = await ensureDownloadDirectory().catch(
      () => RNFS.DocumentDirectoryPath,
    );
    const destination = `${documentsDir}/${fileName}`;

    // Ensure Documents directory exists
    const dirExists = await RNFS.exists(documentsDir);
    if (!dirExists) {
      try {
        await RNFS.mkdir(documentsDir);
      } catch (e) {
        // proceed; RNFS will error if truly missing
      }
    }

    const download = RNFS.downloadFile({
      fromUrl: url,
      toFile: destination,
      background: true,
      discretionary: true,
      headers: token
        ? { Authorization: `Bearer ${token}`, ...(headers || {}) }
        : headers || undefined,
      progressDivider: 5,
    });

    const result = await download.promise;
    if (result.statusCode >= 200 && result.statusCode < 300) {
      return { path: destination };
    }
    throw new Error(`Download failed with status ${result.statusCode}`);
  }

  // POST-based download with JSON body, using fetch + RNFS write
  const dir = await ensureDownloadDirectory().catch(() =>
    Platform.OS === 'android'
      ? RNFS.DownloadDirectoryPath
      : RNFS.DocumentDirectoryPath,
  );
  const destination = `${dir}/${fileName}`;

  const jsonBody =
    postBody ??
    (selectedColumns && selectedColumns.length > 0
      ? { [fieldsParam || 'fields']: selectedColumns }
      : {});

  const fetchHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {}),
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: fetchHeaders,
    body: JSON.stringify(jsonBody),
  } as any);

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Download failed (${response.status}): ${text}`);
  }

  const arrayBuffer = await (response as any).arrayBuffer();
  const base64Data = arrayBufferToBase64(arrayBuffer);
  await RNFS.writeFile(destination, base64Data, 'base64');
  return { path: destination };
}

export default { downloadExcel };

// Helpers
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(
      null,
      Array.from(chunk) as unknown as number[],
    );
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).btoa) {
    return (globalThis as any).btoa(binary);
  }
  // Fallback polyfill
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let i = 0;
  while (i < binary.length) {
    const c1 = binary.charCodeAt(i++);
    const c2 = binary.charCodeAt(i++);
    const c3 = binary.charCodeAt(i++);
    const e1 = c1 >> 2;
    const e2 = ((c1 & 3) << 4) | (c2 >> 4);
    const e3 = isNaN(c2) ? 64 : ((c2 & 15) << 2) | (c3 >> 6);
    const e4 = isNaN(c3) ? 64 : c3 & 63;
    output +=
      chars.charAt(e1) + chars.charAt(e2) + chars.charAt(e3) + chars.charAt(e4);
  }
  return output;
}
