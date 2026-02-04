export const logInfo = (message: never) => {
  // eslint-disable-next-line no-console
  console.log(message);
};

/**
 * logWarning should be used to log anything that signals a problem that is not app breaking
 */
export const logWarning = (message: never) => {
  // eslint-disable-next-line no-console
  console.warn(message);
};

/**
 * logError should be used to log anything that is app breaking
 */
export const logError = (errorMessage: unknown) => {
  if (errorMessage instanceof Error) {
    console.error(errorMessage.message, errorMessage.stack);
  } else {
    console.error("ERROR: ", errorMessage);
  }
};
