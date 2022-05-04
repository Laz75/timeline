import Head from 'next/head'
import Image from 'next/image'
import styles from 'styles/Home.module.scss'
import { Event } from 'lib/types'
import EventBlock from 'components/eventBlock'
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { SetStateAction, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'


export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('https://www.jimsteinman.it/timeline/wp-json/wp/v2/timeline?_embed');
  const data = await res.json()

  return {
    props: { timeline: data },
  };
};

const Home: NextPage = ({ timeline }: InferGetStaticPropsType<typeof getStaticProps>) => {

  dayjs.extend(relativeTime)

  const [categories, setCategories] = useState({})
  const [activeEvent, setActiveEvent] = useState('')
  const years = [1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990]
  const startDate = dayjs('1975-01-01')
  const endDate = dayjs('1990-12-31')
  const totalDays = endDate.diff(startDate, 'day')

  const result = timeline.reduce(function (r: { [x: string]: any[] }, a: { _embedded: { [x: string]: { [x: string]: { [x: string]: { name: string | number } } } } }) {
        r[a._embedded['wp:term']['0']['0'].name] = r[a._embedded['wp:term']['0']['0'].name] || [];
        r[a._embedded['wp:term']['0']['0'].name].push(a);
        return r;
    }, Object.create(null));

    const handleClick = (slug: string) => {
      setActiveEvent(slug)
    };
    

    useEffect(() => { 
      setCategories(result)
    }, [result])
  

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
          {Object.entries(categories).map(([key, value]) => (
            <section key={key}>
              <h2>{key}</h2>
              <ol className={styles.bar}>
                {years.map((year: number) => (
                   <li key={year} className={styles.year}>
                    {year}
                  </li>
                ))}
              </ol>
              <ol className={styles.section}>
                {(value as [])?.map((event: Event) => (
                  <li
                    key={event.slug}
                    style={{
                      left: dayjs(event.acf.start_date).diff(startDate, 'day') * 100 / totalDays + '%', 
                      width: event.acf.end_date !== "" ? dayjs(event.acf.end_date).diff(startDate, 'day') * 100 / totalDays - dayjs(event.acf.start_date).diff(startDate, 'day') * 100 / totalDays + '%' : 'auto'
                    }}
                    className={event.acf.end_date !== "" ? styles.end : ''}
                  >
                    <button onClick={() => handleClick(event.slug)} className={styles.info}>{ dayjs(event.acf.start_date).format('DD-MM-YYYY') } 
                      <span 
                        dangerouslySetInnerHTML={{
                          __html: event.title.rendered
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
