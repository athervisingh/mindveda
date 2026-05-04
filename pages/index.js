import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import ServiceCard from '../components/ServiceCard'
import FeaturedService from '../components/FeaturedService'
import TestimonialCarousel from '../components/TestimonialCarousel'
import ImagePlaceholder from '../components/ImagePlaceholder'
import { motion } from 'framer-motion'
import { featuredCards, homepageServices } from '../lib/siteContent'

const heroStats = [
  { value: '1000+', label: 'Lives transformed' },
  { value: '15+', label: 'Years experience' },
  { value: '18+', label: 'Cities & retreats' },
]

const trustPoints = ['100% Confidential', 'Expert Therapist', 'Flexible Sessions']

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-gray-900">
      <Header />

      <main className="flex-1">
        <section className="brand-hero relative pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ y: [0, -16, 0], x: [0, 8, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-6 top-16 hidden lg:block w-24 h-24 rounded-full bg-white/60 blur-2xl"
            />
            <motion.div
              animate={{ y: [0, 18, 0], x: [0, -10, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-16 top-24 hidden lg:block w-36 h-36 rounded-full bg-brand/10 blur-2xl"
            />
          </div>

          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-medium text-brand shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                Mindveda by Babita · healing space for mind and body
              </div>

              <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95]">
                You don't have to
                <span className="block text-[#2d2343]">carry it all.</span>
              </h1>

              <p className="mt-4 text-4xl md:text-5xl font-light text-brand leading-tight">
                Let's heal it together.
              </p>

              <p className="mt-6 max-w-xl text-base md:text-lg text-gray-600 leading-8">
                Expert counseling, mindful practices, and transformational retreats designed to calm your nervous system and help you feel fully supported.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/packages" className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-brand/20">
                    Book a Session <span>→</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/blog" className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-4 text-sm font-semibold text-gray-700 shadow-sm">
                    Explore Blog
                  </Link>
                </motion.div>
              </div>

              <div className="mt-8 flex flex-wrap gap-5 text-sm text-gray-600">
                {trustPoints.map((point) => (
                  <div key={point} className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
                    <span className="text-brand">✦</span>
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-3 gap-3 md:gap-4">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/80 bg-white/70 px-4 py-4 text-center shadow-soft backdrop-blur">
                    <div className="text-2xl md:text-3xl font-semibold text-[#2d2343]">{stat.value}</div>
                    <div className="mt-1 text-xs md:text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotateY: -16, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="relative mx-auto w-full max-w-[620px]"
              style={{ perspective: '1400px' }}
            >
              <div className="absolute -left-6 top-10 h-48 w-48 rounded-[32px] bg-white/50 blur-2xl" />
              <div className="absolute -right-8 bottom-8 h-56 w-56 rounded-[40px] bg-brand/10 blur-2xl" />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative rounded-[36px] border border-white/70 bg-white/60 p-4 shadow-[0_30px_80px_rgba(61,45,91,0.14)] backdrop-blur-xl"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute -right-4 top-12 z-20 hidden md:block rounded-2xl bg-white/90 px-5 py-4 shadow-xl">
                  <div className="text-3xl font-semibold text-brand">1000+</div>
                  <div className="text-xs text-gray-500">Lives transformed</div>
                </div>

                <div className="grid grid-cols-[1.1fr_0.9fr] gap-4 min-h-[620px]">
                  <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f8f3eb] to-[#efe8fb] p-6">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_34%)]" />
                    <div className="relative h-full flex flex-col justify-between">
                      <div>
                        <div className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-brand shadow-sm">Featured session</div>
                        <div className="mt-6 max-w-xs rounded-3xl bg-white/85 p-5 shadow-lg">
                          <div className="text-sm text-gray-500">Signature support</div>
                          <div className="mt-2 text-2xl font-semibold text-[#2d2343]">A calm, premium healing experience</div>
                          <div className="mt-3 text-sm text-gray-600">Designed around your rhythm, your goals, and your pace.</div>
                        </div>
                      </div>

                      <div className="relative mt-8 rounded-[30px] border border-white/80 bg-white/70 p-4 shadow-2xl">
                        <ImagePlaceholder width="w-full" height="h-[320px]" label="Babita portrait placeholder" />
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-[#2d2343]">Babita</div>
                            <div className="text-xs text-gray-500">Clinical Psychologist & Wellness Coach</div>
                          </div>
                          <div className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-md">Book now</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="rounded-[28px] bg-[#221c33] p-5 text-white shadow-2xl shadow-[#221c33]/20">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/60">Play video</div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="grid h-16 w-16 place-items-center rounded-full border border-white/20 bg-white/10 text-2xl">▶</div>
                        <div>
                          <div className="text-lg font-semibold">Watch Babita's intro</div>
                          <div className="text-sm text-white/70">A warm 45-second welcome to MindVeda</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[28px] bg-white/80 p-5 shadow-xl backdrop-blur">
                      <div className="text-xs uppercase tracking-[0.22em] text-gray-400">Live support</div>
                      <div className="mt-3 text-2xl font-semibold text-[#2d2343]">Private, guided, and deeply calming</div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {['Online Counseling', 'Yoga & Wellness', 'Couples Therapy', 'Healing Retreats'].map((item) => (
                          <div key={item} className="rounded-2xl bg-[#f8f6fb] px-3 py-4 text-sm text-gray-700">{item}</div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[28px] overflow-hidden bg-white/80 p-4 shadow-xl">
                      <div className="grid grid-cols-[1fr_1.2fr] gap-4 items-center">
                        <div className="rounded-[24px] bg-[#f1ebdb] p-4">
                          <div className="text-sm text-gray-500">Next available</div>
                          <div className="mt-2 text-2xl font-semibold text-[#2d2343]">Today</div>
                          <div className="mt-1 text-xs text-gray-500">Book your 15-min call</div>
                        </div>
                        <div className="rounded-[24px] bg-brand px-5 py-5 text-white">
                          <div className="text-sm text-white/80">Package spotlight</div>
                          <div className="mt-2 text-lg font-semibold">Starter healing package</div>
                          <div className="mt-2 text-sm text-white/80">Includes consultation, first session, and plan setup.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-brand text-sm uppercase tracking-[0.28em] font-semibold">What we offer</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-[#2d2343]">Support for every chapter of life</h2>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6">
            {homepageServices.map((service, index) => (
              <ServiceCard key={service.title} icon={service.icon} title={service.title} description={service.description} />
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCards.map((card, index) => (
              <FeaturedService key={card.title} index={index} title={card.title} description={card.description} features={card.features} />
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
              <ImagePlaceholder width="w-full" height="h-[460px]" label="Babita image placeholder" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">About Babita</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-[#2d2343]">Hi, I'm Babita</h2>
              <p className="mt-2 text-lg text-gray-600">Your partner in healing and growth.</p>
              <p className="mt-6 text-gray-600 leading-8 max-w-2xl">
                With 15+ years of experience in clinical psychology and holistic wellness, I blend science-backed therapy with mindful practices to help people heal deeply and live fully.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4 max-w-xl">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white p-4 text-center shadow-soft">
                    <div className="text-2xl font-semibold text-brand">{stat.value}</div>
                    <div className="mt-1 text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              <blockquote className="mt-8 rounded-[28px] border border-gray-100 bg-white p-6 shadow-soft">
                <div className="text-4xl text-brand/40">“</div>
                <p className="mt-2 text-lg italic text-gray-700">
                  Everyone has the strength within themselves. I'm here to help you unlock it.
                </p>
              </blockquote>
            </motion.div>
          </div>
        </section>

        <TestimonialCarousel />

        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">From our blog</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#2d2343]">Practical articles and emotional support</h2>
            </div>
            <Link href="/blog" className="text-sm font-medium text-brand">View all articles →</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Morning Rituals to Reduce Anxiety Before Work',
              'Somatic Healing: How Your Body Stores Stress',
              'Healthy Boundaries: The Ultimate Act of Self-Love',
            ].map((title, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-soft"
              >
                <ImagePlaceholder width="w-full" height="h-52" label="" />
                <div className="p-6">
                  <div className="inline-flex rounded-full bg-[#f4edf8] px-3 py-1 text-xs font-medium text-brand">Mindfulness</div>
                  <h3 className="mt-4 text-xl font-semibold text-[#2d2343] group-hover:text-brand transition-colors">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">A dummy article card with a premium layout, perfect for your later real content.</p>
                  <Link href="/blog" className="mt-5 inline-flex text-sm font-medium text-brand">Read more →</Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-stretch">
            <div className="rounded-[32px] bg-[#fffaf0] p-8 shadow-soft">
              <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">Begin your journey today</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#2d2343]">A calm first step for booking and support</h2>
              <p className="mt-4 text-gray-600 leading-8 max-w-2xl">
                You can book a session, choose a package, or simply send a message. The experience should feel warm, premium, and reassuring from the first click.
              </p>

              <div className="mt-8 grid gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-3"><span className="text-brand">📞</span> +91 98765 43210</div>
                <div className="flex items-center gap-3"><span className="text-brand">📧</span> hello@mindveda.com</div>
                <div className="flex items-center gap-3"><span className="text-brand">📍</span> Delhi | Mumbai | Bangalore</div>
              </div>
            </div>

            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-[32px] bg-gradient-to-br from-brand to-brand-light p-8 text-white shadow-2xl shadow-brand/20"
            >
              <div className="text-sm uppercase tracking-[0.24em] text-white/70">Schedule a free 15-min consultation</div>
              <h3 className="mt-4 text-3xl font-semibold leading-tight">Let's talk about how we can help you feel better.</h3>
              <p className="mt-4 text-white/80 leading-7">The payment UI is ready, and Razorpay can be plugged in later without redesigning the flow.</p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link href="/packages" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-brand shadow-lg">Schedule now →</Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
