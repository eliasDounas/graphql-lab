import { useMutation, gql } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: UserCreateInput!) {
    createUser(input: $input) {
      id
      firstName
      lastName
      email
    }
  }
`;

type LocationInput = {
  street: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
};

type UserCreateInput = {
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  picture: string;
  location: LocationInput;
};

export default function AddUser() {
  const { register, handleSubmit, formState: { errors } } = useForm<UserCreateInput>();
  const [createUser, { loading, error }] = useMutation(CREATE_USER_MUTATION);
  const navigate = useNavigate();

  const onSubmit = async (data: UserCreateInput) => {
    try {
      await createUser({ variables: { input: data } });
      navigate("/");
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white px-6 shadow-lg rounded-lg pb-4">
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Add New User</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input {...register("title", { required: true })} className="input-field" placeholder="Mr, Mrs, Dr..." />
          {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input {...register("firstName", { required: true })} className="input-field" placeholder="John" />
          {errors.firstName && <p className="text-red-500 text-sm">First Name is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input {...register("lastName", { required: true })} className="input-field" placeholder="Doe" />
          {errors.lastName && <p className="text-red-500 text-sm">Last Name is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input {...register("email", { required: true })} type="email" className="input-field" placeholder="example@mail.com" />
          {errors.email && <p className="text-red-500 text-sm">Valid email is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input {...register("dateOfBirth", { required: true })} type="date" className="input-field" />
          {errors.dateOfBirth && <p className="text-red-500 text-sm">Date of Birth is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input {...register("phone", { required: true })} className="input-field" placeholder="+1234567890" />
          {errors.phone && <p className="text-red-500 text-sm">Phone is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Picture URL</label>
          <input {...register("picture", { required: true })} className="input-field" placeholder="https://image-url.com" />
          {errors.picture && <p className="text-red-500 text-sm">Picture URL is required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <input {...register("gender", { required: true })} className="input-field" placeholder="Male/Female" />
          {errors.gender && <p className="text-red-500 text-sm">Gender is required</p>}
        </div>

        {/* Location Inputs */}
        <div className="sm:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mt-4">Location Details</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
          <input {...register("location.street", { required: true })} className="input-field" placeholder="123 Main St" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input {...register("location.city", { required: true })} className="input-field" placeholder="New York" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input {...register("location.state", { required: true })} className="input-field" placeholder="NY" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <input {...register("location.country", { required: true })} className="input-field" placeholder="USA" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <input {...register("location.timezone", { required: true })} className="input-field" placeholder="GMT-5" />
        </div>

        <div className="sm:col-span-2 flex justify-center">
          <button type="submit" disabled={loading} className="btn-submit bg-blue-800 hover:bg-blue-700 px-3 py-1 rounded-lg text-lg font-medium text-white">
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 text-center mt-3">Error: {error.message}</p>}
    </div>
  );
}
