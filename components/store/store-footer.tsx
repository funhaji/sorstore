import Link from "next/link"
import { Instagram, Send, Phone, Mail, MapPin, Sparkles } from "lucide-react"

interface StoreFooterProps {
  siteSettings: {
    site_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address_fa?: string | null
    instagram_url?: string | null
    telegram_url?: string | null
    whatsapp_url?: string | null
    about_us_fa?: string | null
  } | null
}

export function StoreFooter({ siteSettings }: StoreFooterProps) {
  return (
    <footer className="relative border-t bg-card/30 backdrop-blur" id="contact">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-black">{siteSettings?.site_name || "Sor Store"}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteSettings?.about_us_fa || "فروشگاه سُر با هدف ارائه بهترین گوشی‌های هوشمند با قیمت مناسب فعالیت می‌کند."}
            </p>

            {/* Social Media */}
            <div className="flex gap-2">
              {siteSettings?.instagram_url && (
                <Link
                  href={siteSettings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              )}
              {siteSettings?.telegram_url && (
                <Link
                  href={siteSettings.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Send className="h-5 w-5" />
                </Link>
              )}
              {siteSettings?.whatsapp_url && (
                <Link
                  href={`https://wa.me/${siteSettings.whatsapp_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Phone className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6" id="about">
            <h3 className="text-lg font-bold">دسترسی سریع</h3>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/", label: "خانه" },
                { href: "/#products", label: "محصولات" },
                { href: "/#about", label: "درباره ما" },
                { href: "/#contact", label: "تماس با ما" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">تماس با ما</h3>
            <div className="flex flex-col gap-4">
              {siteSettings?.contact_email && (
                <a
                  href={`mailto:${siteSettings.contact_email}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5 shrink-0" />
                  <span dir="ltr">{siteSettings.contact_email}</span>
                </a>
              )}
              {siteSettings?.contact_phone && (
                <a
                  href={`tel:${siteSettings.contact_phone}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-5 w-5 shrink-0" />
                  <span dir="ltr">{siteSettings.contact_phone}</span>
                </a>
              )}
              {siteSettings?.address_fa && (
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{siteSettings.address_fa}</span>
                </div>
              )}
            </div>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">پشتیبانی</h3>
            <div className="rounded-2xl bg-muted/50 p-6 space-y-3">
              <p className="text-sm text-muted-foreground">سوالی دارید؟ با ما در تماس باشید</p>
              <p className="text-2xl font-bold text-primary" dir="ltr">
                {siteSettings?.contact_phone || "۰۲۱-۱۲۳۴۵۶۷۸"}
              </p>
              <p className="text-xs text-muted-foreground">۲۴ ساعته، ۷ روز هفته</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteSettings?.site_name || "Sor Store"}. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  )
}
