import Queue from 'bull'
import { Redis } from 'ioredis'

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
}

// Create Redis connection
export const redis = new Redis(redisConfig)

// Conversion Job Type
export interface ConversionJob {
  conversionId: string
  userId: string | null
  originalFileUrl: string
  originalFileName: string
  sourceFormat: string
  targetFormat: string
  quality?: number // For images: 72-300 DPI
  compression?: boolean
  options?: {
    colorMode?: string
    pageRange?: string
  }
}

// Create Bull Queue for conversions
export const conversionQueue = new Queue<ConversionJob>('conversions', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000, // 2 seconds, then 4, then 8
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000, // Keep max 1000 completed jobs
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
  },
  settings: {
    maxStalledCount: 1, // Max times a job can be stalled
    retryProcessDelay: 5000, // Delay before retrying failed jobs
  },
})

// Queue event handlers
conversionQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result)
})

conversionQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message)
})

conversionQueue.on('stalled', (job) => {
  console.warn(`Job ${job.id} stalled`)
})

// Process jobs with concurrency
export function startQueueProcessor() {
  conversionQueue.process(5, async (job) => {
    // This will be implemented in the job handler
    // For now, just return a placeholder
    return {
      status: 'processing',
      message: 'Job handler will process this',
    }
  })
}

// Helper functions
export async function addConversionJob(jobData: ConversionJob) {
  return await conversionQueue.add('convert', jobData, {
    priority: jobData.userId ? 1 : 0, // Prioritize logged-in users
    timeout: 5 * 60 * 1000, // 5 minutes timeout
  })
}

export async function getJobStatus(jobId: string) {
  const job = await conversionQueue.getJob(jobId)
  if (!job) {
    return null
  }

  const state = await job.getState()
  const progress = job.progress()
  const result = await job.finished().catch(() => null)

  return {
    id: job.id,
    state,
    progress,
    result,
    data: job.data,
    failedReason: job.failedReason,
    processedOn: job.processedOn,
    finishedOn: job.finishedOn,
  }
}

// Cleanup function
export async function closeQueue() {
  await conversionQueue.close()
  await redis.quit()
}

