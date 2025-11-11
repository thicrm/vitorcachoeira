import { useMemo } from 'react'
import type { VideoMeta } from '../data/videos.ts'

type VideoCardProps = {
  video: VideoMeta
  onSelect: (id: string) => void
}

const platformThumbnail = {
  youtube: (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
  vimeo: (id: string) => `https://vumbnail.com/${id}.jpg`,
}

export const VideoCard = ({ video, onSelect }: VideoCardProps) => {
  const thumbnail = useMemo(
    () => platformThumbnail[video.platform](video.videoId),
    [video.platform, video.videoId]
  )

  return (
    <button
      type="button"
      className="video-card"
      onClick={() => onSelect(video.id)}
      aria-label={`Open video ${video.title}`}
    >
      <span
        className="video-card__media"
      	style={{ backgroundImage: `url(${thumbnail})` }}
      />
      <span aria-hidden="true" className="video-card__scanline" />
    </button>
  )
}
