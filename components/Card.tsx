import Image from 'next/image'
import Link from 'next/link'
import type { StaticImageData } from 'next/image'

type cardType = {
    height?: string
    width?: string
    loading?: 'eager' | 'lazy'
    sizes?: string
    image: string | StaticImageData
    title: string
    description?: string
    tagline?: string
    rounded?: string
    href?: string
    onClick?: () => void
}

const Card = ({ height = "h-120", width = "w-90", loading = 'lazy', sizes = '(max-width: 640px) 85vw, (max-width: 1024px) 360px, 400px', rounded='rounded-md' ,image, title, description, tagline, href, onClick }: cardType) => {
    const isExternal = typeof image === 'string' && image.startsWith('http')
    const isSupabase = typeof image === 'string' && image.includes('supabase.co')
    const shouldSkipOptimization = isExternal && !isSupabase

    const content = (
        <>
            {image && (
                <Image
                    src={image}
                    fill
                    loading={loading}
                    unoptimized={shouldSkipOptimization}
                    sizes={sizes}
                    alt={title}
                    className='absolute z-0 object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus:scale-105'
                />
            )}

            <div className='absolute z-5 inset-0  bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300' />

            <div className='z-10 flex flex-col gap-2 translate-y-2 transition-all duration-300 group-hover:translate-y-0'>
                <div className='text-xs font-light text-textGray tracking-[0.2em]'>{tagline}</div>
                <div className=''>{title}</div>
                <div className='card-description md:translate-y-4 text-sm leading-5 text-textGray opacity-100 md:opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100'>
                    {description}
                </div>
            </div>
        </>
    )
    const className = `group relative ${height} ${width} shrink-0 overflow-hidden ${rounded} p-4 flex items-end justify-center cursor-pointer`
    return href
        ? <Link href={href} className={className} onClick={onClick}>{content}</Link>
        : <div tabIndex={0} className={className}>{content}</div>
}

export default Card
