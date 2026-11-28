import { useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { SHORTCUTS, shortcutKeyLabels } from '../lib/shortcuts';
import { useDismiss } from '../lib/useDismiss';

export function ShortcutsModal({ open, isMac, onClose }: { open: boolean; isMac: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useDismiss(panel, open, close);
  useEffect(() => {
    if (open) closeButton.current?.focus();
  }, [open]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="shortcuts-title" className="text-lg font-semibold text-gray-900 dark:text-white">
            Keyboard shortcuts
          </h2>
          <button
            ref={closeButton}
            onClick={close}
            aria-label="Close keyboard shortcuts"
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <dl className="space-y-2">
          {SHORTCUTS.map((shortcut) => (
            <div key={shortcut.action} className="flex items-center justify-between gap-4">
              <dt className="text-sm text-gray-700 dark:text-gray-300">{shortcut.action}</dt>
              <dd className="flex shrink-0 gap-1">
                {shortcutKeyLabels(shortcut.keys, isMac).map((key) => (
                  <kbd
                    key={key}
                    className="rounded border border-gray-300 bg-gray-50 px-2 py-0.5 font-mono text-xs text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  >
                    {key}
                  </kbd>
                ))}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Ctrl works on every platform{isMac ? '; ⌘ works too' : ''}.
        </p>
      </div>
    </div>
  );
}
