'use client'

import { Facebook, Link2, Linkedin, MessageCircle, Twitter } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

type PostShareSectionProps = {
  title: string
  shareUrl: string
  variant?: 'default' | 'fill'
  showSeparator?: boolean
}

export function PostShareSection({
  title,
  shareUrl,
  variant = 'default',
  showSeparator = true,
}: PostShareSectionProps) {
  const isFill = variant === 'fill'

  // Create share links
  const shareLinks = [
    {
      label: 'Share on Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      icon: Twitter,
      strokeWidth: 2,
    },
    {
      label: 'Share on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: Facebook,
      strokeWidth: 2,
    },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: Linkedin,
      strokeWidth: 2,
    },
    {
      label: 'Share on WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`,
      icon: MessageCircle,
      strokeWidth: 2,
    },
    {
      label: 'Copy Link',
      href: '#',
      icon: Link2,
      strokeWidth: 2,
      onClick: async (e: React.MouseEvent) => {
        e.preventDefault()
        try {
          await navigator.clipboard.writeText(shareUrl)
          toast.success('Link copied to clipboard!')
        } catch {
          toast.error('Failed to copy link')
        }
      },
    },
  ]

  return (
    <>
      {showSeparator && <Separator className='my-6' />}
      <div className={isFill ? 'flex flex-col gap-2' : 'flex flex-col gap-4'}>
        <p
          className={isFill ? 'font-medium text-muted-foreground mb-2' : 'font-medium text-sm mb-2'}
        >
          {isFill ? 'Share this article:' : 'Share this article'}
        </p>
        <ul className='flex gap-2'>
          {shareLinks.map(link => {
            const Icon = link.icon
            const strokeWidth = link.strokeWidth ?? 2
            if (isFill) {
              return (
                <li key={link.label}>
                  <Button
                    variant='secondary'
                    size='icon'
                    className='rounded-full group'
                    asChild={!link.onClick}
                  >
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        aria-label={link.label}
                        className='w-full h-full flex items-center justify-center'
                      >
                        <Icon
                          strokeWidth={strokeWidth}
                          className='w-4 h-4 text-muted-foreground transition-colors fill-muted-foreground group-hover:fill-primary group-hover:text-primary'
                        />
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label={link.label}
                      >
                        <Icon
                          strokeWidth={strokeWidth}
                          className='w-4 h-4 text-muted-foreground transition-colors fill-muted-foreground group-hover:fill-primary group-hover:text-primary'
                        />
                      </a>
                    )}
                  </Button>
                </li>
              )
            }
            return (
              <li key={link.label}>
                {link.onClick ? (
                  <button
                    onClick={link.onClick}
                    className='inline-flex p-2 rounded-full transition-colors hover:bg-muted border'
                    aria-label={link.label}
                  >
                    <Icon strokeWidth={strokeWidth} className='w-4 h-4' />
                  </button>
                ) : (
                  <a
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex p-2 rounded-full transition-colors hover:bg-muted border'
                    aria-label={link.label}
                  >
                    <Icon strokeWidth={strokeWidth} className='w-4 h-4' />
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
