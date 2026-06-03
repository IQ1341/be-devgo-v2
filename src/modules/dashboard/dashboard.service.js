import * as repository from "./dashboard.repository.js";

export const getOverview =
  async () => {
    return await repository.getOverview();
  };