import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from "react-router-dom";

// GraphQL mutation to create a post
const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: PostCreateInput!) {
    createPost(input: $input) {
      id
    }
  }
`;

interface PostCreateInput {
  text: string;
  image: string;
  likes?: number;
  tags: string[];
  owner: string;
  link?: string;
}

const CreatePost: React.FC = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [link, setLink] = useState('');
  const [likes, setLikes] = useState<number | undefined>(0);
  const [owner, setOwner] = useState<string>(''); // New state for owner

  const [createPost] = useMutation(CREATE_POST_MUTATION);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the owner ID exists in the location state and set the owner state
  useEffect(() => {
    if (location.state?.id) {
      setOwner(location.state.id); // Populate the owner field with the ID from the state
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build input object
    const input: PostCreateInput = {
      text,
      image,
      likes,
      tags,
      owner, // Use the owner from state or input
      link,
    };

    try {
      const { data } = await createPost({ variables: { input } });

      // Alert post is created and navigate to /posts
      alert('Post created successfully!');
      navigate(`/posts/${data.createPost.id}`);
    } catch (error) {
      console.error('Error creating post', error);
      alert('Error creating post');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="text" className="block text-gray-700 font-medium mb-2">Text:</label>
          <input
            id="text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">Image URL:</label>
          <input
            id="image"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">Tags: (Seperated with commas "," )</label>
          <input
            id="tags"
            type="text"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="link" className="block text-gray-700 font-medium mb-2">Link (optional):</label>
          <input
            id="link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="likes" className="block text-gray-700 font-medium mb-2">Likes:</label>
          <input
            id="likes"
            type="number"
            value={likes}
            onChange={(e) => setLikes(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-md"
            min={0}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="owner" className="block text-gray-700 font-medium mb-2">Owner ID:</label>
          <input
            id="owner"
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="text-center">
          <button type="submit" className="w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors">
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
