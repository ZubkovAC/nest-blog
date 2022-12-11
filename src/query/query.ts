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
export const sortBlogBan = (sort: string) => {
  switch (sort) {
    case 'login':
      return 'login';
    case 'id':
      return 'id';
    default:
      return 'id';
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
export const sortCommentsValidation = (sort: string) => {
  switch (sort) {
    case 'id':
      return 'id';
    case 'content':
      return 'content';
    case 'userId':
      return 'userId';
    case 'userLogin':
      return 'userLogin';
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
export const banStatusValidation = (banStatus: string) => {
  switch (banStatus) {
    case 'banned':
      return true;
    case 'notBanned':
      return false;
    default:
      return null;
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
