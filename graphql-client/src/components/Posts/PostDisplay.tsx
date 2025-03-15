import React, { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import Post from "./Post"; 
import Comment from "../Comments/CommentsByPost"

// GraphQL query to fetch a post by ID
const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    postById(id: $id) {
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
  }
`;

const PostDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { id },
  });

  const [postData, setPostData] = useState<any>(null);

  useEffect(() => {
    if (data && data.postById) {
      setPostData(data.postById); // Set the fetched post data
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching post data.</div>;

  const handleDelete = (id: string) => {
    alert(`Post ${id} deleted`);
    navigate("/posts");
  };

  return (
    <div className="container mx-auto p-6">
      {postData ? ( <>
        <Post post={postData} onDelete={handleDelete} />
        <Comment postId={postData.id}  />
      </>) : (
        <div>No post found</div>
      )}
    </div>
  );
};

export default PostDisplay;
