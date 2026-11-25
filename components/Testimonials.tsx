import React from 'react'
import AnimatedButton from './AnimatedButton'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { images } from '@/utils/images'
import Link from 'next/link'

const Testimonials = () => {
    return (
        <section id='testimonials' aria-label='Testimonials' className='bg-cardGray/20'>
            <div className='mx-auto flex min-h-0 max-w-7xl flex-col gap-8 px-4 py-10 sm:min-h-[100vh] sm:gap-10 sm:justify-between sm:px-6 sm:py-20 lg:min-h-[120vh]'>
                <div className='flex flex-col gap-3 sm:flex-row sm:gap-5 sm:justify-between'>
                    <div className='w-full font-heading text-2xl font-extralight tracking-[0.01em] sm:w-[45%] sm:text-3xl'>
                        CRAFTED FOR SPACES. TRUSTED BY CUSTOMERS.
                    </div>

                    <div className='w-full text-left  text-sm font-light text-textGray sm:w-[45%] sm:text-right'>
                        From the first measurement to the finished installation, our work is built around the customer&apos;s requirements. See what customers have to say about their experience with Afsha Creative Solution<br/>
                         <Link 
                            href="/contact" 
                            aria-label="Get a custom metalwork quote"
                            className='inline-block'
                        > 
                            <div className='mt-4 flex justify-start sm:mt-5 sm:justify-end'>
                                <AnimatedButton text='GET A QUOTE' />
                            </div>
                        </Link>
                    </div>
                </div>

                <div className='scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto border-b border-white/10 px-4 pb-8 scroll-pl-4 sm:mx-0 sm:gap-5 sm:pb-12 sm:px-0 sm:scroll-pl-0'>
                    {/* Card 1: Google Reviews Highlight */}
                    <div className='flex h-[460px] w-[min(82vw,290px)] shrink-0 snap-start flex-col justify-between rounded-xl border border-white/[0.06] bg-cardGray p-4 sm:h-[480px] sm:w-[280px]'>
                        <div className='flex items-center justify-between border-b border-white/10 px-1 py-3 sm:py-4'>
                            <div className='relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10'>
                                <Image src="/google-lens-icon.png" width={20} height={20} alt='google-logo' className='h-5 w-5 object-contain' />
                            </div>
                            <div>
                                <div className='text-sm'>
                                    GOOGLE REVIEWS
                                </div>
                                <div className='flex items-center gap-0.5'>
                                    <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                    <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                    <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                    <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                    <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                    <div className='ml-1 text-[9px] text-textGray'>
                                        80+ <br /> Reviews
                                    </div>
                                </div>
                            </div>

                            <div className='flex h-5 w-16 items-center justify-center gap-1 rounded-xl border border-green-300/50 bg-green-800/30'>
                                <div className='h-1.5 w-1.5 rounded-full bg-green-500'></div>
                                <div className='text-[10px] font-light text-green-400'>Verified</div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-3 border-b border-white/10 px-1 py-3 sm:gap-4 sm:py-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex gap-0.5'>
                                    <Image src="/star.svg" width={18} height={18} alt='star' className='h-[18px] w-[18px]' />
                                    <Image src="/star.svg" width={18} height={18} alt='star' className='h-[18px] w-[18px]' />
                                    <Image src="/star.svg" width={18} height={18} alt='star' className='h-[18px] w-[18px]' />
                                    <Image src="/star.svg" width={18} height={18} alt='star' className='h-[18px] w-[18px]' />
                                    <Image src="/star.svg" width={18} height={18} alt='star' className='h-[18px] w-[18px]' />
                                </div>

                                <div className='text-[9px] font-light text-textGray'>
                                    9 months ago
                                </div>
                            </div>

                            <div className='text-xs italic font-extralight leading-relaxed text-white/90 sm:text-sm'>
                                &quot;Hi Rohit Nyamgoud here.
                                Railingo is not only a company it’s a family, In one word I can say is just close your eyes and go for the purchase you like. you will remember the product and person for a life time.&quot;
                            </div>
                        </div>

                        <div className='flex items-center gap-2.5 border-b border-white/10 px-1 py-3 sm:py-4'>
                            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-amber-700 text-sm font-medium'>
                                R
                            </div>
                            <div className='text-sm'>
                                Rohit Nyamgoud
                                <div className='text-[9px] font-extralight text-textGray'>
                                    Verified Client
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center justify-center py-3 sm:py-4'>
                            <button className='flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-light tracking-[0.1em] transition-colors hover:border-textGold/30 hover:bg-textGold/10 hover:text-textGold'>
                                View 80+ Reviews on Google
                                <ExternalLink className='w-2.5 stroke-2' />
                            </button>
                        </div>
                    </div>

                    {/* Card 2: Mohit Agarwal + Gate */}
                    <div className='flex h-[460px] w-[min(82vw,290px)] shrink-0 snap-start flex-col justify-between sm:h-[480px] sm:w-[280px]'>
                        <div className='flex h-[245px] w-full flex-col justify-between rounded-xl border border-white/10 bg-cardGray p-4 sm:h-[260px]'>
                            <div className='flex gap-0.5 px-1'>
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                            </div>

                            <div className='border-b border-white/10 px-1 py-3.5 text-xs italic font-extralight leading-relaxed text-white/90 sm:py-4'>
                                “We needed a custom main gate for our house. The team understood the design we wanted and delivered a strong, well-finished gate.”
                            </div>

                            <div className='flex items-center gap-2.5 px-1 pt-2 sm:pt-3'>
                                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-sm font-medium'>
                                    M
                                </div>
                                <div className='text-sm'>
                                    Mohit Agarwal
                                    <div className='text-[9px] font-extralight text-textGray'>
                                        Verified Client
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='relative h-[195px] w-full overflow-hidden rounded-xl sm:h-[200px]'>
                            <Image src={images.iron_gates.ironGate5} fill sizes='(max-width: 640px) 290px, 280px' alt='gate' className='object-cover' />
                        </div>
                    </div>

                    {/* Card 3: Railing + Rahul Sharma */}
                    <div className='flex h-[460px] w-[min(82vw,290px)] shrink-0 snap-start flex-col justify-between sm:h-[480px] sm:w-[280px]'>
                        <div className='relative h-[195px] w-full overflow-hidden rounded-xl sm:h-[200px]'>
                            <Image src={images.steel_stair_railing.ssStairRailling8} fill sizes='(max-width: 640px) 290px, 280px' alt='stair railing' className='object-cover' />
                        </div>

                        <div className='flex h-[245px] w-full flex-col justify-between rounded-xl border border-white/10 bg-cardGray p-4 sm:h-[260px]'>
                            <div className='flex gap-0.5 px-1'>
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                            </div>

                            <div className='border-b border-white/10 px-1 py-3.5 text-xs italic font-extralight leading-relaxed text-white/90 sm:py-4'>
                                “The stair railing was designed exactly according to our requirement. The finishing looks clean and the overall work was handled professionally.”
                            </div>

                            <div className='flex items-center gap-2.5 px-1 pt-2 sm:pt-3'>
                                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-sm font-medium'>
                                    R
                                </div>
                                <div className='text-sm'>
                                    Rahul Sharma
                                    <div className='text-[9px] font-extralight text-textGray'>
                                        Verified Client
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Amit Verma + Balcony */}
                    <div className='flex h-[460px] w-[min(82vw,290px)] shrink-0 snap-start flex-col justify-between sm:h-[480px] sm:w-[280px]'>
                        <div className='flex h-[245px] w-full flex-col justify-between rounded-xl border border-white/10 bg-cardGray p-4 sm:h-[260px]'>
                            <div className='flex gap-0.5 px-1'>
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                                <Image src="/star.svg" width={15} height={15} alt='star' className='h-[15px] w-[15px]' />
                            </div>

                            <div className='border-b border-white/10 px-1 py-3.5 text-xs italic font-extralight leading-relaxed text-white/90 sm:py-4'>
                                “We wanted a modern balcony railing for our new home. The design and fabrication turned out very well and matched the look of the house.”
                            </div>

                            <div className='flex items-center gap-2.5 px-1 pt-2 sm:pt-3'>
                                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-red-700 text-sm font-medium'>
                                    A
                                </div>
                                <div className='text-sm'>
                                    Amit Verma
                                    <div className='text-[9px] font-extralight text-textGray'>
                                        Verified Client
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='relative h-[195px] w-full overflow-hidden rounded-xl sm:h-[200px]'>
                            <Image src={images.steel_balcony_railing.ssBalconyRailling9} fill sizes='(max-width: 640px) 290px, 280px' alt='balcony railing' className='object-cover' />
                        </div>
                    </div>

                    {/* Trailing spacer for mobile horizontal scroll padding */}
                    <div className='w-1 shrink-0 sm:hidden' aria-hidden='true' />
                </div>

                {/* Stats Counter */}
                <div className='grid w-full grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 sm:gap-y-6 lg:flex lg:items-center lg:justify-between'>
                    <div className='text-3xl font-light sm:text-4xl lg:text-5xl'>
                        80+
                        <div className='mt-1.5 text-[9px] uppercase tracking-wider text-textGray font-extralight sm:text-[10px]'>
                            Total Reviews
                        </div>
                    </div>

                    <div className='text-3xl font-light sm:text-4xl lg:text-5xl'>
                        100+
                        <div className='mt-1.5 text-[9px] uppercase tracking-wider text-textGray font-extralight sm:text-[10px]'>
                            Custom Railing
                        </div>
                    </div>

                    <div className='text-3xl font-light sm:text-4xl lg:text-5xl'>
                        400+
                        <div className='mt-1.5 text-[9px] uppercase tracking-wider text-textGray font-extralight sm:text-[10px]'>
                            Custom Gate
                        </div>
                    </div>

                    <div className='text-3xl font-light sm:text-4xl lg:text-5xl'>
                        10+
                        <div className='mt-1.5 text-[9px] uppercase tracking-wider text-textGray font-extralight sm:text-[10px]'>
                            Year Working
                        </div>
                    </div>

                    <div className='col-span-2 text-3xl font-light sm:col-span-1 sm:text-4xl lg:text-5xl'>
                        99.4%
                        <div className='mt-1.5 text-[9px] uppercase tracking-wider text-textGray font-extralight sm:text-[10px]'>
                            On-Time Handover Rate
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Testimonials
