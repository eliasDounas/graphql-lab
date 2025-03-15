import { useQuery, useMutation, gql } from "@apollo/client";
import { FC } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";

const GET_COMMENTS_BY_USER = gql`
  query CommentsByUser($userId: ID!, $page: Int, $limit: Int, $orderBy: String) {
    commentsByUser(userId: $userId, page: $page, limit: $limit, orderBy: $orderBy) {
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
  userId: string;
}

const CommentsByUser: FC<CommentProps> = ({ userId }) => {
  const { data, loading, error, refetch } = useQuery<{ commentsByUser: CommentList }>(
    GET_COMMENTS_BY_USER,
    {
      variables: { userId, page: 1, limit: 5, orderBy: "asc" },
    }
  );


  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: () => {
        refetch();
        toast.success("Comment deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete comment");
      },
    });


 
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
    <div className="space-y-4 px-4 bg-gray-100 rounded-lg">
      <h2 className="font-semibold text-gray-950 text-left pt-6 px-3" >Comments :</h2>
      {data?.commentsByUser.data.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        data?.commentsByUser.data.map((comment) => (
          <div
            key={comment.id}
            className="flex justify-between items-center bg-white p-3 rounded-lg shadow"
          >
            <div className="text-left">
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
      
    </div>
  );
};

export default CommentsByUser;
