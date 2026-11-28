// The board's keyboard shortcuts, listed once for the help panel. The handler lives in
// Dashboard.tsx; keep the two in step when adding a shortcut.
export interface Shortcut {
  /** "Mod" is Ctrl everywhere and also ⌘ on macOS. */
  keys: string[];
  action: string;
}

export const SHORTCUTS: Shortcut[] = [
  { keys: ['Mod', 'R'], action: "Refresh every project's Git state" },
  { keys: ['Mod', 'N'], action: 'Add a project' },
  { keys: ['Mod', 'F'], action: 'Focus the project search' },
  { keys: ['Mod', 'A'], action: 'Select the projects shown' },
  { keys: ['Esc'], action: 'Clear the selection or close this panel' },
  { keys: ['Mod', 'D'], action: 'Toggle light and dark theme' },
  { keys: ['?'], action: 'Show these shortcuts' },
];

export function shortcutKeyLabels(keys: string[], isMac: boolean): string[] {
  return keys.map((key) => (key === 'Mod' ? (isMac ? '⌘' : 'Ctrl') : key));
}

/** "?" opens the help panel, unless the user is typing or holding Ctrl/⌘/Alt. */
export function isHelpShortcut(event: { key: string; ctrlKey: boolean; metaKey: boolean; altKey: boolean }, isInputField: boolean): boolean {
  return event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey && !isInputField;
}
