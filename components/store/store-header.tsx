"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Menu, X, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name_fa: string
  slug: string
}

interface StoreHeaderProps {
  siteSettings: {
    logo_url?: string | null
    site_name?: string | null
  } | null
  categories: Category[]
}

export function StoreHeader({ siteSettings, categories }: StoreHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled ? "bg-background/80 backdrop-blur-xl border-b shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container flex h-20 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {siteSettings?.logo_url ? (
            <img
              src={siteSettings.logo_url || "/placeholder.svg"}
              alt={siteSettings.site_name || "سُر استور"}
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                <div className="absolute inset-0 h-8 w-8 bg-primary/30 blur-xl rounded-full" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-l from-primary via-primary to-foreground bg-clip-text text-transparent">
                {siteSettings?.site_name || "سُر استور"}
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="relative text-sm font-medium text-foreground/70 hover:text-foreground transition-colors group"
          >
            خانه
            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Categories Dropdown */}
          {categories.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                دسته‌بندی‌ها
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.id} asChild>
                    <Link href={`/?category=${cat.slug}`} className="cursor-pointer">
                      {cat.name_fa}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Link
            href="/#products"
            className="relative text-sm font-medium text-foreground/70 hover:text-foreground transition-colors group"
          >
            محصولات
            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/#contact"
            className="relative text-sm font-medium text-foreground/70 hover:text-foreground transition-colors group"
          >
            تماس با ما
            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="rounded-full hover:bg-primary/10 transition-colors"
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-primary/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background/95 backdrop-blur-xl">
              <SheetHeader>
                <SheetTitle>منو</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-6 mt-12">
                <Link href="/" className="text-xl font-medium hover:text-primary transition-colors">
                  خانه
                </Link>
                {categories.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-sm text-muted-foreground">دسته‌بندی‌ها</span>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/?category=${cat.slug}`}
                        className="block text-lg font-medium hover:text-primary transition-colors pr-4"
                      >
                        {cat.name_fa}
                      </Link>
                    ))}
                  </div>
                )}
                <Link href="/#products" className="text-xl font-medium hover:text-primary transition-colors">
                  محصولات
                </Link>
                <Link href="/#contact" className="text-xl font-medium hover:text-primary transition-colors">
                  تماس با ما
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Bar */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500",
          isSearchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container px-4 md:px-8 pb-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="جستجو در محصولات..."
              className="pr-12 h-12 text-base rounded-full bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
              dir="rtl"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
