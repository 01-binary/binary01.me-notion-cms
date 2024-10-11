import * as React from 'react';

import isEqual from 'react-fast-compare';

import { AssetWrapper } from '@/features/posts/notion-components/asset-wrapper';
import { Checkbox as DefaultCheckbox } from '@/features/posts/notion-components/checkbox';
import { Header } from '@/features/posts/notion-components/header';
import { ExtendedRecordMap, NotionComponents, SearchNotionFn } from '@/interfaces/notion';
import { Block } from '@/interfaces/notion-block';

import { defaultMapImageUrl, defaultMapPageUrl } from '@/utils/previewImage';

export const wrapNextImage = (NextImage: any): React.FC<any> => {
  return React.memo(function ReactNotionXNextImage({
    src,
    alt,

    width,
    height,

    className,
    style,

    layout,

    ...rest
  }) {
    if (!layout) {
      layout = width && height ? 'intrinsic' : 'fill';
    }

    return (
      <NextImage
        className={className}
        src={src}
        alt={alt}
        width={layout === 'intrinsic' && width}
        height={layout === 'intrinsic' && height}
        objectFit={style?.objectFit}
        objectPosition={style?.objectPosition}
        layout={layout}
        {...rest}
      />
    );
  }, isEqual);
};

export const wrapNextLink = (NextLink: any): React.FC<any> =>
  function ReactNotionXNextLink({
    href,
    as,
    passHref,
    prefetch,
    replace,
    scroll,
    shallow,
    locale,
    ...linkProps
  }) {
    return (
      <NextLink
        href={href}
        as={as}
        passHref={passHref}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        locale={locale}
      >
        <a {...linkProps} />
      </NextLink>
    );
  };

export type MapPageUrlFn = (pageId: string, recordMap?: ExtendedRecordMap | undefined) => string;
export type MapImageUrlFn = (url: string, block: Block) => string | undefined;

export interface NotionContext {
  recordMap: ExtendedRecordMap;
  components: NotionComponents;

  mapPageUrl: MapPageUrlFn;
  mapImageUrl: MapImageUrlFn;
  searchNotion?: SearchNotionFn;
  isShowingSearch?: boolean;
  onHideSearch?: () => void;

  rootPageId?: string;
  rootDomain?: string;

  fullPage: boolean;
  darkMode: boolean;
  previewImages: boolean;
  forceCustomImages: boolean;
  showCollectionViewDropdown: boolean;
  showTableOfContents: boolean;
  minTableOfContentsItems: number;
  linkTableTitleProperties: boolean;
  isLinkCollectionToUrlProperty: boolean;

  defaultPageIcon?: string;
  defaultPageCover?: string;
  defaultPageCoverPosition?: number;

  zoom: any;
}

export interface PartialNotionContext {
  recordMap?: ExtendedRecordMap;
  components?: Partial<NotionComponents>;

  mapPageUrl?: MapPageUrlFn;
  mapImageUrl?: MapImageUrlFn;
  searchNotion?: SearchNotionFn;
  isShowingSearch?: boolean;
  onHideSearch?: () => void;

  rootPageId?: string;
  rootDomain?: string;

  fullPage?: boolean;
  darkMode?: boolean;
  previewImages?: boolean;
  forceCustomImages?: boolean;
  showCollectionViewDropdown?: boolean;
  linkTableTitleProperties?: boolean;
  isLinkCollectionToUrlProperty?: boolean;

  showTableOfContents?: boolean;
  minTableOfContentsItems?: number;

  defaultPageIcon?: string;
  defaultPageCover?: string;
  defaultPageCoverPosition?: number;

  zoom?: any;
  children?: any;
}

const DefaultLink: React.FC = (props) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  />
);

const DefaultLinkMemo = React.memo(DefaultLink);
const DefaultPageLink: React.FC = (props) => <a {...props} />;
const DefaultPageLinkMemo = React.memo(DefaultPageLink);

const DefaultEmbed = (props: any) => <AssetWrapper {...props} />;
const DefaultHeader = Header;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dummyLink = ({ href, rel, target, title, ...rest }: any) => <span {...rest} />;

const dummyComponent = (name: string) => () => {
  console.warn(
    `Warning: using empty component "${name}" (you should override this in NotionRenderer.components)`,
  );

  return null;
};

