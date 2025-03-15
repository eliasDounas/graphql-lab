import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import Post from "./Post";

const GET_POSTS = gql`
  query GetPosts($page: Int, $limit: Int, $orderBy: String) {
    posts(page: $page, limit: $limit, orderBy: $orderBy) {
      data {
        id
        text
        image
        likes
        tags
        publishDate
        owner {
          id
          title
          firstName
          lastName
          picture
        }
      }
      total
      page
      limit
    }
  }
`;

const PostFeed: React.FC = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<any[]>([]);
  const limit = 5;

  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: { page, limit, orderBy: "desc" },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setPosts(data?.posts?.data || []);
    },
  });

  const totalPages = Math.ceil((data?.posts?.total || 1) / limit);

  const handlePostDelete = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Latest Posts</h2>

      {loading && <p className="text-center text-gray-500">Loading posts...</p>}
      {error && <p className="text-center text-red-500">Error: {error.message}</p>}

      <div className="space-y-6">
        {posts.map((post: any) => (
          <Post key={post.id} post={post} onDelete={handlePostDelete} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostFeed;