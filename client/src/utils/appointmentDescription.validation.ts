export const MAX_DESCRIPTION_WORDS = 50;

export const countWords = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

export const isDescriptionValid = (description: string): boolean => {
  const wordCount = countWords(description);
  return wordCount <= MAX_DESCRIPTION_WORDS;
};

export const getDescriptionValidation = (description: string) => {
  const wordCount = countWords(description);
  const isValid = wordCount <= MAX_DESCRIPTION_WORDS;
  
  return {
    wordCount,
    isValid,
    maxWords: MAX_DESCRIPTION_WORDS,
  };
};