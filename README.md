Here is a draft README for the Sentence Embeddings with NextJS project:

# Sentence Embeddings with NextJS

This project demonstrates generating sentence embeddings using a Transformer model in a Next.js application.

## Overview

The app allows users to input a query sentence and a list of other sentences. It then uses a background Web Worker to generate embeddings for each sentence using the `@xenova/transformers` library and a MiniLM model. 

The query embedding is compared to the other sentence embeddings using cosine similarity to find the most similar sentences.

![local embeddings](https://github.com/hotkartoffel/nextjs-sentence-embeddings/assets/11430621/714408ec-b93c-48f9-881c-4c8555db56a3)

The results are displayed on the page, ranked by similarity score.

## Running the app

To run the app locally:

1. Clone the repo
2. Run `npm install` 
3. Run `npm run dev`
4. Open http://localhost:3000 in your browser

## Implementation

The app is implemented using:

- Next.js framework (React)
- Tailwind CSS for styling
- Web Workers for background processing
- `@xenova/transformers` for generating embeddings

The worker script `worker.js` handles loading the model and generating embeddings. It communicates with the main app using message passing.

The main App component manages:

- User input for query/sentences
- Passing input to worker
- Receiving and displaying results
- Loading state
