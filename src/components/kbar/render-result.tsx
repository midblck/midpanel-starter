import { KBarResults, useMatches } from 'kbar'
import ResultItem from './result-item'

export default function RenderResults() {
  const { results, rootActionId } = useMatches()

  if (!results || results.length === 0) {
    return <div className='px-4 py-8 text-center text-muted-foreground'>No results found</div>
  }

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className='text-muted-foreground bg-muted/50 px-4 py-2 text-sm font-medium uppercase tracking-wide'>
            {item}
          </div>
        ) : (
          <ResultItem action={item} active={active} currentRootActionId={rootActionId ?? ''} />
        )
      }
    />
  )
}
