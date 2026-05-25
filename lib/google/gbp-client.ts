export class GBPClient {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async request(path: string, options: RequestInit = {}) {
    const res = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
    if (!res.ok) {
      const error = await res.text()
      throw new Error(`GBP API error: ${res.status} ${error}`)
    }
    return res.json()
  }

  // List accounts
  async listAccounts() {
    return this.request("accounts")
  }

  // List locations for an account
  async listLocations(accountId: string) {
    return this.request(`accounts/${accountId}/locations`)
  }

  // Get location details
  async getLocation(locationName: string) {
    return this.request(locationName)
  }

  // Update location
  async updateLocation(locationName: string, data: Record<string, unknown>, updateMask: string) {
    return this.request(`${locationName}?updateMask=${updateMask}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }
}

// Reviews API uses a different base URL
export class GBPReviewsClient {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async request(path: string, options: RequestInit = {}) {
    const res = await fetch(`https://mybusiness.googleapis.com/v4/${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
    if (!res.ok) {
      const error = await res.text()
      throw new Error(`GBP Reviews API error: ${res.status} ${error}`)
    }
    return res.json()
  }

  // List reviews
  async listReviews(locationName: string, pageSize = 50, pageToken?: string) {
    const params = new URLSearchParams({ pageSize: String(pageSize) })
    if (pageToken) params.set("pageToken", pageToken)
    return this.request(`${locationName}/reviews?${params}`)
  }

  // Reply to a review
  async replyToReview(reviewName: string, comment: string) {
    return this.request(`${reviewName}/reply`, {
      method: "PUT",
      body: JSON.stringify({ comment }),
    })
  }
}

// GBP Posts API
export class GBPPostsClient {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async request(path: string, options: RequestInit = {}) {
    const res = await fetch(`https://mybusiness.googleapis.com/v4/${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
    if (!res.ok) {
      const error = await res.text()
      throw new Error(`GBP Posts API error: ${res.status} ${error}`)
    }
    return res.json()
  }

  // Create a local post
  async createPost(locationName: string, post: {
    summary: string
    mediaItems?: Array<{ mediaFormat: string; sourceUrl: string }>
    topicType?: string
    callToAction?: { actionType: string; url: string }
  }) {
    return this.request(`${locationName}/localPosts`, {
      method: "POST",
      body: JSON.stringify({
        languageCode: "ja",
        ...post,
      }),
    })
  }
}
