export const pageNumberValidate = (pageNum: string): number => {
  return getMappedParam(pageNum, 1, 10);
};

export const pageSizeValidate = (pageSize: string): number => {
  return getMappedParam(pageSize, 10, 100);
};

// 1 sort name +- / sort direction +-
export const sortBlogValidation = (sort: string) => {
  switch (sort) {
    case 'youtubeUrl':
      return 'youtubeUrl';
    case 'name':
      return 'name';
    case 'id':
      return 'id';
    default:
      return 'createdAt';
  }
};
export const sortUserValidation = (sort: string) => {
  switch (sort) {
    case 'userId':
      return 'accountData.userId';
    case 'login':
      return 'accountData.login';
    case 'email':
      return 'accountData.email';
    default:
      return 'accountData.createdAt';
  }
};
export const sortPostsValidation = (sort: string) => {
  switch (sort) {
    case 'id':
      return 'id';
    case 'title':
      return 'title';
    case 'shortDescription':
      return 'shortDescription';
    case 'content':
      return 'content';
    case 'blogId':
      return 'blogId';
    case 'blogName':
      return 'blogName';
    default:
      return 'createdAt';
  }
};
export const sortDirectionValidation = (sortDirection: string) => {
  switch (sortDirection) {
    case 'asc':
      return 1;
    default:
      return -1;
  }
};
export const searchValidation = (sortDirection: string) => {
  switch (sortDirection) {
    case undefined:
      return '';
    default:
      return sortDirection;
  }
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
