'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export default function Home() {
  const [query, setQuery] = useState("");
  const [sentences, setSentences] = useState([""]);
  const [outputs, setOutputs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingModel, setDownloadingModel] = useState(false)




  // Keep track of the classification result and the model loading status.
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState(null);

  // Create a reference to the worker object.
  const worker = useRef(null);

  useEffect(() => {
    if (!worker.current) return
    setLoading(true); // Set loading to true before making the request

    worker.current.postMessage({
      task: "feature-extraction",
      query,
      sentences,
    });

  }, [sentences, query])

  // We use the `useEffect` hook to set up the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    }
    setReady(true)

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      console.log(e.data)
      switch (e.data.status) {
        case 'download':
          setDownloadingModel(true)
        case 'initiate':
          setLoading(true); // Set loading to true when the request is initiated
          break;
        case 'ready':
          setLoading(false); // Set loading to false when the request is ready

          setReady(true);
          break;
        case 'complete':
          setLoading(false); // Set loading to false when the request is complete

          setOutputs(e.data.data)
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });



  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 w-full">
      <h1 className="text-xl font-bold mb-2 text-center">Sentence Similarity Demo </h1>

      <div className="space-y-4 -wfull">

        <div className="flex space-x-2">
          <div className='flex flex-col'>
            <label htmlFor="query">Query sentence:</label>
            <textarea
              id="query"
              className="flex-1 p-2 border rounded-md min-h-[200px]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What is the capital of France?"
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor="sentences">Sentences (one per line):</label>
            <textarea
              id="sentences"
              className="flex-1 p-2 border rounded-md min-h-[200px]"
              value={sentences.join("\n")}
              onChange={(e) => setSentences(e.target.value.split("\n"))}
              placeholder="
Paris is the capital of France.
London is located in the United Kingdom."
            />
          </div>
        </div>

        {loading && <div>Loading...</div>} {/* Show a loading message when loading is true */}
        {downloadingModel && <div>Downloading model - this can take a few seconds</div>}

        {(outputs.length > 0) &&
          <>
            <div className='text-lg font-bold'>Results</div>
            <pre className="w-full p-4 bg-gray-100 rounded-md overflow-auto">{JSON.stringify(outputs, null, 2)}</pre>
          </>
        }

      </div>
    </main>
  )
}
