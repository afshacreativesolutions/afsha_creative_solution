"use client"
import React, { useEffect, useRef } from 'react'
import AnimatedButton from './AnimatedButton'
import Link from 'next/link'

const Videos = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const video1 = useRef<HTMLVideoElement>(null)
    const video2 = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const v1 = video1.current
        const v2 = video2.current
        if (v1) v1.playbackRate = 0.5
        if (v2) v2.playbackRate = 0.5

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (v1 && v1.paused) v1.play().catch(() => {})
                    if (v2 && v2.paused) v2.play().catch(() => {})
                } else {
                    if (v1 && !v1.paused) v1.pause()
                    if (v2 && !v2.paused) v2.pause()
                }
            },
            { rootMargin: '300px' }
        )

        const currentSection = sectionRef.current
        if (currentSection) {
            observer.observe(currentSection)
        }

        return () => {
            if (currentSection) {
                observer.unobserve(currentSection)
            }
        }
    }, [])

    return (
        <section ref={sectionRef} className='mx-auto flex min-h-0 w-full max-w-7xl flex-col items-center gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:min-h-screen lg:flex-row'>
            <div className='flex min-h-0 w-full flex-col gap-7 p-0 sm:gap-9 sm:p-6 lg:min-h-[80vh] lg:w-1/2 lg:justify-between'>
                <div className='font-heading text-2xl font-extralight tracking-[0.01em] sm:text-3xl'>
                    THE ARTISANS OF METALWORK
                    <div className='mt-4 text-[10px] font-light tracking-[0.14em] text-textGold sm:text-[11px] sm:tracking-[0.2em]'>
                        where skilled fabrication meets thoughtful design.
                        <div className='w-12 border-b border-textGold/60 mt-2'></div>
                    </div>
                </div>
                <div className='relative h-[220px] w-full max-w-[500px] overflow-hidden rounded-xl sm:h-[280px] lg:h-[250px]'>
                    <video
                        ref={video1}
                        poster='/videos/Process/process-poster.webp'
                        src='/videos/Process/process-video.mp4'
                        className='absolute inset-0 z-0 h-full w-full object-cover'
                        muted
                        playsInline
                        preload='none'
                        loop
                    />
                </div>
                <div className='text-sm leading-7 text-textGray sm:text-base'>
                    At Afsha Creative Solution, metalwork is built around the details. From elegant stair and balcony railings to custom steel and iron gates, our workshop creates practical, made-to-measure solutions for homes, businesses, and construction projects. Every project is shaped by hands-on fabrication, careful finishing, and real-world experience.
                </div>
                <div className='flex w-full justify-center sm:w-auto'>

                <Link href={"/contact"}><AnimatedButton text='OUR ARTISANS' /></Link>
                </div>
            </div>

            <div className='w-full lg:w-1/2'>
                <div className='relative h-[min(110vw,440px)] min-h-[260px] w-full overflow-hidden rounded-xl sm:h-[32rem] lg:h-[42rem]'>
                    <video
                        ref={video2}
                        poster='/videos/Products/products-poster.webp'
                        src="/videos/Products/products-video.mp4"
                        className='absolute inset-0 z-0 h-full w-full object-cover'
                        muted
                        playsInline
                        preload='none'
                        loop
                    ></video>
                </div>
            </div>
        </section>
    )
}

export default Videos
