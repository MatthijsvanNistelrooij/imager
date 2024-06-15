"use client"
import Image from "next/image"
import { useEffect, useState } from "react"

import { PodcastProps, ProfileCardProps } from "@/types"

import LoaderSpinner from "./LoaderSpinner"
import { Button } from "./ui/button"

const ProfileCard = ({
  podcastData,
  imageUrl,
  userFirstName,
}: ProfileCardProps) => {
  const [randomPodcast, setRandomPodcast] = useState<PodcastProps | null>(null)

  const playRandomPodcast = () => {
    const randomIndex = Math.floor(Math.random() * podcastData.podcasts.length)

    setRandomPodcast(podcastData.podcasts[randomIndex])
  }

  if (!imageUrl) return <LoaderSpinner />

  return (
    <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
      <Image
        src={imageUrl}
        width={250}
        height={250}
        alt="Podcaster"
        className="aspect-square rounded-lg"
      />
      <div className="flex flex-col justify-center max-md:items-center">
        <div className="flex flex-col gap-2.5">
          <figure className="flex gap-2 max-md:justify-center">
            <Image
              src="/icons/verified.svg"
              width={15}
              height={15}
              alt="verified"
            />
            <h2 className="text-14 font-medium text-white-2">
              Verified Creator
            </h2>
          </figure>
          <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
            {userFirstName}
          </h1>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
