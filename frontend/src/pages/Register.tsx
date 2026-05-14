import { Link } from "react-router-dom";
import FormRegister from "../components/forms/FormRegister";

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Create an account</h1>
          <p className="text-gray-400 text-sm mt-1">
            Start with email or a social provider
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="flex gap-3 mb-6">
          <a
            href="http://localhost:8080/oauth2/authorization/google"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.27 9.76A7.08 7.08 0 0 1 12 4.9c1.76 0 3.33.63 4.57 1.65l3.4-3.4A11.95 11.95 0 0 0 12 .9 12 12 0 0 0 .9 8.44l4.37 3.32z"
              />
              <path
                fill="#34A853"
                d="M16.04 18.01A7.06 7.06 0 0 1 12 19.1a7.08 7.08 0 0 1-6.72-4.83L.9 17.56A12 12 0 0 0 12 23.1c3.06 0 5.96-1.1 8.18-3.09l-4.14-3z"
              />
              <path
                fill="#4A90D9"
                d="M20.18 20.01A11.95 11.95 0 0 0 23.1 12c0-.66-.06-1.3-.17-1.9H12v4.56h6.29a5.43 5.43 0 0 1-2.25 3.35l4.14 3z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27A7.11 7.11 0 0 1 4.9 12c0-.8.14-1.57.38-2.3L.9 6.44A11.95 11.95 0 0 0 0 12c0 1.92.45 3.73 1.24 5.34l4.04-3.07z"
              />
            </svg>
            Google
          </a>
          <a
            href="http://localhost:8080/oauth2/authorization/github"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.5.2-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17 5 18 5.3 18 5.3c.7 1.6.2 2.7.1 3 .8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
            </svg>
            GitHub
          </a>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-950 px-3 text-xs text-gray-500 uppercase tracking-wider">
              or with email
            </span>
          </div>
        </div>

        <FormRegister />

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
