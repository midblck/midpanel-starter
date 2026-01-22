'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'

export const Logo = () => {
  const { theme } = useTheme()

  return (
    <div className='relative ml-6 w-[240px] h-[48px]'>
      {theme === 'dark' ? (
        <Image
          src='/branding/logo-dark.svg'
          alt='Logo'
          width={240}
          height={48}
          className='object-contain'
        />
      ) : (
        <Image
          src='/branding/logo-light.svg'
          alt='Logo'
          width={240}
          height={48}
          className='object-contain'
        />
      )}
    </div>
  )
}

export const Icon = () => {
  const { theme } = useTheme()

  return (
    <div className='relative h-full w-full'>
      {theme === 'dark' ? (
        <Image
          src='/branding/icon-dark.svg'
          alt='Icon'
          width={18}
          height={18}
          className='object-contain'
        />
      ) : (
        <Image
          src='/branding/icon-light.svg'
          alt='Icon'
          width={18}
          height={18}
          className='object-contain'
        />
      )}
    </div>
  )
}
