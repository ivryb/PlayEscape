export const isDev = (f) => {
  return process.env.NODE_ENV !== 'production';
};

export const useDev = (f) => {
  if (isDev()) {
    f();
  }
};
