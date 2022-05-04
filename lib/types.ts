
export interface Event {
  slug: string
  title: {
    rendered: string
  }
  acf: {
    start_date: string
    end_date: string
  }
  _embedded: {
  'wp:featuredmedia': [
    {
      source_url: string
    }
  ],
  'wp:term': [[
    {
      name: string
    }
  ]]
}
  content: {
    rendered: string
  } 
}