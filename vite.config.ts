import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

/** Dev-only /api/team-data — mirrors the Vercel serverless function. */
function teamDataApiPlugin(): Plugin {
  return {
    name: 'team-data-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]
        if (url !== '/api/team-data') {
          next()
          return
        }
        try {
          const mod = await server.ssrLoadModule('/lib/sheet/loadTeamData.ts')
          const loadTeamData = mod.loadTeamData as () => Promise<unknown>
          const loadFromCsvs = mod.loadTeamDataFromCsvs as (csvs: {
            matches: string
            trainingsA: string
            trainingsB: string
            afspraken: string
            tornooien: string
          }) => unknown

          let data: unknown
          try {
            data = await loadTeamData()
          } catch {
            // Offline / sheet blocked → fall back to local sample CSVs
            const dir = resolve(server.config.root, 'sheet-sync')
            const read = (gid: string) =>
              readFileSync(resolve(dir, `${gid}.csv`), 'utf8')
            if (!existsSync(resolve(dir, '477367804.csv'))) throw new Error('no samples')
            data = loadFromCsvs({
              matches: read('477367804'),
              trainingsA: read('1962606416'),
              trainingsB: read('2090515479'),
              afspraken: read('1883412318'),
              tornooien: read('384779886'),
            })
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader(
            'Cache-Control',
            's-maxage=60, stale-while-revalidate=300',
          )
          res.end(JSON.stringify(data))
        } catch (err) {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(
            JSON.stringify({
              error: 'Failed to load sheet',
              detail: err instanceof Error ? err.message : String(err),
            }),
          )
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), teamDataApiPlugin()],
})
