import { useRef, useState } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { GenerateThumbnailProps } from "@/types"
import { Loader } from "lucide-react"
import { Input } from "./ui/input"
import Image from "next/image"
import { useToast } from "./ui/use-toast"
import { useAction, useMutation } from "convex/react"
import { useUploadFiles } from "@xixixao/uploadstuff/react"
import { api } from "@/convex/_generated/api"
import { v4 as uuidv4 } from "uuid"

const GenerateThumbnail = ({
  setImage,
  setImageStorageId,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false)
  const { toast } = useToast()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getImageUrl = useMutation(api.podcasts.getUrl)
  const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction)
  const [loading, setLoading] = useState(false)

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true)
    setImage("")

    try {
      const file = new File([blob], fileName, { type: "image/png" })

      const uploaded = await startUpload([file])
      const storageId = (uploaded[0].response as any).storageId

      setImageStorageId(storageId)

      const imageUrl = await getImageUrl({ storageId })
      setImage(imageUrl!)
      setIsImageLoading(false)
      setLoading(false)
      toast({
        title: "Image generated successfully",
      })
    } catch (error) {
      console.log(error)
      setLoading(false)

      toast({
        title: "Enter a prompt to generate image",
        variant: "destructive",
      })
    }
  }

  const generateImage = async () => {
    setLoading(true)
    try {
      const response = await handleGenerateThumbnail({ prompt: imagePrompt })
      const blob = new Blob([response], { type: "image/png" })
      handleImage(blob, `thumbnail-${uuidv4()}`)
    } catch (error) {
      console.log(error)
      setLoading(false)

      toast({
        title: "Error: Enter a prompt to generate image",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center items-center h-full">
          <Image
            src="/images/loading.gif"
            alt="loading"
            width={100}
            height={100}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {image ? (
            <div></div>
          ) : (
            <>
              <div className="mt-5 flex flex-col gap-2.5">
                <Label className="text-16 font-bold text-white-1">Prompt</Label>
                <Textarea
                  className="input-class font-light focus-visible:ring-offset-orange-1"
                  placeholder="Text to generate image"
                  rows={5}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                />
              </div>
              <div className="w-full max-w-[200px]">
                <Button
                  type="submit"
                  className="text-16 bg-black-2 py-4 font-bold text-white-1 hover:bg-black-3"
                  onClick={generateImage}
                >
                  {isImageLoading ? (
                    <>
                      Generating
                      <Loader size={20} className="animate-spin ml-2" />
                    </>
                  ) : (
                    "Generate ( give it a second )"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            width={450}
            height={450}
            className="mt-5"
            alt="thumbnail"
          />
        </div>
      )}
    </>
  )
}

export default GenerateThumbnail
