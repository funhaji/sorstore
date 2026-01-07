"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "@/components/store/product-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, Package, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name_fa: string
  slug: string
}

interface Product {
  id: string
  name_fa: string
  description_fa: string | null
  price: number
  original_price: number | null
  image_url: string | null
  category_id: string | null
  brand: string | null
  stock: number
  featured: boolean
  categories?: { name_fa: string; slug: string } | null
}

interface ProductGridProps {
  products: Product[]
  categories: Category[]
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState("newest")

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name_fa.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description_fa?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price
        if (sortBy === "price-high") return b.price - a.price
        return 0
      })
  }, [products, searchQuery, selectedCategory, sortBy])

  const featuredProducts = useMemo(() => products.filter((p) => p.featured), [products])

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">جستجو</Label>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="نام محصول..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-12 rounded-xl"
            dir="rtl"
          />
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">دسته‌بندی</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory} dir="rtl">
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="همه دسته‌بندی‌ها" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه دسته‌بندی‌ها</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name_fa}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Sort */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">مرتب‌سازی</Label>
        <Select value={sortBy} onValueChange={setSortBy} dir="rtl">
          <SelectTrigger className="h-12 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">جدیدترین</SelectItem>
            <SelectItem value="price-low">ارزان‌ترین</SelectItem>
            <SelectItem value="price-high">گران‌ترین</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="container px-4 md:px-8 py-16">
      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-1 bg-primary rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold">محصولات ویژه</h2>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} featured />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section id="products" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 bg-primary rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold">همه محصولات</h2>
          </div>

          {/* Mobile Filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden gap-2 rounded-xl bg-transparent">
                <SlidersHorizontal className="h-4 w-4" />
                فیلتر
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>فیلتر محصولات</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 rounded-2xl border bg-card/50 backdrop-blur p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                فیلتر محصولات
              </h3>
              <FilterContent />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="secondary" className="px-4 py-2 rounded-full">
                {filteredProducts.length} محصول
              </Badge>
              {selectedCategory !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className="text-destructive"
                >
                  حذف فیلتر
                </Button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in opacity-0"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6 animate-bounce">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">محصولی موجود نیست</h3>
                <p className="text-muted-foreground max-w-md">
                  به زودی محصولات جدید اضافه خواهند شد. لطفاً بعداً مراجعه کنید.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">محصولی یافت نشد</h3>
                <p className="text-muted-foreground">فیلترهای خود را تغییر دهید</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
