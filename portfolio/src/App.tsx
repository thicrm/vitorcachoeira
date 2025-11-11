import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { VideoGrid } from './components/VideoGrid.tsx'
import { videos } from './data/videos.ts'

const FILTER_ORDER = ['All', 'Travel Film', 'Documentary', 'Commercial', 'Performance', 'Experimental']

const FILTER_LABELS: Record<string, string> = {
  All: 'All Projects',
  'Travel Film': 'Travel Films',
  Documentary: 'Documentaries',
  Commercial: 'Commercial Work',
  Performance: 'Performance Pieces',
  Experimental: 'Experimental Films',
}

function App() {
  const categories = useMemo<string[]>(() => {
    const uniqueCategories = Array.from(new Set(videos.map((video) => video.category)))
    const ordered = uniqueCategories.sort((a, b) => FILTER_ORDER.indexOf(a) - FILTER_ORDER.indexOf(b))
    return ['All', ...ordered]
  }, [])
  const [activeCategory, setActiveCategory] = useState<string>(categories[0])
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  const filteredVideos = useMemo(() => {
    if (activeCategory === 'All') return videos
    return videos.filter((video) => video.category === activeCategory)
  }, [activeCategory])

  const activeVideo = activeVideoId
    ? videos.find((video) => video.id === activeVideoId) ?? null
    : null

  useEffect(() => {
    if (!activeVideo) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveVideoId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeVideo])

  const closeModal = () => setActiveVideoId(null)

  return (
    <div className={`app-shell ${activeVideo ? 'is-modal-open' : ''}`}>
      <video
        className="background-video"
        src="https://pub-76ffd52f8d4541deba0aac1dbba56bf2.r2.dev/01_video_25.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className="app-shell__content">
        <header className="hero">
          <div className="hero__titles">
            <p className="hero__subtitle">multimidia artist, filmmaker</p>
            <h1 className="hero__heading">
              <span>VITOR CACHOEIRA</span>
            </h1>
          </div>
          <nav className="hero__filters" aria-label="Filter video categories" role="tablist">
            {categories.map((category) => (
              <button
                key={category}
                className={category === activeCategory ? 'is-active' : ''}
                onClick={() => setActiveCategory(category)}
                role="tab"
                aria-selected={category === activeCategory}
              >
                <span>{FILTER_LABELS[category] ?? category}</span>
              </button>
            ))}
          </nav>
        </header>

        <main>
          <VideoGrid videos={filteredVideos} onSelectVideo={setActiveVideoId} />
        </main>

        <footer className="footer">
          <div>
            <span>Available for commercial, documentary, and music projects.</span>
            <span>Based in Berlin • Working worldwide</span>
          </div>
          <a href="mailto:hello@filmmaker.studio">hello@filmmaker.studio</a>
        </footer>
      </div>

      {activeVideo ? (
        <div className="video-modal" role="dialog" aria-modal="true">
          <div className="video-modal__backdrop" onClick={closeModal} />
          <div className="video-modal__content">
            <button
              type="button"
              className="video-modal__close"
              onClick={closeModal}
              aria-label="Close video"
            >
              ×
            </button>
            <iframe
              src={activeVideo.embedUrl}
              title={activeVideo.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
