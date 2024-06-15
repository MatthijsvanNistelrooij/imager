import { PodcastCardProps } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"

const PodcastCard = ({ imgUrl, podcastId }: PodcastCardProps) => {
  const router = useRouter()

  const handleViews = () => {
    // increase views

    router.push(`/podcasts/${podcastId}`, {
      scroll: true,
    })
  }

  return (
    <div className="cursor-pointer" onClick={handleViews}>
      <figure className="flex flex-col gap-2">
        <Image
          src={imgUrl}
          width={174}
          height={174}
          alt={"image"}
          className="aspect-square h-fit w-full rounded-xl 2xl:size-[200px]"
        />
      </figure>
    </div>
  )
}

export default PodcastCard
