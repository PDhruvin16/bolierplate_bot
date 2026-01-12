import { useCallback, useState } from 'react';
import Toast from 'react-native-toast-message';
import {
  downloadExcel,
  DownloadOptions,
  DownloadResult,
} from '../services/downloadService';

interface UseDownloadReturn {
  downloading: boolean;
  handleDownload: (
    opts: DownloadOptions,
  ) => Promise<DownloadResult | undefined>;
}

export function useDownload(): UseDownloadReturn {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async (opts: DownloadOptions) => {
    try {
      setDownloading(true);
      const res = await downloadExcel(opts);
      Toast.show({ type: 'success', text1: 'Downloaded', text2: res.path });
      return res;
    } catch (err: any) {
      const message = err?.message || 'Download failed';
      Toast.show({ type: 'error', text1: 'Error', text2: message });
    } finally {
      setDownloading(false);
    }
  }, []);

  return { downloading, handleDownload };
}

export default useDownload;
