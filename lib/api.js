const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      'Authorization'
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }
  return json.data
}

export async function getCategories(){
  const data = await fetchAPI(
      `query AllCategories {
        categories {
          nodes {
            name
            events(first: 100) {
              nodes {
                description: content
                featuredImage {
                  node {
                    sourceUrl
                  }
                }
                title
                timeline {
                  endDate
                  startDate
                }
              }
            }
          }
        }
      }
    `,
      {
        variables: {},
      }
    );
  return data?.categories;
}