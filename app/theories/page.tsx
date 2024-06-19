"use client";

import { useState, useEffect } from "react";

export default function Theories() {
  const [theories, setTheories] = useState<Array<Record<string, string>>>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTheories = async () => {
      try {
        const res = await fetch("/api/theories");
        const data = await res.json();

        if (res.ok) {
          setTheories(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("An error occurred while fetching the theories.");
      }
    };

    fetchTheories();
  }, []);

  return (
    <div>
      <h1 className="text-4xl mb-8">All Theories</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {theories.map((theory) => (
          <li key={theory.uuid} className="mb-4">
            <p>
              <strong>Prompt:</strong> {theory.prompt}
            </p>
            <p>
              <strong>Theory:</strong> {theory.theory}
            </p>
            <p>
              <strong>Author:</strong> {theory.author}
            </p>
            <p>
              <strong>Created At:</strong> {theory.created_at}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
