import React from 'react'

interface MetaKeywordsProps {
  keywords: string
}

const MetaKeywords: React.FC<MetaKeywordsProps> = ({ keywords }) => {
  if (!keywords) return null

  const keywordArray = keywords
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0)

  if (keywordArray.length === 0) return null

  return (
    <div className='flex flex-wrap gap-2'>
      {keywordArray.map((keyword, index) => (
        <span
          key={index}
          className='inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm'
        >
          {keyword}
        </span>
      ))}
    </div>
  )
}

export default MetaKeywords
