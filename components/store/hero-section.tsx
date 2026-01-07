"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Slider {
  id: string
  title_fa: string
  subtitle_fa: string | null
  image_url: string | null
  link_url: string | null
}

interface Banner {
  id: string
  title_fa: string
  image_url: string | null
  link_url: string | null
}

interface HeroSectionProps {
  sliders: Slider[]
  banners: Banner[]
}

export function HeroSection({ sliders, banners }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextSlide = useCallback(() => {
    if (sliders.length <= 1 || isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % sliders.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [sliders.length, isAnimating])

  const prevSlide = useCallback(() => {
    if (sliders.length <= 1 || isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [sliders.length, isAnimating])

  useEffect(() => {
    if (sliders.length <= 1) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [sliders.length, nextSlide])

  const heroBanner = banners.find((b) => b.image_url)

  // Empty state - no sliders or banners
  if (sliders.length === 0 && banners.length === 0) {
    return (
      <section className="relative w-full py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container relative z-10 px-4 md:px-8">
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="mb-8 animate-bounce">
              <Sparkles className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 animate-slide-up">
              <span className="bg-gradient-to-l from-primary via-primary to-foreground bg-clip-text text-transparent">
                سُر استور
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-slide-up stagger-1 opacity-0">
              به زودی محصولات جدید اضافه خواهند شد
            </p>
            <Button asChild size="lg" className="rounded-full px-10 h-14 animate-slide-up stagger-2 opacity-0">
              <Link href="/#products">مشاهده محصولات</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full py-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container relative z-10 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Slider - Takes 2/3 on desktop */}
          <div className="lg:col-span-2 relative group">
            <div className="relative aspect-[16/9] md:aspect-[2/1] rounded-3xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 shadow-2xl">
              {sliders.length > 0 ? (
                <>
                  {sliders.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={cn(
                        "absolute inset-0 transition-all duration-500",
                        index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105",
                      )}
                    >
                      {slide.image_url ? (
                        <img
                          src={slide.image_url || "/placeholder.svg"}
                          alt={slide.title_fa}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Sparkles className="h-20 w-20 text-primary/50" />
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                        <h2 className="text-2xl md:text-4xl font-black mb-2 text-foreground animate-slide-up">
                          {slide.title_fa}
                        </h2>
                        {slide.subtitle_fa && (
                          <p className="text-sm md:text-lg text-muted-foreground mb-4 animate-slide-up stagger-1 opacity-0">
                            {slide.subtitle_fa}
                          </p>
                        )}
                        {slide.link_url && (
                          <Button asChild className="w-fit rounded-full px-8 animate-slide-up stagger-2 opacity-0">
                            <Link href={slide.link_url}>مشاهده</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Navigation Arrows */}
                  {sliders.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background hover:scale-110 shadow-lg"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background hover:scale-110 shadow-lg"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {sliders.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={cn(
                              "w-2 h-2 rounded-full transition-all duration-300",
                              index === currentSlide ? "bg-primary w-8" : "bg-foreground/30 hover:bg-foreground/50",
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">اسلایدر از پنل مدیریت اضافه کنید</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Banner - Takes 1/3 on desktop */}
          <div className="relative group">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full rounded-3xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 shadow-2xl min-h-[250px]">
              {heroBanner ? (
                <Link href={heroBanner.link_url || "#"} className="block w-full h-full">
                  {heroBanner.image_url ? (
                    <img
                      src={heroBanner.image_url || "/placeholder.svg"}
                      alt={heroBanner.title_fa}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{heroBanner.title_fa}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-6 right-6 left-6">
                    <h3 className="text-xl md:text-2xl font-bold">{heroBanner.title_fa}</h3>
                  </div>
                </Link>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <div className="text-center p-6">
                    <Sparkles className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">بنر تبلیغاتی از پنل مدیریت اضافه کنید</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
