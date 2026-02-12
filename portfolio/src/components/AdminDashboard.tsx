import { useState, useEffect } from 'react'
import { 
  isAuthenticated, 
  logout, 
  getProjects, 
  updateProject, 
  addProject, 
  deleteProject,
  getAboutMeImage,
  updateAboutMeImage
} from '../services/api'
import type { VideoMeta, VideoPlatform, VideoRole } from '../data/videos'
import './AdminDashboard.css'

const ROLE_ORDER: VideoRole[] = ['DIRECTOR', 'CINEMATOGRAPHER', 'EDITOR', 'COLORIST', 'SOUNDTRACK']

type NavigateFunction = (path: string) => void

export function AdminDashboard({ navigate }: { navigate?: NavigateFunction }) {
  const handleNavigate = navigate || ((path: string) => {
    window.location.href = path
  })
  const [projects, setProjects] = useState<VideoMeta[]>([])
  const [aboutMeImage, setAboutMeImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<VideoMeta | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      handleNavigate('/admin')
      return
    }
    loadData()
  }, [handleNavigate])

  const loadData = async () => {
    try {
      const [projectsData, imageData] = await Promise.all([
        getProjects(),
        getAboutMeImage()
      ])
      setProjects(projectsData)
      setAboutMeImage(imageData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    handleNavigate('/admin')
  }

  const handleEditProject = (project: VideoMeta) => {
    setEditingProject({ ...project })
    setShowAddForm(false)
  }

  const handleSaveProject = async (projectData: Partial<VideoMeta>) => {
    setSaving(true)
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData)
      } else {
        // Generate ID from title
        const id = projectData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `project-${Date.now()}`
        const newProject: VideoMeta = {
          id,
          title: projectData.title || '',
          platform: projectData.platform || 'youtube',
          videoId: projectData.videoId || '',
          year: projectData.year || new Date().getFullYear().toString(),
          roles: projectData.roles || [],
          embedUrl: projectData.embedUrl || ''
        }
        await addProject(newProject)
      }
      await loadData()
      setEditingProject(null)
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to save project:', error)
      alert('Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      await deleteProject(id)
      await loadData()
    } catch (error) {
      console.error('Failed to delete project:', error)
      alert('Failed to delete project')
    }
  }

  const handleSaveAboutMeImage = async () => {
    setSaving(true)
    try {
      await updateAboutMeImage(aboutMeImage)
      alert('About Me image updated successfully!')
    } catch (error) {
      console.error('Failed to save image:', error)
      alert('Failed to save image')
    } finally {
      setSaving(false)
    }
  }

  const generateEmbedUrl = (platform: VideoPlatform, videoId: string): string => {
    if (platform === 'youtube') {
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`
    } else if (platform === 'vimeo') {
      return `https://player.vimeo.com/video/${videoId}`
    }
    return ''
  }

  if (loading) {
    return <div className="admin-dashboard__loading">Loading...</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Admin Dashboard</h1>
        <button onClick={handleLogout} className="admin-dashboard__logout">
          Logout
        </button>
      </div>

      <div className="admin-dashboard__content">
        {/* About Me Image Section */}
        <section className="admin-dashboard__section">
          <h2 className="admin-dashboard__section-title">About Me Image</h2>
          <div className="admin-dashboard__field">
            <label className="admin-dashboard__label">Image URL</label>
            <input
              type="url"
              value={aboutMeImage}
              onChange={(e) => setAboutMeImage(e.target.value)}
              className="admin-dashboard__input"
              placeholder="https://example.com/image.jpg"
            />
            {aboutMeImage && (
              <img 
                src={aboutMeImage} 
                alt="Preview" 
                className="admin-dashboard__image-preview"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
            <button
              onClick={handleSaveAboutMeImage}
              disabled={saving}
              className="admin-dashboard__button"
            >
              {saving ? 'Saving...' : 'Save Image'}
            </button>
          </div>
        </section>

        {/* Projects Section */}
        <section className="admin-dashboard__section">
          <div className="admin-dashboard__section-header">
            <h2 className="admin-dashboard__section-title">Projects</h2>
            <button
              onClick={() => {
                setShowAddForm(true)
                setEditingProject(null)
              }}
              className="admin-dashboard__button admin-dashboard__button--primary"
            >
              Add New Project
            </button>
          </div>

          {/* Add/Edit Form */}
          {(showAddForm || editingProject) && (
            <ProjectForm
              project={editingProject}
              onSave={handleSaveProject}
              onCancel={() => {
                setShowAddForm(false)
                setEditingProject(null)
              }}
              saving={saving}
              generateEmbedUrl={generateEmbedUrl}
            />
          )}

          {/* Projects List */}
          <div className="admin-dashboard__projects">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function ProjectCard({ 
  project, 
  onEdit, 
  onDelete 
}: { 
  project: VideoMeta
  onEdit: (project: VideoMeta) => void
  onDelete: (id: string) => void
}) {
  const thumbnail = project.thumbnailUrl || (
    project.platform === 'youtube' 
      ? `https://img.youtube.com/vi/${project.videoId}/hqdefault.jpg`
      : `https://vumbnail.com/${project.videoId}.jpg`
  )

  return (
    <div className="admin-project-card">
      <div className="admin-project-card__thumbnail">
        <img src={thumbnail} alt={project.title} />
      </div>
      <div className="admin-project-card__info">
        <h3 className="admin-project-card__title">{project.title}</h3>
        <div className="admin-project-card__meta">
          <span>{project.year}</span>
          <span>{project.platform}</span>
          <span>{project.roles.join(', ')}</span>
        </div>
      </div>
      <div className="admin-project-card__actions">
        <button
          onClick={() => onEdit(project)}
          className="admin-project-card__button admin-project-card__button--edit"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="admin-project-card__button admin-project-card__button--delete"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

function ProjectForm({
  project,
  onSave,
  onCancel,
  saving,
  generateEmbedUrl
}: {
  project: VideoMeta | null
  onSave: (data: Partial<VideoMeta>) => void
  onCancel: () => void
  saving: boolean
  generateEmbedUrl: (platform: VideoPlatform, videoId: string) => string
}) {
  const [formData, setFormData] = useState<Partial<VideoMeta>>({
    title: project?.title || '',
    platform: project?.platform || 'youtube',
    videoId: project?.videoId || '',
    year: project?.year || new Date().getFullYear().toString(),
    roles: project?.roles || [],
    embedUrl: project?.embedUrl || '',
    thumbnailUrl: project?.thumbnailUrl || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const embedUrl = generateEmbedUrl(formData.platform as VideoPlatform, formData.videoId || '')
    onSave({ ...formData, embedUrl })
  }

  const toggleRole = (role: VideoRole) => {
    const roles = formData.roles || []
    if (roles.includes(role)) {
      setFormData({ ...formData, roles: roles.filter(r => r !== role) })
    } else {
      setFormData({ ...formData, roles: [...roles, role] })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-project-form">
      <div className="admin-project-form__field">
        <label className="admin-project-form__label">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="admin-project-form__input"
          required
        />
      </div>

      <div className="admin-project-form__field">
        <label className="admin-project-form__label">Platform</label>
        <select
          value={formData.platform}
          onChange={(e) => {
            const platform = e.target.value as VideoPlatform
            setFormData({ 
              ...formData, 
              platform,
              embedUrl: generateEmbedUrl(platform, formData.videoId || '')
            })
          }}
          className="admin-project-form__input"
          required
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
        </select>
      </div>

      <div className="admin-project-form__field">
        <label className="admin-project-form__label">Video ID</label>
        <input
          type="text"
          value={formData.videoId}
          onChange={(e) => {
            const videoId = e.target.value
            setFormData({ 
              ...formData, 
              videoId,
              embedUrl: generateEmbedUrl(formData.platform as VideoPlatform, videoId)
            })
          }}
          className="admin-project-form__input"
          required
          placeholder="eEfurQ9uYYE"
        />
      </div>

      <div className="admin-project-form__field">
        <label className="admin-project-form__label">Year</label>
        <input
          type="text"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="admin-project-form__input"
          required
        />
      </div>

      <div className="admin-project-form__field">
        <label className="admin-project-form__label">Thumbnail URL (Optional)</label>
        <input
          type="url"
          value={formData.thumbnailUrl || ''}
          onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
          className="admin-project-form__input"
          placeholder="https://example.com/thumbnail.jpg"
        />
        <p className="admin-project-form__help">
          Leave empty to use automatic thumbnail from {formData.platform}. Add a custom image URL to override.
        </p>
        {formData.thumbnailUrl && (
          <div className="admin-project-form__thumbnail-preview">
            <img 
              src={formData.thumbnailUrl} 
              alt="Thumbnail preview" 
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        )}
      </div>

      <div className="admin-project-form__field">
        <label className="admin-project-form__label">Roles</label>
        <div className="admin-project-form__roles">
          {ROLE_ORDER.map((role) => (
            <label key={role} className="admin-project-form__role-checkbox">
              <input
                type="checkbox"
                checked={formData.roles?.includes(role) || false}
                onChange={() => toggleRole(role)}
              />
              <span>{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="admin-project-form__actions">
        <button
          type="submit"
          disabled={saving}
          className="admin-project-form__button admin-project-form__button--save"
        >
          {saving ? 'Saving...' : project ? 'Update Project' : 'Add Project'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="admin-project-form__button admin-project-form__button--cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

