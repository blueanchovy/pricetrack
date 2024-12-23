"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import React, { FormEvent, useState } from "react";

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidAmazonUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
      if (
        ["www.amazon.com", "amazon.com", "amazon.in", "www.amazon.in"].includes(
          hostname
        )
      ) {
        return true;
      }
    } catch (error) {
      return false;
    }
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonUrl(searchPrompt);

    alert(isValidLink ? "Valid link" : "Please provide a valid Amazon link");

    try {
      setIsLoading(true);

      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />
      <button
        className="searchbar-btn"
        type="submit"
        disabled={searchPrompt === "" || isLoading}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
