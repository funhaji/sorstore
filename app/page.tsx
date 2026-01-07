import { createClient } from "@/lib/supabase/server"
import { StoreHeader } from "@/components/store/store-header"
import { HeroSection } from "@/components/store/hero-section"
import { ProductGrid } from "@/components/store/product-grid"
import { StoreFooter } from "@/components/store/store-footer"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: products }, { data: categories }, { data: sliders }, { data: banners }, { data: siteSettings }] =
    await Promise.all([
      supabase.from("products").select("*, categories(name_fa, slug)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("sliders").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("banners").select("*").eq("is_active", true),
      supabase.from("site_settings").select("*").single(),
    ])

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreHeader siteSettings={siteSettings} categories={categories || []} />
      <main className="flex-1">
        <HeroSection sliders={sliders || []} banners={banners || []} />
        <ProductGrid products={products || []} categories={categories || []} />
      </main>
      <StoreFooter siteSettings={siteSettings} />
    </div>
  )
}
