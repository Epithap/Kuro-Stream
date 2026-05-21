const HISTORY_KEY = 'manga_reading_history';

export const historyManager = {
  getHistory: () => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(HISTORY_KEY);
        return data ? JSON.parse(data) : {};
      }
      return {};
    } catch (e) {
      console.error('Failed to parse reading history', e);
      return {};
    }
  },

  saveHistory: (mangaId, data) => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const history = historyManager.getHistory();
        history[mangaId] = {
          ...data,
          timestamp: Date.now()
        };
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      }
    } catch (e) {
      console.error('Failed to save reading history', e);
    }
  },

  getMangaHistory: (mangaId) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const history = historyManager.getHistory();
      return history[mangaId] || null;
    }
    return null;
  }
};
