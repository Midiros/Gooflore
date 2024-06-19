"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Alert from "@/components/alert";

export default function TheoryPage() {
  const { id } = useParams();
  const [theory, setTheory] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (id) {
      const fetchTheory = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/theories/${id}`);
          const data = await res.json();

          if (res.ok) {
            setTheory(data);
            setAlert({
              message: "Theory loaded successfully!",
              type: "success",
            });
          } else {
            setError(data.error);
            setAlert({ message: data.error, type: "error" });
          }
        } catch (err) {
          const errorMessage = "An error occurred while fetching the theory.";
          setError(errorMessage);
          setAlert({ message: errorMessage, type: "error" });
        } finally {
          setLoading(false);
        }
      };

      fetchTheory();
    }
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      {loading ? (
        <p className="text-white animate-pulse">Loading theory...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        theory && (
          <div className="bg-white shadow-md rounded-lg p-6 min-h-max my-24">
            <h1 className="text-2xl font-bold mb-4 text-black">
              {theory.prompt}
            </h1>
            <p className="text-gray-700 mb-4">{theory.theory}</p>
            <div className="text-gray-500 text-sm">
              <p>
                <strong>Author:</strong> {theory.author}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(theory.created_at).toLocaleString("cs-CZ", {hour12: false})}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
