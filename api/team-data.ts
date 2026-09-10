import { loadTeamData } from '../lib/sheet/loadTeamData'

type VercelRes = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => VercelRes
  json: (body: unknown) => void
  end?: (body?: string) => void
}

type VercelReq = {
  method?: string
}

/**
 * GET /api/team-data
 * Server-side Google Sheet CSV → JSON for the SPA.
 * Cache at the CDN edge for ~1 min, allow SWR for 5 min.
 */
export default async function handler(req: VercelReq, res: VercelRes) {
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const data = await loadTeamData()
    res.setHeader(
      'Cache-Control',
      's-maxage=60, stale-while-revalidate=300',
    )
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.status(200).json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    res.setHeader('Cache-Control', 'no-store')
    res.status(502).json({ error: 'Failed to load sheet', detail: message })
  }
}
