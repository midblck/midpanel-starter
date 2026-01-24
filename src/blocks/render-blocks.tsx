import React, { Fragment } from 'react'

import { BannerBlock } from '@/blocks/banner/component'
import { CodeBlock } from '@/blocks/code/component'
import { ContentBlock } from '@/blocks/content/component'
import { MediaBlock } from '@/blocks/media-block/component'

type BlockType = 'banner' | 'code' | 'content' | 'mediaBlock'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockComponents: Record<BlockType, React.ComponentType<any>> = {
  banner: BannerBlock,
  code: CodeBlock,
  content: ContentBlock,
  mediaBlock: MediaBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Array<{ blockType: BlockType } & Record<string, unknown>>
}> = props => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className='my-16' key={index}>
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
