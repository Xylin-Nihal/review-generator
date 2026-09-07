import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import generateReviews from './api/generateReviews.js'

function reviewApiPlugin(mode) {
  const env = loadEnv(mode, process.cwd(), '')

  if (env.GROQ_API_KEY && !process.env.GROQ_API_KEY) {
    process.env.GROQ_API_KEY = env.GROQ_API_KEY
  }

  return {
    name: 'review-api',
    configureServer(server) {
      server.middlewares.use('/api/generateReviews', (req, res, next) => {
        const response = {
          status(statusCode) {
            res.statusCode = statusCode
            return response
          },
          json(payload) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(payload))
          },
        }

        generateReviews(req, response).catch(next)
      })
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), reviewApiPlugin(mode)],
}))