import { useMemo, useRef, useEffect } from 'react'
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
  const cardRef = useRef<HTMLElement>(null)
  const thumbnail = useMemo(
    () => platformThumbnail[video.platform](video.videoId),
    [video.platform, video.videoId]
  )

  useEffect(() => {
    if (cardRef.current) {
      const updatePosition = () => {
        const rect = cardRef.current?.getBoundingClientRect()
        if (rect) {
          cardRef.current?.style.setProperty('--card-top', `${rect.top}px`)
          cardRef.current?.style.setProperty('--card-height', `${rect.height}px`)
        }
      }
      updatePosition()
      window.addEventListener('scroll', updatePosition)
      window.addEventListener('resize', updatePosition)
      return () => {
        window.removeEventListener('scroll', updatePosition)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [])

  return (
    <article ref={cardRef} className="video-card">
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
          <span className="video-card__year">{video.year}</span>
        </div>
        {video.id === 'laroye' && (
          <div className="video-card__awards">
            <img 
              src="/fonts/arquivos_site_cachoeira/_louros/laroye_laurea-8FCCJ-2022-branco-2.png" 
              alt="Award 1" 
              className="video-card__award-image"
            />
            <img 
              src="/fonts/arquivos_site_cachoeira/_louros/laurel seleção2.png" 
              alt="Award 2" 
              className="video-card__award-image"
            />
            <img 
              src="/fonts/arquivos_site_cachoeira/_louros/LOURES 2022 universitária 1.png" 
              alt="Award 3" 
              className="video-card__award-image"
            />
          </div>
        )}
        <div className="video-card__tags">
          {video.roles.map((role) => (
            <span key={role} className="video-card__tag">
              {role}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
