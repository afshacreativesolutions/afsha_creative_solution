"use client"
import Image from 'next/image'
import React from 'react'
import logo from "../assets/Logo/logo-mark.png"
import { icons, images } from '@/utils/images'
import AnimatedButton from './AnimatedButton'
import Link from 'next/link'
import { useConsent } from './consent/ConsentProvider'

const Footer = () => {
    let openSettings: (() => void) | undefined;
    try {
        const consent = useConsent();
        openSettings = consent.openSettings;
    } catch {
        // Fallback if rendered outside ConsentProvider
    }

    return (
        <div className='bg-cardGray/20'>
            <div className='mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 sm:gap-5 sm:px-6'>
                <div className='grid grid-cols-1 gap-6 border-b border-white/10 py-6 sm:grid-cols-2 sm:gap-10 sm:py-8 lg:grid-cols-5'>
                    <div className='flex flex-col gap-5 sm:col-span-2 lg:col-span-2'>
                       <Link href={""}> <div className='flex items-end cursor-pointer'>
                            <div className='relative text-sm rounded-md overflow-hidden h-13 w-13'>
                                <Image src={logo} height={80} className='object-left' alt='logo' />
                            </div>
                            <div className='text-textGold px-1 tracking-[0.3em]'>
                                <p className='text-lg font-extrabold'>AFSHA</p>
                                <p className='text-xs '>CREATIVE SOLUTION</p>
                                {/* <p>SOLUTION</p> */}
                            </div>
                        </div> </Link>

                        <div className='text-sm leading-6 text-textGray font-extralight tracking-[0.04em] sm:tracking-[0.06em]'>
                            Afsha Creative Solution provides custom metal fabrication in Moradabad, specializing in stair railings, balcony railings, steel & iron gates, and bespoke metalwork for homes and commercial projects.
                        </div>

                        <div className='flex gap-3'>
                            <Link
                                href="https://www.facebook.com/tinku.saifi.71?mibextid=ZbWKwL"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                            >
                                <div className='border group border-white/10 rounded-full w-fit p-2 hover:border-textGold/30 transition duration-300 ease-in-out'>
                                    <span
                                        aria-hidden='true'
                                        className='block h-5 w-5 bg-current text-white transition-colors duration-300 group-hover:text-textGold'
                                        style={{
                                            maskImage: `url(${icons.facebook.src})`,
                                            WebkitMaskImage: `url(${icons.facebook.src})`,
                                            maskRepeat: 'no-repeat',
                                            WebkitMaskRepeat: 'no-repeat',
                                            maskSize: 'contain',
                                            WebkitMaskSize: 'contain',
                                        }}
                                    />
                                </div>
                            </Link>

                            <Link
                                href="https://www.instagram.com/humdard_sahil_07?stkn=Z2k1anJlaDQ4MjF0"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                            >
                                <div className='border group border-white/10 rounded-full w-fit p-2 hover:border-textGold/30 transition duration-300 ease-in-out'>
                                    <span
                                        aria-hidden='true'
                                        className='block h-5 w-5 bg-current text-white transition-colors duration-300 group-hover:text-textGold'
                                        style={{
                                            maskImage: `url(${icons.instagrem.src})`,
                                            WebkitMaskImage: `url(${icons.instagrem.src})`,
                                            maskRepeat: 'no-repeat',
                                            WebkitMaskRepeat: 'no-repeat',
                                            maskSize: 'contain',
                                            WebkitMaskSize: 'contain',
                                        }}
                                    />
                                </div>
                            </Link>

                            <Link
                                href="https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20found%20your%20website%20and%20would%20like%20to%20discuss%20a%20metal%20fabrication%20project."
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                            >
                                <div className='border group border-white/10 rounded-full w-fit p-2 hover:border-textGold/30 transition duration-300 ease-in-out'>
                                    <span
                                        aria-hidden='true'
                                        className='block h-5 w-5 bg-current text-white transition-colors duration-300 group-hover:text-textGold'
                                        style={{
                                            maskImage: `url(${icons.whatsapp.src})`,
                                            WebkitMaskImage: `url(${icons.whatsapp.src})`,
                                            maskRepeat: 'no-repeat',
                                            WebkitMaskRepeat: 'no-repeat',
                                            maskSize: 'contain',
                                            WebkitMaskSize: 'contain',
                                        }}
                                    />
                                </div>
                            </Link>

                             <Link
                                href="https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20found%20your%20website%20and%20would%20like%20to%20discuss%20a%20metal%20fabrication%20project."
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                            >
                            <div className='border group border-white/10 rounded-full w-fit p-2 hover:border-textGold/30 transition duration-300 ease-in-out'>
                                <span
                                    aria-hidden='true'
                                    className='block h-5 w-5 bg-current text-white transition-colors duration-300 group-hover:text-textGold'
                                    style={{
                                        maskImage: `url(${icons.youtube.src})`,
                                        WebkitMaskImage: `url(${icons.youtube.src})`,
                                        maskRepeat: 'no-repeat',
                                        WebkitMaskRepeat: 'no-repeat',
                                        maskSize: 'contain',
                                        WebkitMaskSize: 'contain',
                                    }}
                                />
                            </div>
                            </Link>
                        </div>


                    </div>
                    <div className='min-w-0'>
                        <div className='text-textGold text-xs font-bold tracking-[0.3em] mb-5'>DISCOVER</div>
                        <ul className='font-extralight tracking-[0.06em] text-sm flex flex-col gap-2'>
                            <li className="transition duration-200 ease-in-out hover:translate-x-1 hover:text-textGold"><Link href="/categories">Categories</Link></li>
                            <li className="transition duration-200 ease-in-out hover:translate-x-1 hover:text-textGold"><Link href="/products">All Products</Link></li>
                            <li className="transition duration-200 ease-in-out hover:translate-x-1 hover:text-textGold"><Link href="/gallery">Gallery</Link></li>
                            <li className="transition duration-200 ease-in-out hover:translate-x-1 hover:text-textGold"><Link href="/custom-metalwork">Custom Metalwork</Link></li>
                            <li className="transition duration-200 ease-in-out hover:translate-x-1 hover:text-textGold"><Link href="/services">Services</Link></li>
                            <li className="transition duration-200 ease-in-out hover:translate-x-1 hover:text-textGold"><Link href="/faq">FAQ</Link></li>
                            <li className="transition duration-200 ease-in-out hover:translate-x-1 hover:text-textGold"><Link href="/blog">Blog & Guides</Link></li>
                        </ul>
                    </div>

                    <div className='flex min-w-0 flex-col gap-3'>
                        <div className='text-textGold text-xs font-bold mb-2 tracking-[0.3em]'>WORKSHOP</div>
                        <Link href="mailto:afshacreativesolutions@gmail.com"> <div className='flex min-w-0 gap-2 break-all text-sm font-extralight tracking-[0.03em] sm:tracking-[0.06em]'>
                            <Image src={icons.mail} width={20} height={20} alt='Mail' />
                            <div className="hover:text-textGold transition duration-300 ease-in-out">afshacreativesolutions@gmail.com</div>
                        </div> </Link>
                        <Link href="tel:+919634776691">  <div className='flex gap-2 text-sm font-extralight tracking-[0.03em] sm:tracking-[0.06em]'>
                            <Image src={icons.phone} width={20} height={20} alt='phone' />
                            <div className="hover:text-textGold transition duration-300 ease-in-out">9634776691</div>
                        </div> </Link>
                        <Link href="https://maps.google.com/?cid=7804843562812692638&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=en&gl=IN&source=embed" target='_blank' rel='noreferrer'> <div className='flex items-start gap-2 text-sm leading-6 font-extralight tracking-[0.03em] sm:tracking-[0.06em]'>
                            <Image src={icons.location} width={20} height={20} alt='location' className='self-start' />
                            <span>Near KK Farm House Bishanpur Road, Harthala, Lodhipur, Moradabad, Uttar Pradesh 244001</span>
                        </div></Link>
                    </div>

                    <div className='flex min-w-0 flex-col gap-5'>
                        <div className='text-textGold text-xs font-bold tracking-[0.3em]'>GET A QUOTE</div>
                        <div className='text-sm font-extralight text-textGray tracking-[0.03em]'>Receive architectural lookbooks, product spec sheets, and new collections.</div>
                        <Link className='block w-full max-w-[280px] sm:w-fit' 
                         href="/contact"
                         aria-label="Contact us for a quote"
                        ><AnimatedButton iconColor='#CDA274' textColor='#CDA274' dotColor='#000000' text='Get a Quote' /></Link>
                    </div>

                </div>

                {/* Local Search and Regional Links */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-[10px] uppercase tracking-[0.16em] text-white/40">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="text-textGold">Local Fabrication:</span>
                    <Link href="/locations/metal-gate-manufacturers-moradabad" className="hover:text-textGold transition">Metal Gates in Moradabad</Link>
                    <Link href="/locations/iron-railing-manufacturers-moradabad" className="hover:text-textGold transition">Iron Railings in Moradabad</Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link href="/faq" className="hover:text-textGold transition">FAQ</Link>
                    <Link href="/blog" className="hover:text-textGold transition">Guides</Link>
                    <Link href="/contact" className="hover:text-textGold transition">Contact</Link>
                    {openSettings && (
                      <button
                        type="button"
                        onClick={openSettings}
                        className="hover:text-textGold transition text-[10px] uppercase tracking-[0.16em]"
                      >
                        Cookie Settings
                      </button>
                    )}
                  </div>
                </div>
                <div className='flex flex-col gap-3 py-3 text-xs font-extralight tracking-[0.04em] text-textGray sm:flex-row sm:justify-between sm:text-sm sm:tracking-[0.06em]'>
                    <div>© 2026 Afsha Creative Solution. All Rights Reserved.</div>
                    <div className='sm:text-right'>
                        Designed & Engineered with Precision by
                        <Link href={"https://www.linkedin.com/in/linkedrealfalcon/"} className='text-textGold font-bold'> FalconDev</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer