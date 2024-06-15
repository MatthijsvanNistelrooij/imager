"use client"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import LoaderSpinner from "@/components/LoaderSpinner"
import PodcastCard from "@/components/PodcastCard"

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts)

  if (!trendingPodcasts) return <LoaderSpinner />

  const reversedPodcasts = trendingPodcasts.slice().reverse();

  console.log("trendingPodcasts", trendingPodcasts)

  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5">
        <div className="podcast_grid">
        {reversedPodcasts.map(({ _id, imageUrl }) => (
            <PodcastCard
              key={_id}
              imgUrl={imageUrl as string}
              title={""}
              description={""}
              podcastId={_id}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
