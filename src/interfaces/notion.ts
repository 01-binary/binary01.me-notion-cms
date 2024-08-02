import { Block } from '@/interfaces/notion-block';
import { Collection, PropertyType } from '@/interfaces/notion-collection';
import { CollectionView, CollectionViewType } from '@/interfaces/notion-collection-view';

export type ID = string;

export type Role = 'editor' | 'reader' | 'none' | 'read_and_write';
export type Color =
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'gray_background'
  | 'brown_background'
  | 'orange_background'
  | 'yellow_background'
  | 'teal_background'
  | 'blue_background'
  | 'purple_background'
  | 'pink_background'
  | 'red_background';

export type BoldFormat = ['b'];
export type ItalicFormat = ['i'];
export type StrikeFormat = ['s'];
export type CodeFormat = ['c'];
export type UnderlineFormat = ['_'];
export type LinkFormat = ['a', string];
export type ExternalObjectInstanceFormat = ['eoi', string];
export type ColorFormat = ['h', Color];
export type UserFormat = ['u', string];
export type PageFormat = ['p', string];
export type InlineEquationFormat = ['e', string];
export type DiscussionFormat = ['m', string];
export type ExternalLinkFormat = ['‣', [string, string]];
export type DateFormat = ['d', FormattedDate];

export interface FormattedDate {
  type: 'date' | 'daterange' | 'datetime' | 'datetimerange';
  start_date: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  date_format?: string;
  time_zone?: string;
}

export type SubDecoration =
  | BoldFormat
  | ItalicFormat
  | StrikeFormat
  | CodeFormat
  | UnderlineFormat
  | LinkFormat
  | ColorFormat
  | DateFormat
  | UserFormat
  | InlineEquationFormat
  | PageFormat
  | ExternalLinkFormat
  | DiscussionFormat
  | ExternalObjectInstanceFormat;

export type BaseDecoration = [string];
export type AdditionalDecoration = [string, SubDecoration[]];

export type Decoration = BaseDecoration | AdditionalDecoration;

export interface NotionMap<T> {
  [key: string]: {
    role: Role;
    value: T;
  };
}

export interface User {
  id: ID;
  version: number;
  email: string;
  given_name: string;
  family_name: string;
  profile_photo: string;
  onboarding_completed: boolean;
  mobile_onboarding_completed: boolean;
}

export type BlockMap = NotionMap<Block>;
export type UserMap = NotionMap<User>;
export type CollectionMap = NotionMap<Collection>;
export type CollectionViewMap = NotionMap<CollectionView>;

// Aggregate API types
// ----------------------------------------------------------------------------

export interface RecordMap {
  block: BlockMap;
  collection?: CollectionMap;
  collection_view?: CollectionViewMap;
  notion_user?: UserMap;
}

export interface CollectionInstance {
  recordMap: RecordMap;
  result: CollectionQueryResult;
}

export interface CollectionQueryResult {
  type: CollectionViewType;
  total: number;

  blockIds: ID[];
  aggregationResults: Array<AggregationResult>;

  // only used for board collection views
  groupResults?: Array<{
    value: AggregationResult;
    blockIds: ID[];
    total: number;
    aggregationResult: AggregationResult;
  }>;

  collection_group_results?: {
    type: string;
    blockIds: ID[];
    hasMore: boolean;
  };
}

export interface AggregationResult {
  type: PropertyType;
  value: any;
}

// NOTE: This is not a native Notion type, but rather a convenience type that
// extends Notion's native RecordMap with data for collection instances.
export interface ExtendedRecordMap extends RecordMap {
  collection: CollectionMap;
  collection_view: CollectionViewMap;
  notion_user: UserMap;

  // added for convenience
  collection_query: {
    [collectionId: string]: {
      [collectionViewId: string]: CollectionQueryResult;
    };
  };

  // added for convenience
  signed_urls: {
    [blockId: string]: string;
  };

  // optional map of preview images
  preview_images?: PreviewImageMap;
}

export interface PreviewImage {
  originalWidth: number;
  originalHeight: number;
  dataURIBase64: string;
}

export interface PreviewImageMap {
  [url: string]: PreviewImage | null;
}

export interface PageChunk {
  recordMap: RecordMap;
  cursor: {
    stack: any[];
  };
}

export interface SignedUrlRequest {
  permissionRecord: PermissionRecord;
  url: string;
}

export interface PermissionRecord {
  table: string;
  id: ID;
}

export interface SignedUrlResponse {
  signedUrls: string[];
}
