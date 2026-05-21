import axios from 'axios';

// AniList GraphQL endpoint
const ANILIST_URL = 'https://graphql.anilist.co';

// Helper to perform GraphQL queries via axios
const gql = async (query, variables = {}) => {
  const response = await axios.post(ANILIST_URL, {
    query,
    variables,
  });
  return response.data;
};

// Map AniList anime object to internal format
const mapAniListAnime = (anime) => ({
  id: String(anime.id),
  title: anime.title?.english || anime.title?.romaji || anime.title?.native || '',
  titleJP: anime.title?.native || '',
  coverUrl: anime.coverImage?.extraLarge || anime.coverImage?.large || anime.coverImage?.medium || '',
  status: anime.status || 'UNKNOWN',
  episodes: anime.episodes || '?',
  score: anime.averageScore ? anime.averageScore / 10 : 0,
  synopsis: anime.description ? anime.description.replace(/<[^>]*>/g, '') : '',
  tags: (anime.genres || []).concat(anime.tags?.map(t => t.name) || []),
  year: anime.seasonYear,
  studios: anime.studios?.nodes?.map(s => s.name) || [],
  format: anime.format || '',
  source: 'anilist',
});

export const anilistSource = {
  // Trending anime (sorted by popularity descending)
  getTrendingAnime: async (limit = 20, page = 1) => {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(type: ANIME, sort: POPULARITY_DESC) {
            id
            title { romaji english native }
            coverImage { extraLarge large medium }
            status
            episodes
            averageScore
            description
            genres
            tags { name }
            seasonYear
            studios { nodes { name } }
          }
        }
      }
    `;
    const variables = { page, perPage: limit };
    const data = await gql(query, variables);
    const media = data?.data?.Page?.media || [];
    return media.map(mapAniListAnime);
  },

  // Search anime by query string
  searchAnime: async (search, limit = 20, page = 1) => {
    const query = `
      query ($search: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(search: $search, type: ANIME) {
            id
            title { romaji english native }
            coverImage { extraLarge large medium }
            status
            episodes
            averageScore
            description
            genres
            tags { name }
            seasonYear
            studios { nodes { name } }
          }
        }
      }
    `;
    const variables = { search, page, perPage: limit };
    const data = await gql(query, variables);
    const media = data?.data?.Page?.media || [];
    return media.map(mapAniListAnime);
  },

  // Get movie list (format: MOVIE)
  getMovies: async (limit = 24, page = 1) => {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(type: ANIME, format: MOVIE, sort: POPULARITY_DESC) {
            id
            title { romaji english native }
            coverImage { extraLarge large medium }
            status
            episodes
            averageScore
            description
            genres
            tags { name }
            seasonYear
            studios { nodes { name } }
            format
          }
        }
      }
    `;
    const variables = { page, perPage: limit };
    const data = await gql(query, variables);
    const media = data?.data?.Page?.media || [];
    return media.map(mapAniListAnime);
  },

  // Get anime detail by ID (numeric)
  getAnimeDetail: async (id) => {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title { romaji english native }
          coverImage { extraLarge large medium }
          status
          episodes
          averageScore
          description
          genres
          tags { name }
          seasonYear
          studios { nodes { name } }
        }
      }
    `;
    const variables = { id: Number(id) };
    const data = await gql(query, variables);
    const anime = data?.data?.Media;
    return anime ? mapAniListAnime(anime) : null;
  },

  // Episodes and streaming not provided by AniList; callers will fall back to Jikan or backend.
  getAnimeEpisodes: async () => {
    return [];
  },

  getEpisodeStream: async () => {
    return { embedUrl: '' };
  },
};
