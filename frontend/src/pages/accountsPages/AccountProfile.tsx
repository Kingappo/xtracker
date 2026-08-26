import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

const AccountProfile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link
          to="/account"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4"
        >
          <ArrowLeft size={16} /> Back to Account
        </Link>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Profile
        </h1>

        <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6">
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-gray-500">First Name:</span>{" "}
              <span className="text-gray-900 font-medium">
                {user?.firstName}
              </span>
            </p>
            <p>
              <span className="text-gray-500">Surname:</span>{" "}
              <span className="text-gray-900 font-medium">{user?.surname}</span>
            </p>
            <p>
              <span className="text-gray-500">Email:</span>{" "}
              <span className="text-gray-900 font-medium">{user?.email}</span>
            </p>
            <p>
              <span className="text-gray-500">Email verified:</span>{" "}
              {user?.isVerified ? (
                <span className="text-green-600 font-medium">Yes</span>
              ) : (
                <span className="text-amber-600 font-medium">No</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
