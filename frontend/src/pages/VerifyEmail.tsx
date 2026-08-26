import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../api/authApi";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const res = await verifyEmail(token);
        setStatus("success");
        setMessage(res.message);
      } catch (err) {
        setStatus("error");
        if (axios.isAxiosError(err) && err.response) {
          setMessage(err.response.data.message || "Verification failed.");
        } else {
          setMessage("Verification failed.");
        }
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2
              size={40}
              className="mx-auto text-blue-500 animate-spin mb-4"
            />
            <p className="text-gray-600">Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 size={40} className="mx-auto text-green-500 mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Email Verified
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={40} className="mx-auto text-red-500 mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
