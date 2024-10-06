import type { NextApiRequest, NextApiResponse } from 'next';

import { notionClient } from '@/utils';

import { IMAGE_MAX_AGE } from '@/assets/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.NOTION_PROFILE_ID) throw new Error('NOTION_PROFILE_ID is not defined');
  const pageId = process.env.NOTION_PROFILE_ID;
  try {
    const response = await notionClient.pages.retrieve({
      page_id: pageId,
    });

    // 타입 체크를 위한 조건문 추가
    if (!('properties' in response) || !response.properties.media) {
      return res.status(404).json({ message: 'Media files not found' });
    }

    // 타입 선언 후 안전하게 접근
    const mediaProperty = response.properties.media;

    // media 파일 배열이 비어있지 않은지 확인 후 파일 URL 추출
    if (
      'files' in mediaProperty &&
      mediaProperty.files.length > 0 &&
      'file' in mediaProperty.files[0]
    ) {
      const fileUrl = mediaProperty.files[0].file.url;
      const response = await fetch(fileUrl);
      const contentType = response.headers.get('content-type');

      if (!contentType) throw new Error('content header does not exist');

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', `public, s-maxage=${IMAGE_MAX_AGE}, max-age=${IMAGE_MAX_AGE}`);

      res.send(Buffer.from(await response.arrayBuffer()));
    } else {
      return res.status(404).json({ message: 'No file found' });
    }
  } catch (error) {
    console.error('Error retrieving page:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
