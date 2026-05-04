import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import ServiceCard from '../components/ServiceCard'
import FeaturedService from '../components/FeaturedService'
import TestimonialCarousel from '../components/TestimonialCarousel'
import ImagePlaceholder from '../components/ImagePlaceholder'
import { motion } from 'framer-motion'
import { featuredCards, homepageServices } from '../lib/siteContent'
import Image from 'next/image'

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
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#fbfaf7]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/hero.png"
              alt="Hero background"
              fill
              className="object-cover w-full h-full"
              priority
            />
            {/* Overlay gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
            <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-6xl font-semibold leading-tight">
                  <span className="block text-[#2d2343]">You don't have to</span>
                  <span className="block text-brand mt-2">carry it all.</span>
                </h1>

                <p className="mt-6 text-2xl md:text-3xl font-light text-brand">
                  Let's heal it together.
                </p>

                <p className="mt-6 text-base md:text-lg text-gray-700 max-w-lg leading-relaxed">
                  Expert counseling, mindful practices & transformational retreats for a calmer, balanced and meaningful life.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/packages" className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand/30 hover:shadow-xl">
                      Book a Session <span>→</span>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/services" className="inline-flex items-center gap-2 rounded-full border-2 border-gray-400 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50">
                      Explore Services
                    </Link>
                  </motion.div>
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                  {trustPoints.map((point) => (
                    <div key={point} className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm border border-gray-100">
                      <span className="text-brand text-lg">✓</span>
                      <span className="text-sm font-medium text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right side with stats badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="relative hidden lg:block"
              >
                <div className="absolute -right-12 bottom-12 rounded-3xl bg-white/95 px-8 py-6 shadow-2xl border border-white/80 backdrop-blur">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-brand">1000+</div>
                    <div className="mt-2 text-sm text-gray-600">Lives Transformed</div>
                    <div className="mt-3 text-2xl text-red-400">♥</div>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-brand/10 blur-3xl"
                />
              </motion.div>
            </div>
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
