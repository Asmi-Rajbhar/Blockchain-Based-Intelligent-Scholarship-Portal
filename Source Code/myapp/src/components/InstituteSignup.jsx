import { useState } from "react";
import { Link } from "react-router-dom";

const InstituteSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);

      // registration logic here
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold p-4 font-protest-revolution text-center">
          <span>Student Register</span>
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="text-gray-700 flex">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full p-2 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="text-gray-700 flex">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-gray-700 flex">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-gray-700 flex">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-2 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className={`w-full p-2 rounded-md text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } focus:outline-none transition duration-200`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/institute-login" className="text-blue-500">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstituteSignup;
