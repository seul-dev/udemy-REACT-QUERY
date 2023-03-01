import { useQuery, useMutation } from '@tanstack/react-query';

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'DELETE' }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'PATCH', data: { title: 'REACT QUERY FOREVER!!!!' } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const {
    data: comments,
    isLoading,
    isError,
    error,
  } = useQuery(['comments', post.id], () => fetchComments(post.id), {
    staleTime: 1000 * 60,
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });

  const updateMutation = useMutation({
    mutationFn: (postId) => updatePost(postId),
  });

  if (isLoading) return <p>Loading..</p>;
  if (isError) return <p>something went wrong - {error.toString()}</p>;

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>
        {deleteMutation.isLoading ? (
          <span style={{ color: 'purple' }}>deleting...</span>
        ) : (
          'Delete'
        )}
      </button>
      <button
        onClick={() => {
          updateMutation.mutate(post.id);
        }}
      >
        {updateMutation.isLoading ? (
          <span style={{ color: 'purple' }}>updating...</span>
        ) : (
          'Update title'
        )}
      </button>
      {deleteMutation.isError && (
        <p style={{ color: 'red' }}>something went wrong</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: 'green' }}>deleted successfully..!</p>
      )}

      {updateMutation.isError && (
        <p style={{ color: 'red' }}>something went wrong</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: 'green' }}>updated successfully..!</p>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {comments.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