// TODO: should we use React.memo here?
// https://reactjs.org/docs/react-api.html#reactmemo
const dummyOverrideFn = (_: any, defaultValueFn: () => React.ReactNode) => defaultValueFn();

const defaultComponents: NotionComponents = {
  Image: null, // disable custom images by default
  Link: DefaultLinkMemo,
  PageLink: DefaultPageLinkMemo,
  Checkbox: DefaultCheckbox,
  Callout: undefined, // use the built-in callout rendering by default

  Code: dummyComponent('Code'),
  Equation: dummyComponent('Equation'),

  Collection: dummyComponent('Collection'),
  Property: undefined, // use the built-in property rendering by default

  propertyTextValue: dummyOverrideFn,
  propertySelectValue: dummyOverrideFn,
  propertyRelationValue: dummyOverrideFn,
  propertyFormulaValue: dummyOverrideFn,
  propertyTitleValue: dummyOverrideFn,
  propertyPersonValue: dummyOverrideFn,
  propertyFileValue: dummyOverrideFn,
  propertyCheckboxValue: dummyOverrideFn,
  propertyUrlValue: dummyOverrideFn,
  propertyEmailValue: dummyOverrideFn,
  propertyPhoneNumberValue: dummyOverrideFn,
  propertyNumberValue: dummyOverrideFn,
  propertyLastEditedTimeValue: dummyOverrideFn,
  propertyCreatedTimeValue: dummyOverrideFn,
  propertyDateValue: dummyOverrideFn,

  Pdf: dummyComponent('Pdf'),
  Tweet: dummyComponent('Tweet'),
  Modal: dummyComponent('Modal'),

  Header: DefaultHeader,
  Embed: DefaultEmbed,
};

const defaultNotionContext: NotionContext = {
  recordMap: {
    block: {},
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {},
  },

  components: defaultComponents,

  mapPageUrl: defaultMapPageUrl(),
  mapImageUrl: defaultMapImageUrl,
  searchNotion: undefined,
  isShowingSearch: false,
  onHideSearch: undefined,

  fullPage: false,
  darkMode: false,
  previewImages: false,
  forceCustomImages: false,
  showCollectionViewDropdown: true,
  linkTableTitleProperties: true,
  isLinkCollectionToUrlProperty: false,

  showTableOfContents: false,
  minTableOfContentsItems: 3,

  defaultPageIcon: undefined,
  defaultPageCover: undefined,
  defaultPageCoverPosition: 0.5,

  zoom: null,
};

const ctx = React.createContext<NotionContext>(defaultNotionContext);

export const NotionContextProvider: React.FC<PartialNotionContext> = ({
  components: themeComponents = {},
  children,
  mapPageUrl,
  mapImageUrl,
  rootPageId,
  ...rest
}) => {
  type Keys = keyof typeof rest;
  for (const key of Object.keys(rest)) {
    if (rest[key as Keys] === undefined) {
      delete rest[key as Keys];
    }
  }

  const wrappedThemeComponents = React.useMemo(
    () => ({
      ...themeComponents,
    }),
    [themeComponents],
  );

  if (wrappedThemeComponents.nextImage) {
    wrappedThemeComponents.Image = wrapNextImage(themeComponents.nextImage);
  }

  if (wrappedThemeComponents.nextLink) {
    wrappedThemeComponents.nextLink = wrapNextLink(themeComponents.nextLink);
  }

  // ensure the user can't override default components with falsy values
  // since it would result in very difficult-to-debug react errors
  type WrappedThemeComponentsKeys = keyof typeof wrappedThemeComponents;
  for (const key of Object.keys(wrappedThemeComponents)) {
    if (!wrappedThemeComponents[key as WrappedThemeComponentsKeys]) {
      delete wrappedThemeComponents[key as WrappedThemeComponentsKeys];
    }
  }

  const value = React.useMemo(
    () => ({
      ...defaultNotionContext,
      ...rest,
      rootPageId,
      mapPageUrl: mapPageUrl ?? defaultMapPageUrl(rootPageId),
      mapImageUrl: mapImageUrl ?? defaultMapImageUrl,
      components: { ...defaultComponents, ...wrappedThemeComponents },
    }),
    [mapImageUrl, mapPageUrl, wrappedThemeComponents, rootPageId, rest],
  );

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
};

export const NotionContextConsumer = ctx.Consumer;

export const useNotionContext = (): NotionContext => {
  return React.useContext(ctx);
};
