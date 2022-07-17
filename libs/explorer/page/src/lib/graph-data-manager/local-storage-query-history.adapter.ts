import { ExecutedQuery } from '@exec-graph/explorer/types';
import { DateTime } from 'luxon';

/**
 * This service manages the storing of the query history in local storage
 */
export class LocalStorageQueryHistoryAdapter {
  public static gavePermissionToStore(): boolean {
    return localStorage.getItem('execgraph-history-store') != null;
  }

  public static enableLocalStorage(withExistingHistory: ExecutedQuery[]): void {
    localStorage.setItem('execgraph-history-store', DateTime.utc().toISO());
    if (withExistingHistory) {
      LocalStorageQueryHistoryAdapter.storeHistory(withExistingHistory);
    }
  }

  public static disableLocalStorage(): void {
    localStorage.removeItem('execgraph-history');
    localStorage.removeItem('execgraph-history-store');
  }

  public static getStoredHistory(): ExecutedQuery[] | null {
    if (!LocalStorageQueryHistoryAdapter.gavePermissionToStore()) {
      const stored = localStorage.getItem('execgraph-history');
      return stored != null ? JSON.parse(stored || '[]') : null;
    }
    return null;
  }

  public static storeHistory(history: ExecutedQuery[]): void {
    if (LocalStorageQueryHistoryAdapter.gavePermissionToStore()) {
      return localStorage.setItem('execgraph-history', JSON.stringify(history));
    }
  }
}
