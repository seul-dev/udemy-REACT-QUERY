import { useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroller';
import { Species } from './Species';

const initialUrl = 'https://swapi.dev/api/species/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery(
    ['sw-species'],
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
      staleTime: 1000 * 60 * 2,
    }
  );
  if (isLoading) {
    return <div className='loading'>Loading...</div>;
  }
  if (isError) {
    return <div>Error {error.toString()}</div>;
  }

  // TODO: get data for InfiniteScroll via React Query
  return (
    <InfiniteScroll
      loadMore={() => {
        if (!isFetchingNextPage) fetchNextPage();
      }}
      hasMore={hasNextPage}
    >
      {isFetching && <div className='loading'>Loading...</div>}
      {data.pages.map((page) =>
        page.results.map((species) => (
          <Species
            key={species.name}
            name={species.name}
            language={species.language}
            averageLifespan={species.average_lifespan}
          />
        ))
      )}
    </InfiniteScroll>
  );
}
