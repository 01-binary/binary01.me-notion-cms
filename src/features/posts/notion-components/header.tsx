import * as React from 'react';

import { useHotkeys } from 'react-hotkeys-hook';

import { SearchIcon } from '@/features/posts/icons/search-icon';
import { cs, getPageBreadcrumbs } from '@/features/posts/notion-components/utils';
import { ExtendedRecordMap } from '@/interfaces/notion';
import { Block, CollectionViewPageBlock, PageBlock } from '@/interfaces/notion-block';

import { useNotionContext } from '../context';
import { PageIcon } from './page-icon';
import { SearchDialog } from './search-dialog';

export type SearchNotionFn = (params: SearchParams) => Promise<SearchResults>;

export interface SearchParams {
  ancestorId: string;
  query: string;
  filters?: {
    isDeletedOnly: boolean;
    excludeTemplates: boolean;
    isNavigableOnly: boolean;
    requireEditPermissions: boolean;
  };
  limit?: number;
  searchSessionId?: string;
}

export interface SearchResults {
  recordMap: ExtendedRecordMap;
  results: SearchResult[];
  total: number;
}

export interface SearchResult {
  id: string;
  page: any;
  isNavigable: boolean;
  score: number;
  highlight: {
    pathText: string;
    text: string;
    html: any;
  };
}

export const Header: React.FC<{
  block: CollectionViewPageBlock | PageBlock;
}> = ({ block }) => {
  return (
    <header className="notion-header">
      <div className="notion-nav-header">
        <Breadcrumbs block={block} />
        <Search block={block} />
      </div>
    </header>
  );
};

export const Breadcrumbs: React.FC<{
  block: Block;
  rootOnly?: boolean;
}> = ({ block, rootOnly = false }) => {
  const { recordMap, mapPageUrl, components } = useNotionContext();

  const breadcrumbs = React.useMemo(() => {
    const breadcrumbs = getPageBreadcrumbs(recordMap, block.id);
    if (rootOnly) {
      return [breadcrumbs[0]].filter(Boolean);
    }

    return breadcrumbs;
  }, [recordMap, block.id, rootOnly]);

  return (
    <div
      className="breadcrumbs"
      key="breadcrumbs"
    >
      {breadcrumbs.map((breadcrumb, index: number) => {
        if (!breadcrumb) {
          return null;
        }

        const pageLinkProps: any = {};
        const componentMap = {
          pageLink: components.PageLink,
        };

        if (breadcrumb.active) {
          componentMap.pageLink = (props: any) => <div {...props} />;
        } else {
          pageLinkProps.href = mapPageUrl(breadcrumb.pageId);
        }

        return (
          <React.Fragment key={breadcrumb.pageId}>
            <componentMap.pageLink
              className={cs('breadcrumb', breadcrumb.active && 'active')}
              {...pageLinkProps}
            >
              {breadcrumb.icon && (
                <PageIcon
                  className="icon"
                  block={breadcrumb.block}
                />
              )}

              {breadcrumb.title && <span className="title">{breadcrumb.title}</span>}
            </componentMap.pageLink>

            {index < breadcrumbs.length - 1 && <span className="spacer">/</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const Search: React.FC<{
  block: Block;
  search?: SearchNotionFn;
  title?: React.ReactNode;
}> = ({ block, search, title = 'Search' }) => {
  const { searchNotion, rootPageId, isShowingSearch, onHideSearch } = useNotionContext();
  const onSearchNotion = search || searchNotion;

  const [isSearchOpen, setIsSearchOpen] = React.useState(isShowingSearch);
  React.useEffect(() => {
    setIsSearchOpen(isShowingSearch);
  }, [isShowingSearch]);

  const onOpenSearch = React.useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const onCloseSearch = React.useCallback(() => {
    setIsSearchOpen(false);
    if (onHideSearch) {
      onHideSearch();
    }
  }, [onHideSearch]);

  useHotkeys('cmd+p', (event) => {
    onOpenSearch();
    event.preventDefault();
    event.stopPropagation();
  });

  useHotkeys('cmd+k', (event) => {
    onOpenSearch();
    event.preventDefault();
    event.stopPropagation();
  });

  const hasSearch = !!onSearchNotion;

  return (
    <>
      {hasSearch && (
        <div
          role="button"
          className={cs('breadcrumb', 'button', 'notion-search-button')}
          onClick={onOpenSearch}
        >
          <SearchIcon className="searchIcon" />

          {title && <span className="title">{title}</span>}
        </div>
      )}

      {isSearchOpen && hasSearch && (
        <SearchDialog
          isOpen={isSearchOpen}
          rootBlockId={rootPageId || block?.id}
          onClose={onCloseSearch}
          searchNotion={onSearchNotion}
        />
      )}
    </>
  );
};
