import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { VideoGrid } from './components/VideoGrid.tsx'
import { videos, type VideoRole } from './data/videos.ts'

const ROLE_ORDER: VideoRole[] = ['DIRECTOR', 'CINEMATOGRAPHER', 'EDITOR', 'COLORIST', 'SOUNDTRACK']

function App() {
  const allRoles = useMemo<VideoRole[]>(() => {
    const roleSet = new Set<VideoRole>()
    videos.forEach((video) => {
      video.roles.forEach((role) => roleSet.add(role))
    })
    return ROLE_ORDER.filter((role) => roleSet.has(role))
  }, [])
  
  const [activeRole, setActiveRole] = useState<VideoRole | 'All'>('All')
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  const filteredVideos = useMemo(() => {
    if (activeRole === 'All') return videos
    return videos.filter((video) => video.roles.includes(activeRole))
  }, [activeRole])

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
      <header id="header" className="header-section">
        <div className="header-section__content">
          <button
            type="button"
            className="header__logo"
            onClick={() => {
              document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' })
            }}
            aria-label="Scroll to top"
          >
            <img 
              src="/fonts/arquivos_site_cachoeira/favicon_1.png" 
              alt="Vitor Cachoeira Logo" 
            />
          </button>
          <div className="hero__titles">
            <p className="hero__subtitle">multimidia artist, filmmaker</p>
            <h1 className="hero__heading">
              <span className="hero__heading-line1">Vitor</span>
              <span className="hero__heading-line2">Cachoeira</span>
              <span className="hero__heading-blink">_</span>
            </h1>
            <nav className="hero__navigation">
              <a 
                href="#my-works" 
                className="hero__nav-link"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('my-works')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                My Works
              </a>
              <a 
                href="#about-me" 
                className="hero__nav-link"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('about-me')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                About Me
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section id="my-works" className="my-works-section">
        <div className="my-works-section__content">
          <h2 className="my-works-section__title">MY WORKS</h2>
          <nav className="my-works-section__filters" aria-label="Filter by role" role="tablist">
            <button
              className={activeRole === 'All' ? 'is-active' : ''}
              onClick={() => setActiveRole('All')}
              role="tab"
              aria-selected={activeRole === 'All'}
            >
              <span>All</span>
            </button>
            {allRoles.map((role) => (
              <button
                key={role}
                className={activeRole === role ? 'is-active' : ''}
                onClick={() => setActiveRole(role)}
                role="tab"
                aria-selected={activeRole === role}
              >
                <span>{role}</span>
              </button>
            ))}
          </nav>
          <VideoGrid videos={filteredVideos} onSelectVideo={setActiveVideoId} />
        </div>
      </section>

      <section id="about-me" className="about-section">
        <div className="about-section__content">
          <div className="about-section__layout">
            <div className="about-section__image">
              {/* Image placeholder - replace with actual image */}
              <div className="about-section__image-placeholder" />
            </div>
            <div className="about-section__text">
              <h2 className="about-section__title">ABOUT ME</h2>
              <div className="about-section__description">
                <p>
                  Vitor Cachoeira is a multimedia artist and filmmaker based in Berlin, working worldwide.
                  His work explores the intersection of documentary storytelling, contemporary dance, and experimental visual narratives.
                </p>
                <p>
                  Through travel films, performance pieces, and commercial projects, he creates immersive experiences
                  that blend cinematic techniques with authentic human connections.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div>
            <span>Available for commercial, documentary, and music projects.</span>
            <span>Based in Berlin • Working worldwide</span>
          </div>
          <div className="footer__social">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="Instagram"
            >
              <i className="bi bi-instagram"></i>
            </a>
            <a 
              href="https://vimeo.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="Vimeo"
            >
              <i className="bi bi-vimeo"></i>
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="YouTube"
            >
              <i className="bi bi-youtube"></i>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="LinkedIn"
            >
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
          <a href="mailto:hello@filmmaker.studio">hello@filmmaker.studio</a>
          <button
            type="button"
            className="footer__logo"
            onClick={() => {
              document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' })
            }}
            aria-label="Return to top"
          >
            <img 
              src="/fonts/arquivos_site_cachoeira/favicon_1.png" 
              alt="Vitor Cachoeira Logo" 
            />
          </button>
        </footer>
      </section>

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
