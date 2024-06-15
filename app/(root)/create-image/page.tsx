"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
// import GeneratePodcast from "@/components/GeneratePodcast"
import GenerateThumbnail from "@/components/GenerateThumbnail"
import { Loader } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"

const voiceCategories = ["alloy", "shimmer", "nova", "echo", "fable", "onyx"]

const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
})

const CreatePodcast = () => {
  const router = useRouter()
  const [imagePrompt, setImagePrompt] = useState("")
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  )
  const [imageUrl, setImageUrl] = useState("")

  const [audioUrl, setAudioUrl] = useState("")
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(
    null
  )
  const [audioDuration, setAudioDuration] = useState(0)

  const [voiceType, setVoiceType] = useState("shimmer")
  const [voicePrompt, setVoicePrompt] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  const createPodcast = useMutation(api.podcasts.createPodcast)

  const { toast } = useToast()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "Title",
      podcastDescription: "Description",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      if (!imageUrl) {
        toast({
          title: "Please generate an image",
        })
        setIsSubmitting(false)
        throw new Error("Please generate an image")
      }

      const podcast = await createPodcast({
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        audioUrl,
        imageUrl,
        voiceType,
        imagePrompt,
        voicePrompt,
        views: 0,
        audioDuration,
        imageStorageId: imageStorageId!,
      })
      toast({ title: "Post created" })
      setIsSubmitting(false)
      router.push("/")
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Image</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex w-full flex-col"
        >
          <div className="flex flex-col pt-1">
            <GenerateThumbnail
              setImage={setImageUrl}
              setImageStorageId={setImageStorageId}
              image={imageUrl}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
            />

            <div className="mt-10 w-full">
              <Button
                type="submit"
                className="text-16 w-full bg-black-2 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
              >
                {isSubmitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  "Submit & Publish"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default CreatePodcast
