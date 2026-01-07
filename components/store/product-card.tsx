"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertTriangle, Eye, Sparkles, ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: {
    id: string
    name_fa: string
    description_fa: string | null
    price: number
    original_price: number | null
    image_url: string | null
    brand: string | null
    stock: number
    categories?: { name_fa: string; slug: string } | null
  }
  featured?: boolean
}

export function ProductCard({ product, featured }: ProductCardProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [imageError, setImageError] = useState(false)

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const formatPrice = (price: number) => new Intl.NumberFormat("fa-IR").format(price)

  const imageUrl = product.image_url?.trim() || null

  return (
    <>
      <Card
        className={cn(
          "group overflow-hidden border-0 bg-card/50 backdrop-blur transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2",
          featured && "ring-2 ring-primary/20",
        )}
      >
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={product.name_fa}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              {imageError ? (
                <>
                  <ImageOff className="h-12 w-12 text-muted-foreground/40" />
                  <span className="text-xs text-muted-foreground/60">خطا در بارگذاری تصویر</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-16 w-16 text-muted-foreground/30" />
                  <span className="text-xs text-muted-foreground/60">بدون تصویر</span>
                </>
              )}
            </div>
          )}

          {discount > 0 && (
            <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-sm px-3 py-1 rounded-full animate-pulse">
              {discount}% تخفیف
            </Badge>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="secondary" className="text-base px-6 py-2">
                ناموجود
              </Badge>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <Button variant="secondary" size="sm" className="gap-2 rounded-full" onClick={() => setShowDialog(true)}>
              <Eye className="h-4 w-4" />
              مشاهده سریع
            </Button>
          </div>
        </div>

        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-lg leading-tight line-clamp-1">{product.name_fa}</h3>
              {product.brand && (
                <Badge variant="outline" className="shrink-0 text-xs rounded-full">
                  {product.brand}
                </Badge>
              )}
            </div>
            {product.categories && (
              <Badge variant="secondary" className="text-xs">
                {product.categories.name_fa}
              </Badge>
            )}
            {product.description_fa && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{product.description_fa}</p>
            )}
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="space-y-1">
              <span className="text-2xl font-black text-primary">{formatPrice(product.price)}</span>
              <span className="text-sm text-primary mr-1">تومان</span>
              {product.original_price && (
                <div className="text-sm line-through text-muted-foreground">{formatPrice(product.original_price)}</div>
              )}
            </div>
            <Button className="rounded-full px-6" onClick={() => setShowDialog(true)} disabled={product.stock === 0}>
              {product.stock === 0 ? "ناموجود" : "جزئیات"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{product.name_fa}</DialogTitle>
            <DialogDescription className="flex gap-2 mt-2">
              {product.brand && <Badge variant="outline">{product.brand}</Badge>}
              {product.categories && <Badge variant="secondary">{product.categories.name_fa}</Badge>}
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              {imageUrl && !imageError ? (
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={product.name_fa}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <ImageOff className="h-16 w-16 text-muted-foreground/40" />
                  <span className="text-sm text-muted-foreground/60">بدون تصویر</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {product.description_fa && (
                <p className="text-muted-foreground leading-relaxed">{product.description_fa}</p>
              )}

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-primary">{formatPrice(product.price)}</span>
                  <span className="text-primary">تومان</span>
                </div>
                {product.original_price && (
                  <div className="text-lg line-through text-muted-foreground">
                    {formatPrice(product.original_price)} تومان
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-600 dark:text-amber-400">درگاه پرداخت به زودی</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    درگاه پرداخت آنلاین به زودی اضافه خواهد شد. برای خرید با ما تماس بگیرید.
                  </p>
                </div>
              </div>

              <Button className="w-full h-12 text-lg rounded-xl" disabled>
                خرید آنلاین (به زودی)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
