"use client"

import { HorizontalScrollCarousel } from "@/components/ui/horizontal-scroll-carousel"

const images = [
  "https://images.unsplash.com/photo-1572099606223-6e29045d7de3?q=80&w=2070",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2074",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2070",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=2070",
  "https://images.unsplash.com/photo-1604076913837-52ab5f6f0c79?q=80&w=2070",
]

function HorizontalScrollCarouselDemo() {
  return (
    <div className="bg-background">
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-muted-foreground">
          Scroll Down to See the Carousel
        </span>
      </div>
      
      <HorizontalScrollCarousel images={images} />
      
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-muted-foreground">
          Enjoy the Horizontal Scroll Effect
        </span>
      </div>
    </div>
  )
}

export { HorizontalScrollCarouselDemo }
