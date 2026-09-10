import { loadTeamData } from '../lib/sheet/loadTeamData'

export const config = { runtime: 'edge' }

/**
 * GET /api/team-data
 * Server-side Google Sheet CSV → JSON for the SPA.
 * Edge runtime avoids Node ESM cold-start module-resolution crashes
 * with Vite `"type": "module"` projects.
 * Cache at the CDN edge for ~1 min, allow SWR for 5 min.
 */
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return Response.json(
      { error: 'Method not allowed' },
      { status: 405, headers: { Allow: 'GET, HEAD' } },
    )
  }

  try {
    const data = await loadTeamData()
    return Response.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return Response.json(
      { error: 'Failed to load sheet', detail: message },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
