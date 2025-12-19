"use client"

import * as React from "react"
import { motion, useTransform, useScroll } from "framer-motion"

interface HorizontalScrollCarouselProps {
  images: string[]
}

const HorizontalScrollCarousel: React.FC<HorizontalScrollCarouselProps> = ({ images }) => {
  const targetRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  })

  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-95%"])

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {images.map((src, index) => (
            <Card key={index} src={src} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const Card: React.FC<{ src: string }> = ({ src }) => {
  return (
    <div className="group relative h-[450px] w-[450px] overflow-hidden rounded-xl bg-muted">
      <img
        src={src}
        alt="Carousel item"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  )
}

export { HorizontalScrollCarousel }
