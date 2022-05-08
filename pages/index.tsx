import Head from 'next/head'
import { getCategories } from "lib/api";
import styles from 'styles/Home.module.scss'
import { Event, Category } from 'lib/types'
import EventBlock from 'components/eventBlock'
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'


export const getStaticProps: GetStaticProps = async () => {
  let categories = await getCategories();

  // I need to sort the subquery here because WPGraphQL can't sort custom fields.
  categories.nodes.forEach((category: Category) => {
    category.events.nodes.sort((a: { timeline: { startDate: string }; }, b: { timeline: { startDate: string; }; }) => a.timeline.startDate.localeCompare(b.timeline.startDate))
  })
 
  return {
    props: { 
      categories: categories.nodes
    },
    revalidate: 60
  };
};

const Home: NextPage = ({ categories }: InferGetStaticPropsType<typeof getStaticProps>) => {

  const years = Array.from({length: 47}, (_, i) => i + 1975) // Creates an array with 47 years starting in 1975.
  const startDate = dayjs('1975-01-01')
  const endDate = dayjs('2021-12-31')
  const totalDays = endDate.diff(startDate, 'day')

  const [activeEvent, setActiveEvent] = useState('')
  const handleClick = (slug: string) => {
    setActiveEvent(slug)
  };

  return (
    <div className="container">
      <Head>
        <title>My Timeline</title>
        <meta name="description" content="The timeline of my life" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1>My Timeline</h1>
        <div className={styles.timeline}>
          {categories.map((category: Category) => (
            <section key={category.name}>
              <h2>{category.name}</h2>
              <ol className={styles.bar}>
                {years.map((year: number) => (
                   <li key={year} className={styles.year}>
                    {year}
                  </li>
                ))}
              </ol>
              <ol className={styles.section}>
                {(category.events.nodes as [])?.map((event: Event) => (
                  <li
                    key={event.slug}
                    style={{
                      left: dayjs(event.timeline.startDate).diff(startDate, 'day') * 100 / totalDays + '%', 
                      width: event.timeline.endDate !== "" ? dayjs(event.timeline.endDate).diff(startDate, 'day') * 100 / totalDays - dayjs(event.timeline.startDate).diff(startDate, 'day') * 100 / totalDays + '%' : 'auto'
                    }}
                    className={event.timeline.endDate !== "" ? styles.end : ''}
                  >
                    <button onClick={() => handleClick(event.slug)} className={styles.info}>{ dayjs(event.timeline.startDate).format('DD-MM-YYYY') } 
                      <span 
                        dangerouslySetInnerHTML={{
                          __html: event.title
                        }}
                      />
                    </button>
                    <EventBlock event={event} show={activeEvent === event.slug} resetEvent={() => handleClick('')} />
                  </li>
                ))}
              </ol>

            </section>
          ))}
        </div>
      </main>

    </div>
  )
}

export default Home
