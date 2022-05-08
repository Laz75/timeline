
export interface Event {
  slug: string
  title: string
  description: string
  timeline: {
    startDate: string
    endDate: string
  }
  featuredImage: {
    node: {
      sourceUrl: string
    }
  },
  categories: [{
    nodes: {
      category: string
    }
  }]
}

export interface Category {
  name: string
  events: {
    nodes: Event[]
  }
}