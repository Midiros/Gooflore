"use client";

import { useState } from "react";
import Alert from "@/components/alert";
import Image from "next/image";

// Main module for the app
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

  // Handle the generation of the theory based on the prompt
  async function handleGenerate() {
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
        setAlert({
          message: "New conspiracy theory unlocked!",
          type: "success",
        });
      } else {
        setError(data.error);
        setAlert({ message: data.error, type: "error" });
      }
    } catch (err) {
      setError("An error occurred while generating the theory.");
      setAlert({
        message: "Apparently this is not a conspiracy theory.",
        type: "error",
      });
    }
  }

  // Handle the saving of the theory to the database after clicking the archive button
  async function handleSave() {
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
        setAlert({
          message:
            "Theory archived, it is now stored eternally. Or until my free credits run out.",
          type: "success",
        });
      } else {
        setError(data.error);
        setAlert({ message: data.error, type: "error" });
      }
    } catch (err) {
      setError("An error occurred while saving the theory.");
      setAlert({
        message: "An error occured while saving the theory.",
        type: "error",
      });
    }
  }

  // Handle the generation of the image
  async function handleGenerateImage() {
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
      setAlert({
        message: "This image is too haunting to show you.",
        type: "error",
      });
    } finally {
      setLoadingImage(false);
    }
  }

  // Body of the main page
  return (
    <div className="min-h-96 flex flex-col items-center justify-center py-30">
      <Image
        src="/goofler_logo.png"
        width={300}
        height={300}
        alt="website logo"
        className="hover:animate-pulse w-[15%] h-[15%] stroke-grey-900 my-8"
      />
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
      {/* if a theory is generated display the components bellow, essentialy vyhodnoceni podminky a nastavovani vsech component unvitr visibility 0/100% */}
      {response && (
        <div className="mt-4 w-1/2">
          <h2 className="text-2xl mb-4">Theory explained</h2>
          <p className="border border-gray-300 p-4 hover:animate-pulse">
            {response}
          </p>

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
