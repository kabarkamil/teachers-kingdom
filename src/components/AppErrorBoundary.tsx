import React from 'react';
import { AlertTriangle, Download, RotateCcw } from 'lucide-react';
import { STORAGE_KEY_PREFS, STORAGE_KEY_STATE } from '../utils/dataPortability';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Beklenmeyen çalışma hatası',
    };
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleExportRawStorage = () => {
    try {
      const snapshot = {
        exportedAt: new Date().toISOString(),
        recoverySnapshot: true,
        rawProgress: window.localStorage.getItem(STORAGE_KEY_STATE),
        rawPrefs: window.localStorage.getItem(STORAGE_KEY_PREFS),
      };
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
        type: 'application/json;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teachers-kingdom-kurtarma-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      // Ignore export errors during emergency recovery
    }
  };

  private handleResetAndReload = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY_STATE);
      window.localStorage.removeItem(STORAGE_KEY_PREFS);
    } catch {
      // Ignore storage errors
    }
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F6F4] p-6 text-[#111113] dark:bg-[#0B0B0D] dark:text-[#F4F4F5]">
        <div
          role="alert"
          className="w-full max-w-lg rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 shadow-sm dark:border-[#282830] dark:bg-[#16161A]"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-6 w-6 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">
                Teachers Kingdom · Güvenli Kurtarma Ekranı
              </p>
              <h1 className="font-display text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Beklenmeyen bir arayüz hatası oluştu
              </h1>
              <p className="text-sm leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                Yerel ilerleme veriniz silinmedi. Sayfayı yeniden yükleyebilir veya gerekirse önce ham yerel depolama yedeğini indirip oturumu temizleyebilirsiniz.
              </p>
              {this.state.errorMessage && (
                <p className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] px-3 py-2 font-mono text-xs text-[#52525B] dark:border-[#24242C] dark:bg-[#111113] dark:text-[#A1A1AA] break-words">
                  {this.state.errorMessage}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Sayfayı Yeniden Yükle</span>
            </button>
            <button
              type="button"
              onClick={this.handleExportRawStorage}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#1E1E24] dark:text-[#F4F4F5]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Ham Veriyi İndir</span>
            </button>
            <button
              type="button"
              onClick={this.handleResetAndReload}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#B91C1C]/40 px-4 text-xs font-medium text-[#991B1B] transition-colors hover:bg-[#FEF2F2] dark:border-[#EF4444]/40 dark:text-[#FCA5A5] dark:hover:bg-[#450A0A]/40"
            >
              <span>Yerel Veriyi Temizle ve Yenile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
