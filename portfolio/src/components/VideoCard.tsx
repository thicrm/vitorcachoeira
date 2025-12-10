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
    <article className="video-card">
      <button
        type="button"
        className="video-card__thumbnail-button"
        onClick={() => onSelect(video.id)}
        aria-label={`Open video ${video.title}`}
      >
        <span
          className="video-card__media"
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
        <span aria-hidden="true" className="video-card__scanline" />
      </button>
      <div className="video-card__info">
        <h3 className="video-card__title">{video.title}</h3>
        <div className="video-card__meta">
          <span className="video-card__category">{video.category}</span>
          <span className="video-card__year">{video.year}</span>
        </div>
        <p className="video-card__description">{video.description}</p>
      </div>
    </article>
  )
}
