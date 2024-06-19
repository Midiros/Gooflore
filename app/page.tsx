"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [savedId, setSavedId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loadingImage, setLoadingImage] = useState<boolean>(false);

  const handleGenerate = async () => {
    setError("");
    setSavedId("");
    setImageUrl("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.text);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred while generating the response.");
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
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred while saving the response.");
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
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred while generating the image.");
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-2">
      <h1 className="text-4xl mb-8">Goofer's theory machine</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border border-gray-300 p-2 mb-4 w-1/2 text-black"
        placeholder="What is the goverment hiding from us ?"
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Explain this
      </button>
      {response && (
        <div className="mt-4 w-1/2">
          <h2 className="text-2xl mb-4">Generated Response</h2>
          <p className="border border-gray-300 p-4">{response}</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-2 mt-4 w-full text-black"
            placeholder="Enter your name"
          />
          <button
            onClick={handleSave}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          >
            Archive
          </button>
          <button
            onClick={handleGenerateImage}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l padding-left: 10px"
            disabled={loadingImage}
          >
            {loadingImage ? "Gathering evidence..." : "Give me evidence"}
          </button>
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
