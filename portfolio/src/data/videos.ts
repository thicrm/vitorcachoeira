export type VideoPlatform = 'youtube' | 'vimeo'

export type VideoMeta = {
  id: string
  title: string
  platform: VideoPlatform
  videoId: string
  category: string
  year: string
  description: string
  embedUrl: string
}

export const videos: VideoMeta[] = [
  {
    id: 'resonance-journey',
    title: 'Resonance Journey',
    platform: 'youtube',
    videoId: '8REf7Q46Izc',
    category: 'Travel Film',
    year: '2024',
    description:
      'Immersive travelogue blending documentary textures with contemporary dance in motion.',
    embedUrl: 'https://www.youtube.com/embed/8REf7Q46Izc?rel=0&modestbranding=1&playsinline=1',
  },
  {
    id: 'urban-passage',
    title: 'Urban Passage',
    platform: 'youtube',
    videoId: 'qjkQSOkTM5U',
    category: 'Experimental',
    year: '2023',
    description:
      'Street-level portrait capturing raw energy, spoken word, and layered city rhythms.',
    embedUrl: 'https://www.youtube.com/embed/qjkQSOkTM5U?rel=0&modestbranding=1&playsinline=1',
  },
  {
    id: 'refraction',
    title: 'Refraction',
    platform: 'youtube',
    videoId: 'wi5Mmo_89fE',
    category: 'Commercial',
    year: '2024',
    description:
      'Cinematic brand vignette focused on motion, light leaks, and tactile storytelling.',
    embedUrl: 'https://www.youtube.com/embed/wi5Mmo_89fE?rel=0&modestbranding=1&playsinline=1',
  },
  {
    id: 'gravity-echo',
    title: 'Gravity Echo',
    platform: 'youtube',
    videoId: 'ScTLp-7Nak8',
    category: 'Performance',
    year: '2022',
    description:
      'Minimalist stage piece studying bodies in flight and the tension between stillness and speed.',
    embedUrl: 'https://www.youtube.com/embed/ScTLp-7Nak8?rel=0&modestbranding=1&playsinline=1',
  },
  {
    id: 'fluidity',
    title: 'Fluidity',
    platform: 'vimeo',
    videoId: '998466285',
    category: 'Art Film',
    year: '2024',
    description:
      'Experimental short exploring water, memory, and analog distortion across layered visuals.',
    embedUrl: 'https://player.vimeo.com/video/998466285?title=0&byline=0&portrait=0',
  },
]
