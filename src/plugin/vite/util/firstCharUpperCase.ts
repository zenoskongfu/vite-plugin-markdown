const firstCharUpperCase = (str: string) => {
  return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
};

export default firstCharUpperCase;
