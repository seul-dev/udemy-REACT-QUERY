import InfiniteScroll from 'react-infinite-scroller';
import { Person } from './Person';
import { useInfiniteQuery } from '@tanstack/react-query';

const initialUrl = 'https://swapi.dev/api/people/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
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
    ['sw-people'],
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    }
  );

  if (isLoading) {
    return <div className='loading'>Loading...</div>;
  }
  if (isError) {
    return <div>Error {error.toString()}</div>;
  }

  return (
    <InfiniteScroll
      loadMore={() => {
        if (!isFetchingNextPage) fetchNextPage();
      }}
      hasMore={hasNextPage}
    >
      <>
        {isFetching && <div className='loading'>Loading...</div>}
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => {
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hair_color}
                eyeColor={person.eye_color}
              />
            );
          });
        })}
      </>
    </InfiniteScroll>
  );
}
