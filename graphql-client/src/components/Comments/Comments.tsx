import { useQuery, useMutation, gql } from "@apollo/client";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { ChangeEvent, useEffect, useState } from "react";

const GET_COMMENTS = gql`
  query GetComments($page: Int, $limit: Int, $orderBy: String) {
    comments(page: $page, limit: $limit, orderBy: $orderBy) {
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
      page
      limit
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
  page: number;
  limit: number;
}

interface CommentVars {
    page?: number;
    limit?: number;
    orderBy?: string;
  }


const Comments = () => {

    const [inputPage, setInputPage] = useState(1);
    const [inputLimit, setInputLimit] = useState(10);
    const [inputOrderBy, setInputOrderBy] = useState("asc");
    const [queryVars, setQueryVars] = useState<CommentVars>({
        page: 1,
        limit: 10,
        orderBy: "asc"
      });

    const { data, loading, error, refetch } = useQuery<{ comments: CommentList }, CommentVars>(
    GET_COMMENTS,
    {
      variables: queryVars
    }
  );

  const totalComments = data?.comments.total || 0;
    const maxPage = Math.max(1, Math.ceil(totalComments / (inputLimit || 10)));
    
    // Update input fields when data is loaded (for first load)
    useEffect(() => {
      if (data) {
        setInputPage(data.comments.page);
        setInputLimit(data.comments.limit);
      }
    }, [data]);
  
    const handlePageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputPage(parseInt(e.target.value));
      };
    
      const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputLimit(parseInt(e.target.value));
      };
    
      const handleOrderByChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setInputOrderBy(e.target.value);
      };
    
      const handleApplyFilters = () => {
        // Parse inputs and apply validation
        const pageNum = Math.min(Math.max(1, inputPage || 1), maxPage);
        const limitNum = Math.min(Math.max(1, inputLimit || 10), 100);
        
        // Update form inputs with validated values
        setInputPage(pageNum);
        setInputLimit(limitNum);
        
        // Update query variables to trigger refetch
        setQueryVars({
          page: pageNum,
          limit: limitNum,
          orderBy: inputOrderBy
        });
      };
      
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
    <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
        <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50 flex flex-wrap gap-4 items-end max-w-3xl">
        <div>
          <label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-1">
            Page
          </label>
          <input
            id="page"
            type="number"
            min="1"
            max={maxPage}
            value={inputPage}
            onChange={handlePageChange}
            className="px-3 py-2 border rounded w-20"
          />
          <span className="text-xs text-gray-500 ml-1">
            (Max: {maxPage})
          </span>
        </div>
        
        <div>
          <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
            Limit
          </label>
          <input
            id="limit"
            type="number"
            min="1"
            max="100"
            value={inputLimit}
            onChange={handleLimitChange}
            className="px-3 py-2 border rounded w-20"
          />
          <span className="text-xs text-gray-500 ml-1">
            (Max: 100)
          </span>
        </div>
        
        <div>
          <label htmlFor="orderBy" className="block text-sm font-medium text-gray-700 mb-1">
            Order By
          </label>
          <select
            id="orderBy"
            value={inputOrderBy}
            onChange={handleOrderByChange}
            className="px-3 py-2 border rounded w-32"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
      {data?.comments.data.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        data?.comments.data.map((comment) => (
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
      
      
    </div>
  );
};

export default Comments;
