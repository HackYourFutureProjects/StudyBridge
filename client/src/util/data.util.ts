export const formatDate = (iso: string) => {
  const date = new Date(iso);
  return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
};
