import dayjsOriginal from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjsOriginal.extend(localizedFormat);

/** localizedFormat 플러그인이 적용된 dayjs 인스턴스 */
export const dayjsWithLocale = dayjsOriginal;
export default dayjsWithLocale;
