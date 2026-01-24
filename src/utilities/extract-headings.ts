/**
 * Extracts headings (H1, H2, H3, H4) from Lexical RichText JSON structure
 * Returns array of heading objects with id, text, and level
 */

type LexicalNode = {
  type?: string
  tag?: string
  children?: LexicalNode[]
  text?: string
  format?: number
}

export type Heading = {
  id: string
  text: string
  level: number
  slug: string
}

/**
 * Recursively extracts text from a Lexical node
 */
function extractTextFromNode(node: LexicalNode): string {
  if (node.text) {
    return node.text
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractTextFromNode).join('')
  }

  return ''
}

/**
 * Generates a slug-based ID from heading text
 */
function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

/**
 * Recursively traverses Lexical nodes to find headings
 */
function findHeadings(nodes: LexicalNode[], headings: Heading[] = []): Heading[] {
  if (!Array.isArray(nodes)) {
    return headings
  }

  for (const node of nodes) {
    // Check if this is a heading node (H1, H2, H3, or H4)
    if (
      node.type === 'heading' &&
      (node.tag === 'h1' || node.tag === 'h2' || node.tag === 'h3' || node.tag === 'h4')
    ) {
      const text = extractTextFromNode(node)
      if (text.trim()) {
        let level: number
        switch (node.tag) {
          case 'h1':
            level = 1
            break
          case 'h2':
            level = 2
            break
          case 'h3':
            level = 3
            break
          case 'h4':
            level = 4
            break
          default:
            level = 2
            break
        }
        const slug = generateHeadingId(text)
        const id = slug
        headings.push({ id, text, level, slug })
      }
    }

    // Recursively search in children
    if (node.children && Array.isArray(node.children)) {
      findHeadings(node.children, headings)
    }
  }

  return headings
}

/**
 * Extracts headings from Lexical RichText JSON structure
 * @param lexicalData - The Lexical JSON data structure
 * @returns Array of heading objects with id, text, and level
 */
export function extractHeadings(lexicalData: unknown): Heading[] {
  if (!lexicalData || typeof lexicalData !== 'object') {
    return []
  }

  const data = lexicalData as { root?: { children?: LexicalNode[] } }

  if (!data.root || !data.root.children || !Array.isArray(data.root.children)) {
    return []
  }

  const headings: Heading[] = []
  findHeadings(data.root.children, headings)

  // Ensure unique IDs by appending index if duplicates exist
  const seenIds = new Set<string>()
  return headings.map(heading => {
    let uniqueId = heading.id
    let counter = 1

    while (seenIds.has(uniqueId)) {
      uniqueId = `${heading.id}-${counter}`
      counter++
    }

    seenIds.add(uniqueId)
    return { ...heading, id: uniqueId, slug: uniqueId }
  })
}
