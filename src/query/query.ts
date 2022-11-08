import { bloggersSchema } from '../bloggers/blogger.schemas';

export const pageNumberValidate = (pageNum: string): number => {
  return getMappedParam(pageNum, 1, 10);
};

export const pageSizeValidate = (pageSize: string): number => {
  return getMappedParam(pageSize, 10, 100);
};

// 1 sort name +- / sort direction +-

export const sortBlogs = (typeSort: string, blogs: Array<bloggersSchema>) => {
  if (!typeSort) return blogs;
  if (
    typeSort === 'asc' ||
    typeSort === 'desc' ||
    typeSort === 'createdAt' ||
    typeSort === 'createdOld'
  ) {
    let sortValue = 'createdAt';
    if (typeSort === 'asc' || typeSort === 'desc') sortValue = 'name';
    let one = 1;
    let two = -1;
    if (typeSort === 'asc') {
      one = -1;
      two = 1;
    }

    return blogs.sort((a, b) => {
      const nameA = a[sortValue].toUpperCase(); // ignore upper and lowercase
      const nameB = b[sortValue].toUpperCase(); // ignore upper and lowercase
      if (nameA > nameB) {
        return one;
      }
      if (nameA < nameB) {
        return two;
      }

      // names must be equal
      return 0;
    });
  }
  return blogs;
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
