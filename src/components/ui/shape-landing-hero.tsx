"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
  mouseX,
  mouseY,
  parallaxStrength = 1,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
  parallaxStrength?: number;
}) {
  const x = useTransform(mouseX, (val) => val * parallaxStrength * 0.015);
  const y = useTransform(mouseY, (val) => val * parallaxStrength * 0.015);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotate - 15 }}
      animate={{ opacity: 1, scale: 1, rotate: rotate }}
      transition={{
        duration: 2.4,
        delay: delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      style={{ x, y }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [rotate, rotate + 8, rotate],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className={cn(
          "rounded-full",
          "bg-gradient-to-r to-transparent",
          gradient,
          "backdrop-blur-[2px]",
          "border border-white/[0.06]",
          "shadow-[0_8px_32px_0_rgba(0,212,255,0.08)]"
        )}
      />
    </motion.div>
  );
}

function HeroGeometric({
  badge = "Design Collective",
  title1 = "Elevate Your Digital Vision",
  title2 = "Crafting Exceptional Websites",
  description = "Crafting exceptional digital experiences through innovative design and cutting-edge technology.",
  children,
}: {
  badge?: string;
  title1?: string;
  title2?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  const mouseXRaw = useMotionValue(0);
  const mouseYRaw = useMotionValue(0);
  
  const mouseX = useSpring(mouseXRaw, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(mouseYRaw, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseXRaw.set(e.clientX - centerX);
      mouseYRaw.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseXRaw, mouseYRaw]);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Gradient background matching brand */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03]" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] animate-pulse-soft" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/12 rounded-full blur-[180px] animate-pulse-soft" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: "4s" }} />

      {/* Elegant shapes with parallax - brand-matched cyan/teal theme */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.2}
          width={700}
          height={160}
          rotate={14}
          gradient="from-primary/[0.12]"
          className="left-[-15%] md:left-[-8%] top-[12%] md:top-[18%]"
          mouseX={mouseX}
          mouseY={mouseY}
          parallaxStrength={1.5}
        />
        
        <ElegantShape
          delay={0.4}
          width={600}
          height={140}
          rotate={-18}
          gradient="from-accent/[0.10]"
          className="right-[-10%] md:right-[-5%] top-[65%] md:top-[72%]"
          mouseX={mouseX}
          mouseY={mouseY}
          parallaxStrength={-1.2}
        />
        
        <ElegantShape
          delay={0.3}
          width={400}
          height={100}
          rotate={-10}
          gradient="from-primary/[0.08]"
          className="left-[8%] md:left-[12%] bottom-[8%] md:bottom-[12%]"
          mouseX={mouseX}
          mouseY={mouseY}
          parallaxStrength={0.8}
        />
        
        <ElegantShape
          delay={0.5}
          width={280}
          height={70}
          rotate={22}
          gradient="from-accent/[0.08]"
          className="right-[12%] md:right-[18%] top-[8%] md:top-[12%]"
          mouseX={mouseX}
          mouseY={mouseY}
          parallaxStrength={-2}
        />
        
        <ElegantShape
          delay={0.6}
          width={200}
          height={50}
          rotate={-28}
          gradient="from-primary/[0.06]"
          className="left-[25%] md:left-[30%] top-[3%] md:top-[6%]"
          mouseX={mouseX}
          mouseY={mouseY}
          parallaxStrength={2.5}
        />
        
        <ElegantShape
          delay={0.7}
          width={350}
          height={90}
          rotate={16}
          gradient="from-accent/[0.07]"
          className="right-[5%] top-[38%]"
          mouseX={mouseX}
          mouseY={mouseY}
          parallaxStrength={-1}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 md:px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-8 md:mb-12"
          >
            <Circle className="h-2 w-2 fill-primary text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground tracking-wide">
              {badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 md:mb-8">
              <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                {title1}
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                {title2}
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            {description}
          </motion.p>

          {/* Children (for buttons, etc.) */}
          {children && (
            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/50 to-transparent" />
    </div>
  );
}

export { HeroGeometric, ElegantShape };
