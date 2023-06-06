import { notionAPI } from '@/utils';

const getPage = async (pageId: string) => {
  try {
    const response = await notionAPI.getPage(pageId);
    return response;
  } catch {
    return null;
  }
};

export default getPage;
