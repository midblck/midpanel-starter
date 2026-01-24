import type { StaticImageData } from 'next/image'

import RichText from '@/components/admin/rich-text'
import { cn } from '@/utilities/cn'
import React from 'react'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '@/components/admin/media'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = props => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
    minHeight = '350px',
    mediaLayout = 'contained',
    objectFit = 'cover',
    sectionSpacing = 'medium',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = props as any

  const getSpacingClass = (spacing: string) => {
    switch (spacing) {
      case 'none':
        return 'my-0'
      case 'small':
        return 'my-4'
      case 'medium':
        return 'my-8'
      case 'large':
        return 'my-12'
      case 'xlarge':
        return 'my-16'
      default:
        return 'my-8'
    }
  }

  const renderMedia = () => {
    if (!media || typeof media !== 'object') return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mediaData = media as any

    // Handle file upload
    if (mediaData.mediaType === 'upload' && mediaData.media) {
      const mediaResource = mediaData.media
      const caption = mediaResource?.caption

      return (
        <div className={cn(getSpacingClass(sectionSpacing))}>
          <div
            className={cn(
              mediaLayout === 'full' ? 'w-full' : 'container mx-auto',
              'overflow-hidden rounded-lg',
            )}
            style={{
              minHeight: minHeight === 'screen' ? '100vh' : minHeight,
            }}
          >
            <Media
              imgClassName={cn(
                'w-full h-full',
                objectFit === 'cover' ? 'object-cover' : 'object-contain',
                imgClassName,
              )}
              resource={mediaResource}
              src={staticImage}
            />
          </div>
          {caption && (
            <div
              className={cn(
                'mt-4 text-center',
                {
                  container: !disableInnerContainer,
                },
                captionClassName,
              )}
            >
              <RichText data={caption} enableGutter={false} />
            </div>
          )}
        </div>
      )
    }

    // Handle YouTube video
    if (mediaData.mediaType === 'video' && mediaData.videoUrl) {
      const videoId = mediaData.videoUrl.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      )?.[1]

      if (videoId) {
        return (
          <div className={cn(getSpacingClass(sectionSpacing))}>
            <div
              className={cn(
                mediaLayout === 'full' ? 'w-full' : 'container mx-auto',
                'overflow-hidden rounded-lg',
              )}
              style={{
                minHeight: minHeight === 'screen' ? '100vh' : minHeight,
              }}
            >
              <iframe
                width='100%'
                height='100%'
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                className='w-full'
                style={{ minHeight: minHeight === 'screen' ? '100vh' : minHeight }}
              />
            </div>
          </div>
        )
      }
    }

    return null
  }

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter && mediaLayout === 'contained',
        },
        className,
      )}
    >
      {renderMedia()}
    </div>
  )
}
