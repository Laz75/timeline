/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import styles from './eventBlock.module.scss'
import { Event } from 'lib/types'
import dayjs from 'dayjs'

type EventProps = {
  event: Event,
  show: boolean,
  resetEvent: Function
}

/*
 * This component creates a block for a restaurant that appears in homepage
 */
export default function EventBlock({event, show, resetEvent}: EventProps) {

  return (

    <article className={styles.mask} style={{display: show ? '' : 'none'}}>
      <div className={styles.block}>
        { event._embedded['wp:featuredmedia'] !== undefined ? 
        <img
            src={event._embedded['wp:featuredmedia']['0'].source_url}
            alt=''
          />
        : ''}
          <h3
            dangerouslySetInnerHTML={{
              __html: event.title.rendered
            }}
          />
          <p>{dayjs(event.acf.start_date).format('DD-MM-YYYY')}{event.acf.end_date !== '' ? '/' + dayjs(event.acf.end_date).format('DD-MM-YYYY'): ''}</p>
          <div
            dangerouslySetInnerHTML={{
              __html: event.content.rendered
            }}
          />
          <button className={styles.close} onClick={() => resetEvent('')}>×</button>
        </div>
    </article>
  )
}