import { useState} from "react";
import { FaHeart, FaTrashAlt } from "react-icons/fa";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

const UPDATE_LIKES = gql`
  mutation updateLikes($id: ID!, $likes: Int!) {
    updatePost(id: $id, input: { likes: $likes }) {
      id
      likes
    }
  }
`;

type PostProps = {
  post: {
    id: string;
    text: string;
    image?: string;
    likes: number;
    tags: string[];
    publishDate: string;
    owner: {
      id: string;
      title: string;
      firstName: string;
      lastName: string;
      picture: string;
    };
  };
  onDelete: (id: string) => void; // Callback for deleting post from parent state
};

const formatDate = (timestamp: string | number) => {
  const date = new Date(Number(timestamp));
  return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const Post: React.FC<PostProps> = ({ post, onDelete }) => {
  const navigate = useNavigate();
  const [deletePost] = useMutation(DELETE_POST);
  const [updateLikes] = useMutation(UPDATE_LIKES);
  const [likes, setLikes] = useState(post.likes);

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const { data } = await deletePost({
        variables: { id: post.id },
      });

      if (data?.deletePost !== null) {
        onDelete(post.id);
      } else {
        alert("Failed to delete the post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleLike = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const updatedLikes = post.likes + 1;
      await updateLikes({
        variables: { id: post.id, likes: updatedLikes },
      });
      setLikes(updatedLikes)
    } catch (error) {
      console.error("Error updating likes:", error);
      alert("An error occurred while updating likes.");
    }
  };

  return (
    <div className="border p-5 rounded-lg shadow-sm bg-white relative cursor-pointer my-4 border-gray-400" onClick={() => navigate(`/posts/${post.id}`)}>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
      >
        <FaTrashAlt size={20} />
      </button>

      <div className="flex items-center space-x-3 mb-3">
        <div>
          <p className="font-semibold text-gray-800">
            {post.owner.title} {post.owner.firstName} {post.owner.lastName}
          </p>
          <p className="text-sm text-gray-500">{formatDate(post.publishDate)}</p>
        </div>
      </div>

      <p className="text-gray-700">{post.text}</p>

      {post.image && <img src={post.image} alt="Image" className="mt-2 rounded-lg w-full" />}

      <div className="flex justify-between items-center mt-3">
        <span className="text-gray-600 text-sm cursor-pointer" onClick={handleLike}>
          <FaHeart size={20} color="red" className="inline" /> {likes} Likes
        </span>
        <div className="flex space-x-2">
          {post.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
