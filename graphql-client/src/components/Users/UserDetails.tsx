import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import CommentsByUser from "../Comments/CommentsByUser";

const GET_USER_DETAILS = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      title
      firstName
      lastName
      gender
      email
      dateOfBirth
      registerDate
      phone
      picture
      location {
        street
        city
        state
        country
        timezone
      }
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      id
      title
      firstName
      lastName
      gender
      dateOfBirth
      phone
      picture
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(GET_USER_DETAILS, {
    variables: { id: userId },
  });

  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    picture: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p>Error loading user: {error.message}</p>;

  const user = data?.user;

  // Populate form when switching to edit mode
  const handleEdit = () => {
    setFormData({
      title: user.title || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      gender: user.gender || "",
      dateOfBirth: user.dateOfBirth || "",
      phone: user.phone || "",
      picture: user.picture || "",
    });
    setIsEditing(true);
  };

  // Handle form change
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await updateUser({
      variables: { id: userId, input: formData },
    });
    refetch(); // Refresh the data
    setIsEditing(false);
  };
  const createPost = async (e: any) => {
    e.preventDefault();
    navigate("/posts/create", { state: { id: user.id }});
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser({
        variables: { id: userId },
      });
      navigate("/"); // Redirect to homepage
    }
  };

  const formatDate = (timestamp: string | number) => {
    const date = new Date(Number(timestamp)); // Ensure it's a number
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
      {!isEditing ? (
        <>
          {/* User Info */}
          <h2 className="text-2xl font-bold text-center">
            {user.title} {user.firstName} {user.lastName}
          </h2>
          <p className="text-center text-gray-500">{user.gender}</p>

          {/* Picture Link */}
          <div className="mt-4 text-center">
            <strong className="mr-2">Picture:</strong>{" "}
            <a
              href={user.picture}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
            >
              {user.picture}
            </a>
          </div>

          {/* Contact Info */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Contact Info</h3>
            <p><strong className="mr-2">Email:</strong> {user.email}</p>
            <p><strong className="mr-2">Phone:</strong> {user.phone || "N/A"}</p>
          </div>

          {/* Additional Info */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Additional Info</h3>
            <p>
              <strong className="mr-2">Date of Birth:</strong> {formatDate(user.dateOfBirth)}
            </p>
            <p>
              <strong className="mr-2">Registered on:</strong> {formatDate(user.registerDate)}
            </p>
          </div>


          {/* Edit Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            >
              Edit Profile
            </button>
            <button
              onClick={createPost}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
            >
             Create New Post
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 px-4 py-2 rounded hover:font-semibold cursor-pointer"
            >
              Delete Profile
            </button>
          </div>
          <CommentsByUser userId={user.id} />
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Edit Profile</h3>

          <div>
            <label className="block text-gray-600">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-gray-600">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-gray-600">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-gray-600">Picture URL</label>
            <input
              type="text"
              name="picture"
              value={formData.picture}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
      
      
    </div>
  );
};
