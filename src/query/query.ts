export const pageNumberValidate = (pageNum: string): number => {
  return getMappedParam(pageNum, 1, 10);
};

export const pageSizeValidate = (pageSize: string): number => {
  return getMappedParam(pageSize, 10, 100);
};

const getMappedParam = (
  paramValue: string,
  defaultValue: number,
  maxValue: number,
): number => {
  const pageS = Number(paramValue);
  if (isNaN(pageS)) {
    return defaultValue;
  }
  if (pageS > maxValue) {
    return defaultValue;
  }
  return pageS;
};

export const termValidate = (searchName: string) => {
  return searchName ? searchName : '';
};
