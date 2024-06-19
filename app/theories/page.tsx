"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Alert from "@/components/alert";

export default function Theories() {
  const [theories, setTheories] = useState<Array<Record<string, string>>>([]);
  const [error, setError] = useState<string>("");
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchTheories = async () => {
      try {
        const res = await fetch("/api/theories");
        const data = await res.json();

        if (res.ok) {
          setTheories(data);
          setAlert({
            message: "Theories loaded successfully!",
            type: "success",
          });
        } else {
          setError(data.error);
          setAlert({ message: data.error, type: "error" });
        }
      } catch (err) {
        const errorMessage = "An error occurred while fetching the theories.";
        setError(errorMessage);
        setAlert({ message: errorMessage, type: "error" });
      }
    };

    fetchTheories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-8">All Theories</h1>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {theories.map((theory) => (
          <Link key={theory.uuid} href={`/theories/${theory.uuid}`}>
            <div className="bg-white shadow-lg rounded-lg p-6 cursor-pointer card">
              <h2 className="text-xl font-semibold mb-2">{theory.prompt}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
