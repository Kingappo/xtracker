import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../components/navbar/Navbar";
import DeleteAccountSection from "../../components/DeleteAccountSection";

const AccountDelete = () => {
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
          Delete Account
        </h1>

        <DeleteAccountSection />
      </div>
    </div>
  );
};

export default AccountDelete;
