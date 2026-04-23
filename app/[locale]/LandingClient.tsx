"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { LandingMap } from "./LandingMap";
import { MapPin, ShieldCheck, Activity, ArrowRight, ArrowLeft, Star, Zap, Clock } from "lucide-react";
import { useRef } from "react";

export function LandingClient() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isRtl = locale === "ar";
  
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Animation variants — typed to satisfy framer-motion
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 70, damping: 15 } 
    },
  };

  const scaleUp: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { 
      opacity: 1, 
      scale: 1, 
      transition: { type: "spring" as const, stiffness: 100, damping: 20 } 
    },
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-white overflow-hidden flex flex-col font-sans selection:bg-nile-green/20">
      {/* Dynamic Background — richer, deeper gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-nile-green-200 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-navy-200 blur-[100px]"
        />
        {/* Third accent glow for depth */}
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-[10%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-warning/20 blur-[100px]"
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring" as const, stiffness: 80, damping: 20 }}
        className="sticky top-0 z-50 w-full border-b border-navy-900/5 bg-white/70 backdrop-blur-xl shadow-sm"
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-nile-green-500 to-nile-green-700 text-white shadow-lg shadow-nile-green-500/25 group-hover:shadow-nile-green-500/40 transition-all duration-300 group-hover:scale-105">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="font-bold text-navy-900 text-2xl font-rubik tracking-tight">
              {tc("appName")}
            </span>
          </Link>
          <LanguageToggle />
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-32 sm:pb-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          <motion.div 
            style={{ y, opacity }}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-start"
          >
            {/* Location badge — crisp green */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full bg-nile-green-50 border border-nile-green-200 shadow-sm px-4 py-2 text-sm text-nile-green-700 font-semibold mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nile-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-nile-green-500"></span>
              </span>
              أسوان، مصر · Aswan, Egypt
            </motion.div>

            {/* Headline — strong navy + vivid green gradient */}
            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-7xl font-bold text-navy-900 leading-[1.1] mb-6 font-rubik">
              {t("heroTitle")}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-nile-green-600 to-nile-green-400 mt-2">
                Smart City Platform
              </span>
            </motion.h1>

            {/* Subtitle — full contrast, no opacity fade */}
            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-navy-700 max-w-2xl leading-relaxed mb-10">
              {t("heroSubtitle")}
            </motion.p>

            {/* CTA buttons — deeper shadows, more contrast */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" asChild className="h-14 px-8 text-lg rounded-2xl bg-nile-green-600 hover:bg-nile-green-700 text-white shadow-lg shadow-nile-green-600/30 hover:shadow-nile-green-700/40 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto group">
                <Link href={`/${locale}/signup`}>
                  {t("cta")}
                  <ArrowIcon className={`w-5 h-5 ${isRtl ? 'mr-2' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg rounded-2xl bg-white border-navy-200 text-navy-800 hover:bg-navy-50 hover:border-navy-300 w-full sm:w-auto hover:-translate-y-1 transition-all duration-300 font-semibold">
                <Link href={`/${locale}/login`}>{t("staffLogin")}</Link>
              </Button>
            </motion.div>

            {/* Trust indicators — solid colors */}
            <motion.div variants={fadeInUp} className="mt-8 flex items-center gap-4 text-sm text-navy-600 font-medium">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-nile-green-100 flex items-center justify-center shadow-sm z-10 relative">
                     <Star className="w-3 h-3 text-nile-green-600 fill-nile-green-600" />
                  </div>
                ))}
              </div>
              <p>Trusted by citizens & staff</p>
            </motion.div>
          </motion.div>

          {/* Map preview — stronger glow */}
          <motion.div 
            variants={scaleUp}
            initial="hidden"
            animate="show"
            className="flex-1 w-full max-w-lg lg:max-w-none relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-nile-green-300/30 to-navy-300/20 rounded-3xl blur-2xl opacity-60"></div>
            <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden border border-navy-100 shadow-2xl shadow-navy-900/10 bg-white p-2">
              <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md shadow-md border border-navy-100 rounded-xl px-3 py-2 text-xs font-semibold text-navy-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-warning" />
                Live Feed
              </div>
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <LandingMap />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Feature pillars — stronger backgrounds and text */}
        <section className="relative z-20 bg-gradient-to-b from-white to-sky-white border-t border-navy-100">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {[
                { 
                  title: "Fast Reporting", 
                  desc: t("pitch1"), 
                  icon: Zap, 
                  gradBg: "from-blue-500/10 to-cyan-500/10",
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-600",
                  borderHover: "hover:border-blue-300"
                },
                { 
                  title: "Assured Resolution", 
                  desc: t("pitch2"), 
                  icon: ShieldCheck, 
                  gradBg: "from-nile-green-500/10 to-emerald-500/10",
                  iconBg: "bg-nile-green-100",
                  iconColor: "text-nile-green-700",
                  borderHover: "hover:border-nile-green-300"
                }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeInUp} 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`group relative rounded-3xl bg-white border border-navy-100 shadow-lg shadow-navy-900/5 p-8 overflow-hidden transition-all duration-300 hover:shadow-xl ${feature.borderHover}`}
                >
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${feature.gradBg} rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-navy-900 mb-3">{feature.title}</h3>
                    <p className="text-lg text-navy-700 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto"
            >
              {[
                { value: "4", label: "Districts", icon: MapPin },
                { value: "30+", label: "Reports", icon: Activity },
                { value: "24/7", label: "Monitoring", icon: Clock },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-xl bg-nile-green-50 group-hover:bg-nile-green-100 transition-colors">
                    <stat.icon className="w-5 h-5 text-nile-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-navy-900">{stat.value}</div>
                  <div className="text-sm font-medium text-navy-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Demo link */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 text-center"
            >
              <Link
                href={`/${locale}/demo`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy-50 text-navy-800 hover:bg-navy-100 font-semibold transition-colors group border border-navy-100"
              >
                {t("demo")}
                <ArrowIcon className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-navy-800 bg-navy-900 text-white py-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nile-green-900/20 to-transparent"></div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-nile-green-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-wide">{tc("appName")}</span>
          </div>
          <div className="text-sm font-medium text-white/70">
            © {new Date().getFullYear()} Aswan Governorate Digital Services
          </div>
        </div>
      </footer>
    </div>
  );
}
