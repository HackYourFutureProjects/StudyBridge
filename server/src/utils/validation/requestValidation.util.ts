export const validatePaginationParams = (page?: string, limit?: string) => {
  let validatedPage: number | undefined;
  let validatedLimit: number | undefined;

  if (page) {
    validatedPage = parseInt(page, 10);
    if (isNaN(validatedPage)) {
      throw new Error("Invalid page parameter");
    }
  }

  if (limit) {
    validatedLimit = parseInt(limit, 10);
    if (isNaN(validatedLimit)) {
      throw new Error("Invalid limit parameter");
    }
  }

  return { page: validatedPage, limit: validatedLimit };
};

export const validateAuthorization = (userId?: string) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
};
