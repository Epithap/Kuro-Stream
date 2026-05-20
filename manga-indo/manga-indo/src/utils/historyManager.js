const HISTORY_KEY = 'manga_reading_history';

export const historyManager = {
  getHistory: () => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to parse reading history', e);
      return {};
    }
  },

  saveHistory: (mangaId, data) => {
    try {
      const history = historyManager.getHistory();
      history[mangaId] = {
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save reading history', e);
    }
  },

  getMangaHistory: (mangaId) => {
    const history = historyManager.getHistory();
    return history[mangaId] || null;
  }
};
