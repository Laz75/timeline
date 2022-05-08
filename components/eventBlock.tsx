/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import styles from './eventBlock.module.scss'
import Image from 'next/image'
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
        { event.featuredImage?.node?.sourceUrl !== undefined ? 
        <div className={styles.imageWrapper}>
        <Image
            src={event.featuredImage.node.sourceUrl}
            alt=''
            layout='fill'
            objectFit="contain"
          />
        </div>
        : ''}
          <h3
            dangerouslySetInnerHTML={{
              __html: event.title
            }}
          />
          <p>{dayjs(event.timeline.startDate).format('DD-MM-YYYY')}{event.timeline.endDate !== null ? '/' + dayjs(event.timeline.endDate).format('DD-MM-YYYY'): ''}</p>
          <div
            dangerouslySetInnerHTML={{
              __html: event.description
            }}
          />
          <button className={styles.close} onClick={() => resetEvent('')}>×</button>
        </div>
    </article>
  )
}