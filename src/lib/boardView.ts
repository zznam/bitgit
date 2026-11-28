// The board's filters and sort survive restarts. The search box does not: a stale query that
// hides projects is more confusing than retyping one.
import { SORT_ORDERS, type SortOrder } from './boardViews';

export interface BoardView {
  statusFilter: string;
  showArchived: boolean;
  favoritesOnly: boolean;
  selectedLabels: string[];
  sortBy: SortOrder;
}

export const DEFAULT_BOARD_VIEW: BoardView = {
  statusFilter: 'all',
  showArchived: false,
  favoritesOnly: false,
  selectedLabels: [],
  sortBy: 'favorite',
};

export const BOARD_STATUSES = [
  'all',
  'synced',
  'needs_push',
  'needs_merge',
  'needs_sync',
  'ready',
  'github_only',
  'local_only',
  'not_configured',
] as const;

/** Menu labels for each status filter value, in menu order. */
export const BOARD_STATUS_LABELS: Record<(typeof BOARD_STATUSES)[number], string> = {
  all: 'All Status',
  synced: 'Synced',
  needs_push: 'Needs Push',
  needs_merge: 'Needs Merge',
  needs_sync: 'Needs Sync',
  ready: 'Ready',
  github_only: 'GitHub Only',
  local_only: 'Local Only',
  not_configured: 'Not Configured',
};

/** How many projects each status option would show; `all` is the total. */
export function statusCounts(projects: { projectStatus?: string | null }[]): Record<string, number> {
  const counts: Record<string, number> = Object.fromEntries(BOARD_STATUSES.map((status) => [status, 0]));
  for (const project of projects) {
    counts.all += 1;
    const status = project.projectStatus;
    if (status && status !== 'all' && Object.prototype.hasOwnProperty.call(counts, status)) counts[status] += 1;
  }
  return counts;
}

const STORAGE_KEY = 'bitgit.boardView.v1';
const MAX_SAVED_LABELS = 50;

// One entry per label regardless of case; the first spelling wins, as in labelCatalog.
function firstSpellings(labels: string[]): string[] {
  const byKey = new Map<string, string>();
  for (const label of labels) if (!byKey.has(label.toLowerCase())) byKey.set(label.toLowerCase(), label);
  return [...byKey.values()];
}

// Anything unknown or malformed falls back to the default for that field only.
export function parseBoardView(raw: string | null): BoardView {
  let value: unknown;
  try {
    value = raw ? JSON.parse(raw) : null;
  } catch {
    return { ...DEFAULT_BOARD_VIEW };
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { ...DEFAULT_BOARD_VIEW };
  const data = value as Record<string, unknown>;
  const labels = Array.isArray(data.selectedLabels)
    ? data.selectedLabels.filter((label): label is string => typeof label === 'string' && label.trim() !== '')
    : [];
  return {
    statusFilter: (BOARD_STATUSES as readonly unknown[]).includes(data.statusFilter)
      ? (data.statusFilter as string)
      : DEFAULT_BOARD_VIEW.statusFilter,
    showArchived: data.showArchived === true,
    favoritesOnly: data.favoritesOnly === true,
    selectedLabels: firstSpellings(labels).slice(0, MAX_SAVED_LABELS),
    sortBy: SORT_ORDERS.includes(data.sortBy as SortOrder) ? (data.sortBy as SortOrder) : DEFAULT_BOARD_VIEW.sortBy,
  };
}

export function loadBoardView(): BoardView {
  try {
    return parseBoardView(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return { ...DEFAULT_BOARD_VIEW };
  }
}

export function saveBoardView(view: BoardView): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(view));
  } catch {
    // Storage can be unavailable; the view still works for this session.
  }
}

export function isDefaultBoardView(view: BoardView): boolean {
  return (
    view.statusFilter === DEFAULT_BOARD_VIEW.statusFilter &&
    view.showArchived === DEFAULT_BOARD_VIEW.showArchived &&
    view.favoritesOnly === DEFAULT_BOARD_VIEW.favoritesOnly &&
    view.selectedLabels.length === 0 &&
    view.sortBy === DEFAULT_BOARD_VIEW.sortBy
  );
}
