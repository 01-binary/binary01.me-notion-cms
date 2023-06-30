import { notionAPI } from '@/utils';

const getPage = async (pageId: string) => {
  const res = await notionAPI.getPage(pageId);
  return res;
};

export default getPage;
