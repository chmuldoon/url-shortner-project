const validateUrl = (url: string) => {
  return url.match(/^(http|https):\/\/[^ "]+$/);
};

export { validateUrl };
