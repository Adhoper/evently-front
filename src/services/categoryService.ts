import api from "../api/axios";

import type {
  Category,
} from "../types/category";

export const getCategories =
  async (): Promise<Category[]> => {
    const response =
      await api.get<Category[]>(
        "/categories"
      );

    return response.data;
  };