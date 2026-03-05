export const MAX_DESCRIPTION_CHARACTERS = 500;

export const isDescriptionValid = (description: string): boolean => {
  return description.trim().length <= MAX_DESCRIPTION_CHARACTERS;
};

export const getDescriptionValidation = (description: string) => {
  const characterCount = description.trim().length;
  const isValid = characterCount <= MAX_DESCRIPTION_CHARACTERS;

  return {
    characterCount,
    isValid,
    maxCharacters: MAX_DESCRIPTION_CHARACTERS,
  };
};
