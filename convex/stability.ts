import { action } from "./_generated/server"
import { v } from "convex/values"
import axios from "axios"
import FormData from "form-data"

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    try {
      const payload = {
        prompt,
        output_format: "jpeg",
      }

      const response = await axios.postForm(
        `https://api.stability.ai/v2beta/stable-image/generate/ultra`,
        axios.toFormData(payload, new FormData()),
        {
          validateStatus: undefined,
          responseType: "arraybuffer",
          headers: {
            Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
            Accept: "image/*",
          },
        }
      )
      console.log("API response:", response)

      if (response.status === 200) {
        const buffer = Buffer.from(response.data)
        return buffer // Return the image buffer
      } else {
        throw new Error(`${response.status}: ${response.data.toString()}`)
      }
    } catch (error) {
      console.error("Error occurred while generating thumbnail:", error)
      throw new Error("Failed to generate thumbnail")
    }
  },
})
