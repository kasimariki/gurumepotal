const GRAPH_API_BASE = "https://graph.facebook.com/v21.0"

export class InstagramClient {
  private accessToken: string
  private igUserId: string

  constructor(accessToken: string, igUserId: string) {
    this.accessToken = accessToken
    this.igUserId = igUserId
  }

  // Step 1: Create media container
  async createMediaContainer(imageUrl: string, caption: string) {
    const params = new URLSearchParams({
      image_url: imageUrl,
      caption,
      access_token: this.accessToken,
    })

    const res = await fetch(`${GRAPH_API_BASE}/${this.igUserId}/media?${params}`, {
      method: "POST",
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(`Instagram create container error: ${JSON.stringify(error)}`)
    }

    return res.json() as Promise<{ id: string }>
  }

  // Step 2: Publish the container
  async publishMedia(containerId: string) {
    const params = new URLSearchParams({
      creation_id: containerId,
      access_token: this.accessToken,
    })

    const res = await fetch(`${GRAPH_API_BASE}/${this.igUserId}/media_publish?${params}`, {
      method: "POST",
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(`Instagram publish error: ${JSON.stringify(error)}`)
    }

    return res.json() as Promise<{ id: string }>
  }

  // Combined: upload and publish
  async post(imageUrl: string, caption: string): Promise<{ id: string }> {
    const container = await this.createMediaContainer(imageUrl, caption)
    // Wait for container to be ready
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return this.publishMedia(container.id)
  }
}
