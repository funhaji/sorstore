"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Package,
  Settings,
  Plus,
  Trash2,
  Edit,
  LogOut,
  Lock,
  Upload,
  Sparkles,
  Eye,
  Save,
  ImageIcon,
  Loader2,
  FolderOpen,
  ImagePlus,
  Megaphone,
  AlertCircle,
  Database,
  Play,
  Terminal,
} from "lucide-react"
import { toast, Toaster } from "sonner"

interface Category {
  id: string
  name_fa: string
  slug: string
  icon: string | null
  sort_order: number
}

interface Product {
  id: string
  name_fa: string
  description_fa: string | null
  price: number
  original_price: number | null
  image_url: string | null
  category_id: string | null
  category: string | null
  brand: string | null
  stock: number
  featured: boolean
}

interface Slider {
  id: string
  title_fa: string
  subtitle_fa: string | null
  image_url: string | null
  link_url: string | null
  is_active: boolean
  sort_order: number
}

interface Banner {
  id: string
  title_fa: string
  image_url: string | null
  link_url: string | null
  position: string
  is_active: boolean
}

interface SiteSettings {
  id: string
  logo_url: string | null
  site_name: string | null
  hero_title: string | null
  hero_subtitle: string | null
  contact_email: string | null
  contact_phone: string | null
  address_fa: string | null
  instagram_url: string | null
  telegram_url: string | null
  whatsapp_url: string | null
  about_us_fa: string | null
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("products")
  const [dbError, setDbError] = useState<string | null>(null)

  // Data states
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [sliders, setSliders] = useState<Slider[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)

  // Dialog states
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [showSliderDialog, setShowSliderDialog] = useState(false)
  const [showBannerDialog, setShowBannerDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ type: string; id: string } | null>(null)

  // Edit states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  // Form states
  const [productForm, setProductForm] = useState({
    name_fa: "",
    description_fa: "",
    price: "",
    original_price: "",
    image_url: "",
    category_id: "",
    brand: "",
    stock: "0",
    featured: false,
  })
  const [categoryForm, setCategoryForm] = useState({ name_fa: "", slug: "", icon: "", sort_order: "0" })
  const [sliderForm, setSliderForm] = useState({
    title_fa: "",
    subtitle_fa: "",
    image_url: "",
    link_url: "",
    is_active: true,
    sort_order: "0",
  })
  const [bannerForm, setBannerForm] = useState({
    title_fa: "",
    image_url: "",
    link_url: "",
    position: "hero_side",
    is_active: true,
  })

