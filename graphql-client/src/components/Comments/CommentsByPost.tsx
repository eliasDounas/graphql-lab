import { useQuery, useMutation, gql } from "@apollo/client";
import { FC, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";

const GET_COMMENTS_BY_POST = gql`
  query CommentsByPost($postId: ID!, $page: Int, $limit: Int, $orderBy: String) {
    commentsByPost(postId: $postId, page: $page, limit: $limit, orderBy: $orderBy) {
      data {
        id
        message
        owner {
          id
          title
          firstName
          lastName
        }
        publishDate
      }
      total
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentCreateInput!) {
    createComment(input: $input) {
      id
      message
      owner {
        id
        title
        firstName
        lastName
      }
      publishDate
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;

interface UserPreview {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
}

interface Comment {
  id: string;
  message: string;
  owner: UserPreview;
  publishDate: string;
}

interface CommentList {
  data: Comment[];
  total: number;
}

interface CommentProps {
  postId: string;
}

const Comment: FC<CommentProps> = ({ postId }) => {
  const { data, loading, error, refetch } = useQuery<{ commentsByPost: CommentList }>(
    GET_COMMENTS_BY_POST,
    {
      variables: { postId, page: 1, limit: 5, orderBy: "asc" },
    }
  );

  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [createComment, { loading: creating }] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
        setMessage("");
        setUserId("");
        refetch();
        toast.success("Comment added successfully");
      },
      onError: () => {
        toast.error("Failed to add comment");
      },
    });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: () => {
        refetch();
        toast.success("Comment deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete comment");
      },
    });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !userId.trim()) {
      toast.error("Both user ID and message are required");
      return;
    }
    await createComment({ variables: { input: { message, owner: userId, post: postId } } });
  };

  const handleDelete = async (id: string) => {
    await deleteComment({ variables: { id } });
  };

  const formatDate = (timestamp: string | number) => {
    const date = new Date(Number(timestamp)); // Ensure it's a number
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments</p>;

  

  return (
    <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
      {data?.commentsByPost.data.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        data?.commentsByPost.data.map((comment) => (
          <div
            key={comment.id}
            className="flex justify-between items-center bg-white p-3 rounded-lg shadow"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {comment.owner.title} {comment.owner.firstName} {comment.owner.lastName}
              </p>
              <p className="text-sm text-gray-600">{comment.message}</p>
              <p className="text-xs text-gray-400">
                {formatDate(comment.publishDate)}
              </p>
            </div>
            <button onClick={() => handleDelete(comment.id)} className="text-gray-500 hover:text-red-700 cursor-pointer">
              <FaTrashAlt className="w-5 h-5" />
            </button>
          </div>
        ))
      )}
      
      {/* Add Comment Section */}
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-2">
        <input
          type="text"
          className="p-2 border rounded-lg w-full"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter your user ID"
          required
        />
        <textarea
          className="p-2 border rounded-lg w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a comment..."
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={creating}
        >
          {creating ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
};

export default Comment;
