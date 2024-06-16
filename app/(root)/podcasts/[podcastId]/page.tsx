"use client"

import EmptyState from "@/components/EmptyState"
import LoaderSpinner from "@/components/LoaderSpinner"
import PodcastCard from "@/components/PodcastCard"
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import Image from "next/image"
import React from "react"

const PodcastDetails = ({
  params: { podcastId },
}: {
  params: { podcastId: Id<"podcasts"> }
}) => {
  const { user } = useUser()

  const podcast = useQuery(api.podcasts.getPodcastById, { podcastId })

  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, {
    podcastId,
  })

  const isOwner = user?.id === podcast?.authorId

  if (!similarPodcasts || !podcast) return <LoaderSpinner />

  return (
    <section className="flex w-full flex-col mt-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 mt-4">
          <PodcastDetailPlayer
            isOwner={isOwner}
            podcastId={podcast._id}
            {...podcast}
          />
          <h1 className="text-18 font-bold text-white-1">Prompt</h1>
          <p className="text-16 font-medium text-white-2 max-w-[455px]">
            {podcast?.imagePrompt}
          </p>
        </div>
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Posts</h1>

        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className="podcast_grid">
            {similarPodcasts
              ?.slice() // Creates a shallow copy of the array
              .reverse() // Reverses the order of the copied array
              .map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                <PodcastCard
                  key={_id}
                  imgUrl={imageUrl as string}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                />
              ))}
          </div>
        ) : (
          <>
            <EmptyState
              title="No similar posts found"
              buttonLink="/discover"
              buttonText="Discover more podcasts"
            />
          </>
        )}
      </section>
    </section>
  )
}

export default PodcastDetails
