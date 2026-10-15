type Reporter = (error: unknown) => void;

let reporter: Reporter = (error) => {
  if (__DEV__) console.warn(error);
};

/** Called once by the shell with the crash reporter's non-fatal capture. */
export const registerReporter = (next: Reporter): void => {
  reporter = next;
};

export const report = (error: unknown): void => {
  reporter(error);
};
