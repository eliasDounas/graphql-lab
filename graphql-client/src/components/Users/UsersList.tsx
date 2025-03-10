import { useState, ChangeEvent, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the GraphQL query
const GET_USERS = gql`
  query GetUsers($page: Int, $limit: Int, $orderBy: String) {
    users(page: $page, limit: $limit, orderBy: $orderBy) {
      data {
        id
        title
        firstName
        lastName
        picture
      }
      total
      page
      limit
    }
  }
`;

// Define TypeScript interfaces based on your GraphQL schema
interface UserPreview {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  picture: string;
}

interface UserListData {
  users: {
    data: UserPreview[];
    total: number;
    page: number;
    limit: number;
  };
}

interface UserListVars {
  page?: number;
  limit?: number;
  orderBy?: string;
}

export const UsersList = () => {
  // State for form inputs (what the user sees and edits)
  const [inputPage, setInputPage] = useState("1");
  const [inputLimit, setInputLimit] = useState("10");
  const [inputOrderBy, setInputOrderBy] = useState("asc");
  const navigate = useNavigate(); 
  // State for actual query variables (only updated on Apply button click)
  const [queryVars, setQueryVars] = useState<UserListVars>({
    page: 1,
    limit: 10,
    orderBy: "asc"
  });
  
  // Execute the query with the controlled variables
  const { loading, error, data } = useQuery<UserListData, UserListVars>(
    GET_USERS,
    {
      variables: queryVars,
      notifyOnNetworkStatusChange: true,
    }
  );

  const totalUsers = data?.users.total || 0;
  const maxPage = Math.max(1, Math.ceil(totalUsers / (parseInt(inputLimit) || 10)));
  
  // Update input fields when data is loaded (for first load)
  useEffect(() => {
    if (data) {
      setInputPage(data.users.page.toString());
      setInputLimit(data.users.limit.toString());
    }
  }, [data]);

  const handlePageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputLimit(e.target.value);
  };

  const handleOrderByChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setInputOrderBy(e.target.value);
  };

  const handleApplyFilters = () => {
    // Parse inputs and apply validation
    const pageNum = Math.min(Math.max(1, parseInt(inputPage) || 1), maxPage);
    const limitNum = Math.min(Math.max(1, parseInt(inputLimit) || 10), 100);
    
    // Update form inputs with validated values
    setInputPage(pageNum.toString());
    setInputLimit(limitNum.toString());
    
    // Update query variables to trigger refetch
    setQueryVars({
      page: pageNum,
      limit: limitNum,
      orderBy: inputOrderBy
    });
  };

  if (loading && !data) return <p>Loading users...</p>;
  if (error) return <p>Error loading users: {error.message}</p>;

  const users = data?.users.data || [];

  return (
    <div>
      <div className="mb-4 p-4 border rounded bg-gray-50 flex flex-wrap gap-4 items-end">
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

      {loading && data && <div className="mb-2 text-blue-600">Updating results...</div>}

      <Table>
        <TableCaption>Showing page {data?.users.page || queryVars.page} of {maxPage} ({totalUsers} total users)</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Picture URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No users found</TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className='cursor-pointer' onClick={() => navigate(`/user/${user.id}`)}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell className="text-left">{user.title}</TableCell>
                <TableCell className="text-left">{user.firstName}</TableCell>
                <TableCell className="text-left">{user.lastName}</TableCell>
                <TableCell className="text-left">{user.picture}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      
    </div>
  );
};