  const [sqlQuery, setSqlQuery] = useState("")
  const [sqlResult, setSqlResult] = useState<{
    success?: boolean
    data?: unknown[]
    error?: string
    hint?: string
    message?: string
    rowCount?: number
  } | null>(null)
  const [sqlLoading, setSqlLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setDbError(null)

    try {
      // Fetch all data via API routes
      const [productsRes, categoriesRes, slidersRes, bannersRes, settingsRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/sliders"),
        fetch("/api/admin/banners"),
        fetch("/api/admin/settings"),
      ])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      const slidersData = await slidersRes.json()
      const bannersData = await bannersRes.json()
      const settingsData = await settingsRes.json()

      if (!productsRes.ok) {
        setDbError("خطا در دریافت محصولات: " + (productsData.error || "Unknown error"))
      } else {
        setProducts(productsData)
      }

      if (categoriesRes.ok && Array.isArray(categoriesData)) {
        setCategories(categoriesData)
      }

      if (slidersRes.ok && Array.isArray(slidersData)) {
        setSliders(slidersData)
      }

      if (bannersRes.ok && Array.isArray(bannersData)) {
        setBanners(bannersData)
      }

      if (settingsRes.ok && settingsData && !settingsData.error) {
        setSiteSettings(settingsData)
      }
    } catch (err) {
      console.error("[v0] Fetch error:", err)
      setDbError("خطا در ارتباط با سرور")
    }
  }, [])

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth")
    if (auth === "true") {
      setIsAuthenticated(true)
      fetchData()
    }
  }, [fetchData])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        sessionStorage.setItem("admin_auth", "true")
        setIsAuthenticated(true)
        fetchData()
        toast.success("ورود موفقیت‌آمیز")
      } else {
        toast.error("رمز عبور اشتباه است")
      }
    } catch {
      toast.error("خطا در ورود")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth")
    setIsAuthenticated(false)
    setPassword("")
  }

  // Image upload
  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Upload failed")
      const { url } = await res.json()
      callback(url)
      toast.success("تصویر آپلود شد")
    } catch {
      toast.error("خطا در آپلود تصویر")
    }
  }

  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setProductForm({
        name_fa: product.name_fa,
        description_fa: product.description_fa || "",
        price: product.price.toString(),
        original_price: product.original_price?.toString() || "",
        image_url: product.image_url || "",
        category_id: product.category_id || "",
        brand: product.brand || "",
        stock: product.stock.toString(),
        featured: product.featured,
      })
    } else {
      setEditingProduct(null)
      setProductForm({
        name_fa: "",
        description_fa: "",
        price: "",
        original_price: "",
        image_url: "",
        category_id: "",
        brand: "",
        stock: "0",
        featured: false,
      })
    }
    setShowProductDialog(true)
  }

  const handleSaveProduct = async () => {
    if (!productForm.name_fa || !productForm.price) {
      toast.error("نام و قیمت محصول الزامی است")
      return
    }

    setIsLoading(true)
    try {
      const data = {
        name_fa: productForm.name_fa,
        description_fa: productForm.description_fa || null,
        price: Number.parseFloat(productForm.price),
        original_price: productForm.original_price ? Number.parseFloat(productForm.original_price) : null,
        image_url: productForm.image_url || null,
        category_id: productForm.category_id || null,
        brand: productForm.brand || null,
        stock: Number.parseInt(productForm.stock) || 0,
        featured: productForm.featured,
      }

      let res: Response
      if (editingProduct) {
        res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProduct.id, ...data }),
        })
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      }

      const result = await res.json()

      if (!res.ok) {
        console.error("[v0] Product save error:", result.error)
        toast.error("خطا: " + result.error)
      } else {
        toast.success(editingProduct ? "محصول به‌روزرسانی شد" : "محصول اضافه شد")
        setShowProductDialog(false)
        fetchData()
      }
    } catch (err) {
      console.error("[v0] Product save exception:", err)
      toast.error("خطا در ذخیره محصول")
    } finally {
      setIsLoading(false)
    }
  }

  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setCategoryForm({
        name_fa: category.name_fa,
        slug: category.slug,
        icon: category.icon || "",
        sort_order: category.sort_order.toString(),
      })
    } else {
      setEditingCategory(null)
      setCategoryForm({ name_fa: "", slug: "", icon: "", sort_order: "0" })
    }
    setShowCategoryDialog(true)
  }

  const handleSaveCategory = async () => {
    if (!categoryForm.name_fa) {
      toast.error("نام دسته‌بندی الزامی است")
      return
    }

    setIsLoading(true)
    try {
      const data = {
        name_fa: categoryForm.name_fa,
        slug: categoryForm.slug || categoryForm.name_fa.toLowerCase().replace(/\s+/g, "-"),
        icon: categoryForm.icon || null,
        sort_order: Number.parseInt(categoryForm.sort_order) || 0,
      }

      let res: Response
      if (editingCategory) {
        res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCategory.id, ...data }),
        })
      } else {
        res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      }

      const result = await res.json()

      if (!res.ok) {
        console.error("[v0] Category save error:", result.error)
        toast.error("خطا: " + result.error)
      } else {
        toast.success(editingCategory ? "دسته‌بندی به‌روزرسانی شد" : "دسته‌بندی اضافه شد")
        setShowCategoryDialog(false)
        fetchData()
      }
    } catch (err) {
      console.error("[v0] Category save exception:", err)
      toast.error("خطا در ذخیره دسته‌بندی")
    } finally {
      setIsLoading(false)
    }
  }

  const openSliderDialog = (slider?: Slider) => {
    if (slider) {
      setEditingSlider(slider)
      setSliderForm({
        title_fa: slider.title_fa,
        subtitle_fa: slider.subtitle_fa || "",
        image_url: slider.image_url || "",
        link_url: slider.link_url || "",
        is_active: slider.is_active,
        sort_order: slider.sort_order.toString(),
      })
    } else {
      setEditingSlider(null)
      setSliderForm({ title_fa: "", subtitle_fa: "", image_url: "", link_url: "", is_active: true, sort_order: "0" })
    }
    setShowSliderDialog(true)
  }

  const handleSaveSlider = async () => {
    if (!sliderForm.title_fa) {
      toast.error("عنوان اسلایدر الزامی است")
      return
    }

    setIsLoading(true)
    try {
      const data = {
        title_fa: sliderForm.title_fa,
        subtitle_fa: sliderForm.subtitle_fa || null,
        image_url: sliderForm.image_url || null,
        link_url: sliderForm.link_url || null,
        is_active: sliderForm.is_active,
        sort_order: Number.parseInt(sliderForm.sort_order) || 0,
      }

      let res: Response
      if (editingSlider) {
        res = await fetch("/api/admin/sliders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingSlider.id, ...data }),
        })
      } else {
        res = await fetch("/api/admin/sliders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      }

      const result = await res.json()

      if (!res.ok) {
        console.error("[v0] Slider save error:", result.error)
        toast.error("خطا: " + result.error)
      } else {
        toast.success(editingSlider ? "اسلایدر به‌روزرسانی شد" : "اسلایدر اضافه شد")
        setShowSliderDialog(false)
        fetchData()
      }
    } catch (err) {
      console.error("[v0] Slider save exception:", err)
      toast.error("خطا در ذخیره اسلایدر")
    } finally {
      setIsLoading(false)
    }
  }

  const openBannerDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner)
      setBannerForm({
        title_fa: banner.title_fa,
        image_url: banner.image_url || "",
        link_url: banner.link_url || "",
        position: banner.position,
        is_active: banner.is_active,
      })
    } else {
      setEditingBanner(null)
      setBannerForm({ title_fa: "", image_url: "", link_url: "", position: "hero_side", is_active: true })
    }
    setShowBannerDialog(true)
  }

  const handleSaveBanner = async () => {
    if (!bannerForm.title_fa) {
      toast.error("عنوان بنر الزامی است")
      return
    }

    setIsLoading(true)
    try {
      const data = {
        title_fa: bannerForm.title_fa,
        image_url: bannerForm.image_url || null,
        link_url: bannerForm.link_url || null,
        position: bannerForm.position,
        is_active: bannerForm.is_active,
      }

      let res: Response
      if (editingBanner) {
        res = await fetch("/api/admin/banners", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingBanner.id, ...data }),
        })
      } else {
        res = await fetch("/api/admin/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      }

      const result = await res.json()

      if (!res.ok) {
        console.error("[v0] Banner save error:", result.error)
        toast.error("خطا: " + result.error)
      } else {
        toast.success(editingBanner ? "بنر به‌روزرسانی شد" : "بنر اضافه شد")
        setShowBannerDialog(false)
        fetchData()
      }
    } catch (err) {
      console.error("[v0] Banner save exception:", err)
      toast.error("خطا در ذخیره بنر")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/${deleteDialog.type}?id=${deleteDialog.id}`, {
        method: "DELETE",
      })
      const result = await res.json()

      if (!res.ok) {
        console.error("[v0] Delete error:", result.error)
        toast.error("خطا: " + result.error)
      } else {
        toast.success("حذف شد")
        setDeleteDialog(null)
        fetchData()
      }
    } catch (err) {
      console.error("[v0] Delete exception:", err)
      toast.error("خطا در حذف")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!siteSettings) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteSettings),
      })
      const result = await res.json()

      if (!res.ok) {
        console.error("[v0] Settings save error:", result.error)
        toast.error("خطا: " + result.error)
      } else {
        toast.success("تنظیمات ذخیره شد")
      }
    } catch (err) {
      console.error("[v0] Settings save exception:", err)
      toast.error("خطا در ذخیره تنظیمات")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExecuteSQL = async () => {
    if (!sqlQuery.trim()) {
      toast.error("کوئری SQL را وارد کنید")
      return
    }

    setSqlLoading(true)
    setSqlResult(null)

    try {
      const res = await fetch("/api/admin/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sqlQuery }),
      })

      const result = await res.json()
      setSqlResult(result)

      if (result.success) {
        toast.success(result.message || "کوئری اجرا شد")
      } else {
        toast.error(result.error || "خطا در اجرای کوئری")
      }
    } catch (err) {
      console.error("[v0] SQL execution error:", err)
      setSqlResult({
        success: false,
        error: "خطا در ارتباط با سرور",
      })
      toast.error("خطا در ارتباط با سرور")
    } finally {
      setSqlLoading(false)
    }
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
        <Toaster richColors position="top-center" />
        <div className="absolute top-4 left-4">
          <ThemeToggle />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <Card className="w-full max-w-md relative z-10 border-0 shadow-2xl bg-card/80 backdrop-blur">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-black">پنل مدیریت سُر استور</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 text-center text-lg tracking-widest"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "ورود"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Toaster richColors position="top-center" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <span className="text-xl font-bold">پنل مدیریت</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <a href="/" target="_blank" rel="noreferrer">
                <Eye className="h-4 w-4" />
                مشاهده سایت
              </a>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Database Error Alert */}
      {dbError && (
        <div className="container px-4 pt-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">خطای پایگاه داده</p>
              <p className="text-sm text-muted-foreground">{dbError}</p>
              <p className="text-sm text-muted-foreground mt-2">
                فایل <code className="bg-muted px-1 rounded">scripts/002_add_missing_tables.sql</code> را در SQL Editor
                سوپابیس اجرا کنید.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 lg:w-fit gap-1">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">محصولات</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">دسته‌بندی</span>
            </TabsTrigger>
            <TabsTrigger value="sliders" className="gap-2">
              <ImagePlus className="h-4 w-4" />
              <span className="hidden sm:inline">اسلایدر</span>
            </TabsTrigger>
            <TabsTrigger value="banners" className="gap-2">
              <Megaphone className="h-4 w-4" />
              <span className="hidden sm:inline">بنرها</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">تنظیمات</span>
            </TabsTrigger>
            <TabsTrigger value="sql" className="gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">SQL</span>
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">محصولات</h2>
              <Button onClick={() => openProductDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                افزودن محصول
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden group">
                  <div className="aspect-square relative bg-muted">
                    {product.image_url ? (
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name_fa}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {product.featured && <Badge className="absolute top-2 right-2">ویژه</Badge>}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{product.name_fa}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-primary">{product.price.toLocaleString()} تومان</span>
                      <span className="text-sm text-muted-foreground">موجودی: {product.stock}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1 bg-transparent"
                        onClick={() => openProductDialog(product)}
                      >
                        <Edit className="h-3 w-3" />
                        ویرایش
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={() => setDeleteDialog({ type: "products", id: product.id })}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {products.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>هنوز محصولی اضافه نشده</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">دسته‌بندی‌ها</h2>
              <Button onClick={() => openCategoryDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                افزودن دسته‌بندی
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{category.name_fa}</h3>
                        <p className="text-sm text-muted-foreground">{category.slug}</p>
                      </div>
                      <Badge variant="outline">ترتیب: {category.sort_order}</Badge>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1 bg-transparent"
                        onClick={() => openCategoryDialog(category)}
                      >
                        <Edit className="h-3 w-3" />
                        ویرایش
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={() => setDeleteDialog({ type: "categories", id: category.id })}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {categories.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>هنوز دسته‌بندی اضافه نشده</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Sliders Tab */}
          <TabsContent value="sliders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">اسلایدرها</h2>
              <Button onClick={() => openSliderDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                افزودن اسلایدر
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {sliders.map((slider) => (
                <Card key={slider.id} className="overflow-hidden">
                  <div className="aspect-[21/9] relative bg-muted">
                    {slider.image_url ? (
                      <img
                        src={slider.image_url || "/placeholder.svg"}
                        alt={slider.title_fa}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2" variant={slider.is_active ? "default" : "secondary"}>
                      {slider.is_active ? "فعال" : "غیرفعال"}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{slider.title_fa}</h3>
                    {slider.subtitle_fa && <p className="text-sm text-muted-foreground">{slider.subtitle_fa}</p>}
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1 bg-transparent"
                        onClick={() => openSliderDialog(slider)}
                      >
                        <Edit className="h-3 w-3" />
                        ویرایش
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={() => setDeleteDialog({ type: "sliders", id: slider.id })}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sliders.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <ImagePlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>هنوز اسلایدری اضافه نشده</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Banners Tab */}
          <TabsContent value="banners" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">بنرها</h2>
              <Button onClick={() => openBannerDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                افزودن بنر
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner) => (
                <Card key={banner.id} className="overflow-hidden">
                  <div className="aspect-video relative bg-muted">
                    {banner.image_url ? (
                      <img
                        src={banner.image_url || "/placeholder.svg"}
                        alt={banner.title_fa}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2" variant={banner.is_active ? "default" : "secondary"}>
                      {banner.is_active ? "فعال" : "غیرفعال"}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{banner.title_fa}</h3>
                    <p className="text-sm text-muted-foreground">موقعیت: {banner.position}</p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1 bg-transparent"
                        onClick={() => openBannerDialog(banner)}
                      >
                        <Edit className="h-3 w-3" />
                        ویرایش
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={() => setDeleteDialog({ type: "banners", id: banner.id })}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {banners.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>هنوز بنری اضافه نشده</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">تنظیمات سایت</h2>
              <Button onClick={handleSaveSettings} disabled={isLoading} className="gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                ذخیره تنظیمات
              </Button>
            </div>

            {siteSettings && (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>اطلاعات کلی</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>نام سایت</Label>
                      <Input
                        value={siteSettings.site_name || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>عنوان هیرو</Label>
                      <Input
                        value={siteSettings.hero_title || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, hero_title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>زیرعنوان هیرو</Label>
                      <Input
                        value={siteSettings.hero_subtitle || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, hero_subtitle: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>لوگو URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={siteSettings.logo_url || ""}
                          onChange={(e) => setSiteSettings({ ...siteSettings, logo_url: e.target.value })}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const input = document.createElement("input")
                            input.type = "file"
                            input.accept = "image/*"
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0]
                              if (file)
                                handleImageUpload(file, (url) => setSiteSettings({ ...siteSettings, logo_url: url }))
                            }
                            input.click()
                          }}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>اطلاعات تماس</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>ایمیل</Label>
                      <Input
                        type="email"
                        value={siteSettings.contact_email || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>تلفن</Label>
                      <Input
                        value={siteSettings.contact_phone || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, contact_phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>آدرس</Label>
                      <Textarea
                        value={siteSettings.address_fa || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, address_fa: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>شبکه‌های اجتماعی</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>اینستاگرام</Label>
                      <Input
                        value={siteSettings.instagram_url || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, instagram_url: e.target.value })}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>تلگرام</Label>
                      <Input
                        value={siteSettings.telegram_url || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, telegram_url: e.target.value })}
                        placeholder="https://t.me/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>واتساپ</Label>
                      <Input
                        value={siteSettings.whatsapp_url || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp_url: e.target.value })}
                        placeholder="https://wa.me/..."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>درباره ما</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={siteSettings.about_us_fa || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, about_us_fa: e.target.value })}
                      rows={6}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {!siteSettings && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>تنظیمات بارگذاری نشده</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sql" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">SQL Editor</h2>
              <Button onClick={handleExecuteSQL} disabled={sqlLoading} className="gap-2">
                {sqlLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                اجرای کوئری
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  کوئری SQL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  placeholder="SELECT * FROM products;"
                  className="font-mono text-sm min-h-[200px] resize-y"
                  dir="ltr"
                />
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => setSqlQuery("SELECT * FROM products;")}>
                    محصولات
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSqlQuery("SELECT * FROM categories;")}>
                    دسته‌بندی‌ها
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSqlQuery("SELECT * FROM sliders;")}>
                    اسلایدرها
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSqlQuery("SELECT * FROM banners;")}>
                    بنرها
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSqlQuery("SELECT * FROM site_settings;")}>
                    تنظیمات
                  </Button>
                </div>
              </CardContent>
            </Card>

            {sqlResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {sqlResult.success ? (
                      <Badge variant="default">موفق</Badge>
                    ) : (
                      <Badge variant="destructive">خطا</Badge>
                    )}
                    نتیجه کوئری
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sqlResult.success && sqlResult.data && Array.isArray(sqlResult.data) ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{sqlResult.rowCount} ردیف برگردانده شد</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse" dir="ltr">
                          <thead>
                            <tr className="border-b">
                              {sqlResult.data.length > 0 &&
                                Object.keys(sqlResult.data[0] as Record<string, unknown>).map((key) => (
                                  <th key={key} className="text-left p-2 font-semibold bg-muted">
                                    {key}
                                  </th>
                                ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sqlResult.data.map((row, i) => (
                              <tr key={i} className="border-b hover:bg-muted/50">
                                {Object.values(row as Record<string, unknown>).map((value, j) => (
                                  <td key={j} className="p-2 max-w-xs truncate">
                                    {value === null ? (
                                      <span className="text-muted-foreground italic">null</span>
                                    ) : typeof value === "boolean" ? (
                                      value ? (
                                        "true"
                                      ) : (
                                        "false"
                                      )
                                    ) : (
                                      String(value)
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sqlResult.error && <p className="text-destructive font-mono text-sm">{sqlResult.error}</p>}
                      {sqlResult.hint && <p className="text-muted-foreground text-sm">{sqlResult.hint}</p>}
                      {sqlResult.message && <p className="text-muted-foreground text-sm">{sqlResult.message}</p>}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "ویرایش محصول" : "افزودن محصول"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نام محصول *</Label>
                <Input
                  value={productForm.name_fa}
                  onChange={(e) => setProductForm({ ...productForm, name_fa: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>برند</Label>
                <Input
                  value={productForm.brand}
                  onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>توضیحات</Label>
              <Textarea
                value={productForm.description_fa}
                onChange={(e) => setProductForm({ ...productForm, description_fa: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>قیمت (تومان) *</Label>
                <Input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>قیمت اصلی</Label>
                <Input
                  type="number"
                  value={productForm.original_price}
                  onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>موجودی</Label>
                <Input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>دسته‌بندی</Label>
                <Select
                  value={productForm.category_id}
                  onValueChange={(value) => setProductForm({ ...productForm, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب دسته‌بندی" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name_fa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>محصول ویژه</Label>
                <div className="flex items-center h-10">
                  <Switch
                    checked={productForm.featured}
                    onCheckedChange={(checked) => setProductForm({ ...productForm, featured: checked })}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>تصویر</Label>
              <div className="flex gap-2">
                <Input
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="URL تصویر"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = "image/*"
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleImageUpload(file, (url) => setProductForm({ ...productForm, image_url: url }))
                    }
                    input.click()
                  }}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {productForm.image_url && (
                <img
                  src={productForm.image_url || "/placeholder.svg"}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg mt-2"
                />
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowProductDialog(false)}>
              انصراف
            </Button>
            <Button onClick={handleSaveProduct} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "ذخیره"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>نام دسته‌بندی *</Label>
              <Input
                value={categoryForm.name_fa}
                onChange={(e) => setCategoryForm({ ...categoryForm, name_fa: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>اسلاگ (انگلیسی)</Label>
              <Input
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                placeholder="electronics"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>آیکون (emoji)</Label>
              <Input
                value={categoryForm.icon}
                onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                placeholder="📱"
              />
            </div>
            <div className="space-y-2">
              <Label>ترتیب نمایش</Label>
              <Input
                type="number"
                value={categoryForm.sort_order}
                onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              انصراف
            </Button>
            <Button onClick={handleSaveCategory} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "ذخیره"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Slider Dialog */}
      <Dialog open={showSliderDialog} onOpenChange={setShowSliderDialog}>
        <DialogContent className="max-w-xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingSlider ? "ویرایش اسلایدر" : "افزودن اسلایدر"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>عنوان *</Label>
              <Input
                value={sliderForm.title_fa}
                onChange={(e) => setSliderForm({ ...sliderForm, title_fa: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>زیرعنوان</Label>
              <Input
                value={sliderForm.subtitle_fa}
                onChange={(e) => setSliderForm({ ...sliderForm, subtitle_fa: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>تصویر</Label>
              <div className="flex gap-2">
                <Input
                  value={sliderForm.image_url}
                  onChange={(e) => setSliderForm({ ...sliderForm, image_url: e.target.value })}
                  placeholder="URL تصویر"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = "image/*"
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleImageUpload(file, (url) => setSliderForm({ ...sliderForm, image_url: url }))
                    }
                    input.click()
                  }}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>لینک</Label>
              <Input
                value={sliderForm.link_url}
                onChange={(e) => setSliderForm({ ...sliderForm, link_url: e.target.value })}
                placeholder="/products"
                dir="ltr"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ترتیب</Label>
                <Input
                  type="number"
                  value={sliderForm.sort_order}
                  onChange={(e) => setSliderForm({ ...sliderForm, sort_order: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>وضعیت</Label>
                <div className="flex items-center h-10 gap-2">
                  <Switch
                    checked={sliderForm.is_active}
                    onCheckedChange={(checked) => setSliderForm({ ...sliderForm, is_active: checked })}
                  />
                  <span className="text-sm">{sliderForm.is_active ? "فعال" : "غیرفعال"}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSliderDialog(false)}>
              انصراف
            </Button>
            <Button onClick={handleSaveSlider} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "ذخیره"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Banner Dialog */}
      <Dialog open={showBannerDialog} onOpenChange={setShowBannerDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "ویرایش بنر" : "افزودن بنر"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>عنوان *</Label>
              <Input
                value={bannerForm.title_fa}
                onChange={(e) => setBannerForm({ ...bannerForm, title_fa: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>تصویر</Label>
              <div className="flex gap-2">
                <Input
                  value={bannerForm.image_url}
                  onChange={(e) => setBannerForm({ ...bannerForm, image_url: e.target.value })}
                  placeholder="URL تصویر"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = "image/*"
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleImageUpload(file, (url) => setBannerForm({ ...bannerForm, image_url: url }))
                    }
                    input.click()
                  }}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>لینک</Label>
              <Input
                value={bannerForm.link_url}
                onChange={(e) => setBannerForm({ ...bannerForm, link_url: e.target.value })}
                placeholder="/sale"
                dir="ltr"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>موقعیت</Label>
                <Select
                  value={bannerForm.position}
                  onValueChange={(value) => setBannerForm({ ...bannerForm, position: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero_side">کنار هیرو</SelectItem>
                    <SelectItem value="category_top">بالای دسته‌بندی</SelectItem>
                    <SelectItem value="footer_top">بالای فوتر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>وضعیت</Label>
                <div className="flex items-center h-10 gap-2">
                  <Switch
                    checked={bannerForm.is_active}
                    onCheckedChange={(checked) => setBannerForm({ ...bannerForm, is_active: checked })}
                  />
                  <span className="text-sm">{bannerForm.is_active ? "فعال" : "غیرفعال"}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowBannerDialog(false)}>
              انصراف
            </Button>
            <Button onClick={handleSaveBanner} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "ذخیره"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تایید حذف</DialogTitle>
          </DialogHeader>
          <p className="py-4">آیا از حذف این مورد اطمینان دارید؟ این عملیات قابل بازگشت نیست.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              انصراف
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
