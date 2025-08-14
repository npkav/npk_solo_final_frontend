export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  API_ENDPOINTS: {
    CREATE_TREES: '/api/create-both-trees',
    GET_PREVIOUS_TREES: '/api/previous-trees',
    GET_TREE_BY_ID: (id: number) => `/api/tree/${id}`,
    DELETE_TREE: (id: number) => `/api/tree/${id}`,
  },
  FRONTEND: {
    PORT: import.meta.env.VITE_PORT || 3000,
  }
};

export const buildApiUrl = (endpoint: string): string => `${config.API_BASE_URL}${endpoint}`;
