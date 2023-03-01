import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { PostDetail } from './PostDetail';
import { queryClient } from './App';

const maxPostPage = 10;

async function fetchPosts(pageNumber) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNumber}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery(['posts', currentPage], () => fetchPosts(currentPage), {
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPageNum = currentPage + 1;
      queryClient.prefetchQuery(
        ['posts', nextPageNum],
        () => fetchPosts(nextPageNum),
        {
          staleTime: 1000 * 60,
        }
      );
    }
  }, [currentPage]);

  if (isLoading) return <h3>Loading...</h3>;
  if (isError) return <h3>Something went wrong {error.toString()}</h3>;

  return (
    <>
      <ul>
        {posts.map((post) => (
          <li
            key={post.id}
            className='post-title'
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className='pages'>
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
