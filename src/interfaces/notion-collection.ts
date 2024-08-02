import { Color, Decoration, ID } from '@/interfaces/notion';
import { Formula } from '@/interfaces/notion-formula';

export type PropertyID = string;
export type PropertyType =
  | 'title'
  | 'text'
  | 'number'
  | 'select'
  | 'status'
  | 'multi_select'
  | 'date'
  | 'person'
  | 'file'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'formula'
  | 'relation'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by';

export type NumberFormat =
  | 'number_with_commas'
  | 'percent'
  | 'dollar'
  | 'euro'
  | 'pound'
  | 'yen'
  | 'rupee'
  | 'won'
  | 'yuan';

export interface SelectOption {
  id: ID;
  color: Color;
  value: string;
}

export interface CollectionPropertySchema {
  name: string;
  type: PropertyType;
  options?: SelectOption[];
  number_format?: NumberFormat;
  formula?: Formula;
}

export interface CollectionPropertySchemaMap {
  [key: string]: CollectionPropertySchema;
}

export interface Collection {
  id: ID;
  version: number;
  name: Decoration[];
  schema: CollectionPropertySchemaMap;
  icon: string;
  parent_id: ID;
  parent_table: string;
  alive: boolean;
  copied_from: string;
  template_pages?: Array<ID>;

  format?: {
    collection_page_properties?: Array<{
      property: PropertyID;
      visible: boolean;
    }>;
    property_visibility?: Array<{
      property: PropertyID;
      visibility: 'show' | 'hide';
    }>;
    hide_linked_collection_name?: boolean;
  };
}
