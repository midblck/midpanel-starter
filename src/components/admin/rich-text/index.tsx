import { MediaBlock } from '@/blocks/media-block/component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import {
  RichText as ConvertRichText,
  JSXConvertersFunction,
  LinkJSXConverter,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/code/component'

import { BannerBlock } from '@/blocks/banner/component'
import { ContentBlock } from '@/blocks/content/component'
import type {
  BannerBlock as BannerBlockProps,
  ContentBlock as ContentBlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { cn } from '@/utilities/cn'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<MediaBlockProps | BannerBlockProps | CodeBlockProps | ContentBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    banner: ({ node }) => <BannerBlock className='col-start-2 mb-4' {...node.fields} />,
    content: ({ node }) => <ContentBlock {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className='col-start-1 col-span-3'
        imgClassName='m-0'
        {...node.fields}
        captionClassName='mx-auto max-w-[48rem]'
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className='col-start-2' {...node.fields} />,
  },
})

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any // Use any for now to handle the type compatibility issues
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableGutter = true, enableProse = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'prose prose-lg dark:prose-invert mx-auto': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
