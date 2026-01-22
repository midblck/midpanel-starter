import Image from 'next/image'

export const Logo = () => {
  return (
    <div className='tw:relative tw:ml-6 tw:w-[200px] tw:h-[40px]'>
      <Image
        src='/branding/logo-light.svg'
        alt='Logo'
        fill
        className='tw:hidden tw:object-contain tw:dark:block'
      />
      <Image
        src='/branding/logo-dark.svg'
        alt='Logo'
        fill
        className='tw:object-contain tw:dark:hidden'
      />
    </div>
  )
}

export const Icon = () => {
  return (
    <div className='h-full w-full'>
      <Image
        src='/branding/icon-dark.svg'
        width={18}
        height={18}
        alt='Icon'
        className='tw:object-contain tw:dark:hidden'
      />
      <Image
        src='/branding/icon-light.svg'
        alt='Icon'
        width={18}
        height={18}
        className='tw:hidden tw:object-contain tw:dark:block'
      />
    </div>
  )
}
