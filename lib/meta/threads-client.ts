const GRAPH_API_BASE = "https://graph.threads.net/v1.0"

export class ThreadsClient {
  private accessToken: string
  private threadsUserId: string

  constructor(accessToken: string, threadsUserId: string) {
    this.accessToken = accessToken
    this.threadsUserId = threadsUserId
  }

  // Step 1: Create media container
  async createContainer(options: {
    text?: string
    imageUrl?: string
    mediaType?: "TEXT" | "IMAGE" | "VIDEO" | "CAROUSEL"
  }) {
    const params = new URLSearchParams({
      access_token: this.accessToken,
      media_type: options.mediaType || (options.imageUrl ? "IMAGE" : "TEXT"),
    })

    if (options.text) params.set("text", options.text)
    if (options.imageUrl) params.set("image_url", options.imageUrl)

    const res = await fetch(`${GRAPH_API_BASE}/${this.threadsUserId}/threads?${params}`, {
      method: "POST",
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(`Threads create container error: ${JSON.stringify(error)}`)
    }

    return res.json() as Promise<{ id: string }>
  }

  // Step 2: Publish
  async publish(containerId: string) {
    const params = new URLSearchParams({
      creation_id: containerId,
      access_token: this.accessToken,
    })

    const res = await fetch(`${GRAPH_API_BASE}/${this.threadsUserId}/threads_publish?${params}`, {
      method: "POST",
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(`Threads publish error: ${JSON.stringify(error)}`)
    }

    return res.json() as Promise<{ id: string }>
  }

  // Combined: create and publish
  async post(text: string, imageUrl?: string): Promise<{ id: string }> {
    const container = await this.createContainer({
      text,
      imageUrl,
      mediaType: imageUrl ? "IMAGE" : "TEXT",
    })
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return this.publish(container.id)
  }
}
