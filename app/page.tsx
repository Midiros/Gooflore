"use client";

import { redirect } from "next/dist/server/api-utils";
import { useState } from "react";
import setAlert from '@/components/alert';
import Alert from "@/components/alert";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [savedId, setSavedId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);


  const handleGenerate = async () => {
    setError("");
    setSavedId("");
    setImageUrl("");
    try {
      if (!prompt) {
        setError("Please enter a prompt.");
        setAlert({
          message: "You need to provide me a theory!",
          type: "error",
        });
        return;
      }
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.text);
        setAlert({ message: "New conspiracy theory unlocked!", type: "success" });
      } else {
        setError(data.error);
        setAlert({ message: data.error, type: "error" });

      }
    } catch (err) {
      setError("An error occurred while generating the theory.");
      setAlert({ message: "Apparently this is not a conspiracy theory.", type: "error" });
    }
  };

  const handleSave = async () => {
    setError("");
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, theory: response, author: name }),
      });

      const data = await res.json();

      if (res.ok) {
        setSavedId(data.id);
        setAlert({ message: "Theory archived, it is now stored eternally. Or until my free credits run out.", type: "success" });
      } else {
        setError(data.error);
        setAlert({ message: data.error, type: "error" });
      }
    } catch (err) {
      setError("An error occurred while saving the theory.");
      setAlert({ message: "An error occured while saving the theory.", type: "error" });
    }
  };

  const handleGenerateImage = async () => {
    setError("");
    setLoadingImage(true);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theory: response }),
      });

      const data = await res.json();

      if (res.ok) {
        setImageUrl(data.imageUrl);
        setAlert({ message: "Evidence collected!", type: "success" });
      } else {
        setError(data.error);
        setAlert({ message: data.error, type: "error" });

      }
    } catch (err) {
      setError("An error occurred while generating the evidence.");
      setAlert({ message: "This image is too haunting to show you.", type: "error" });
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div className="min-h-96 flex flex-col items-center justify-center py-30">
      <h1 className="text-4xl mb-8">Goofer's theory machine</h1>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border border-gray-300 p-2 mb-4 w-1/2 text-black"
        placeholder="What is the goverment hiding from us ?"
      />
      <button
        onClick={handleGenerate}
        className="hover:animate-bounce px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white rounded"
      >
        Explain this
      </button>
      {response && (
        <div className="mt-4 w-1/2">
          <h2 className="text-2xl mb-4">Theory explained</h2>
          <p className="border border-gray-300 p-4 hover:animate-pulse">{response}</p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-2 mt-4 w-full text-black"
            placeholder="Enter your name"
          />

          <div
            className="flex rounded-md shadow-sm justify-center"
            role="group"
          >
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Archive
            </button>
            <button
              onClick={handleGenerateImage}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
              disabled={loadingImage}
            >
              {/* {loadingImage ?
               <svg className="h-5 w-5 mr-3 animate-spin" viewBox="0 0 24 24">
                   <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                   <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20.735a8 8 0 008-8h4a12 12 0 01-12 12v-4.265zM20 12a8 8 0 01-8 8v4.265a12 12 0 0012-12h-4zm-8-6.735a8 8 0 018-8v-4.265a12 12 0 00-12 12h4z" />
               </svg> : ""} */}
              {loadingImage ? "Gathering evidence..." : "Give me evidence"}
            </button>
            <button
              onClick={() => location.reload()}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Fresh theory
            </button>
          </div>
          {imageUrl && (
            <div className="mt-4">
              <h2 className="text-2xl mb-4">Evidence</h2>
              <img
                src={imageUrl}
                alt="Generated"
                className="border border-gray-300"
              />
            </div>
          )}
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
