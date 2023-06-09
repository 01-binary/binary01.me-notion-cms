import { notionAPI } from '@/utils';

const getPage = async (pageId: string) => {
  try {
    const res = await notionAPI.getPage(pageId);
    return res;
  } catch {
    return null;
  }
};

export default getPage;
