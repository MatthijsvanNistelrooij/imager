import React, { useState } from "react"
import axios from "axios"
import { Input } from "./ui/input"

interface CaptureData {
    signedUrls: {
      source: string;
    };
    capture: {
      title: string;
      type: string;
      location: string | null;
      privacy: string;
      date: string;
      username: string;
      status: string;
      slug: string;
      uuid: string;
    };
  }

const CaptureComponent: React.FC = () => {
  const [captureData, setCaptureData] = useState<CaptureData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")

  const captureTitle = prompt
  const authHeaders = {
    Authorization: process.env.LUMA_API_KEY,
  }

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        "https://webapp.engineeringlumalabs.com/api/v2/capture",
        { title: captureTitle },
        { headers: authHeaders }
      )

      // Log the response for debugging purposes
      console.log("Response Data:", response.data)

      setCaptureData(response.data)
    } catch (err: any) {
      console.error("API call failed:", err) // Log the error for debugging
      if (err.response) {
        console.error("Response data:", err.response.data)
        console.error("Response status:", err.response.status)
        console.error("Response headers:", err.response.headers)
        setError(`Error: ${err.response.status} ${err.response.statusText}`)
      } else if (err.request) {
        console.error("Request data:", err.request)
        setError("No response received from server.")
      } else {
        console.error("Error message:", err.message)
        setError(`Error: ${err.message}`)
      }
    }
    setLoading(false)
    }
    
  return (
    <div className="mt-10">
      <div className="p-4 bg-gray-800 rounded">
        <h1 className="text-2xl font-bold mb-4">LUMA Capture</h1>
        <Input onChange={(e) => setPrompt(e.target.value)} />

        <button
          onClick={fetchData}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
        >
          Capture Data
        </button>
        {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}
      {captureData && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Capture Data:</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(captureData, null, 2)}
          </pre>
          <p>Upload URL: {captureData.signedUrls.source}</p>
          <p>Capture Slug: {captureData.capture.slug}</p>
          <p>Title: {captureData.capture.title}</p>
          <p>Type: {captureData.capture.type}</p>
          <p>Privacy: {captureData.capture.privacy}</p>
          <p>Username: {captureData.capture.username}</p>
          <p>Date: {new Date(captureData.capture.date).toLocaleString()}</p>
          <p>Status: {captureData.capture.status}</p>

          {/* Display the video if the source URL is a video */}
          <h2 className="text-xl font-semibold mt-4">Source File:</h2>
          <video
            controls
            src={captureData.signedUrls.source}
            className="mt-4"
            style={{ maxWidth: "100%" }}
          />
        </div>
        )}
      </div>
    </div>
  )
}

export default CaptureComponent
