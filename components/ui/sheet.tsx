"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { translateMessage } from "@/lib/i18n-utils"

const Sheet = DialogPrimitive.Root

const SheetTrigger = DialogPrimitive.Trigger

const SheetClose = DialogPrimitive.Close

const SheetPortal = DialogPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={`fixed z-[70] bg-black/60 backdrop-blur-sm ${className || ""}`}
    style={{
      top: 'var(--admin-sheet-top, 0px)',
      bottom: 0,
      left: 'var(--admin-sheet-left, 0px)',
      right: 'var(--admin-sheet-right, 0px)',
    }}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: "top" | "bottom" | "left" | "right" | "start" | "end"
    dir?: "ltr" | "rtl"
  }
>(({ side = "bottom", className, children, dir = "rtl", ...props }, ref) => {
  const isRTL = dir === "rtl"
  
  // Resolve logical start/end to physical left/right for Framer Motion x coordinate mapping
  let resolvedPhysicalSide: "top" | "bottom" | "left" | "right" = "bottom"
  if (side === "start") {
    resolvedPhysicalSide = isRTL ? "right" : "left"
  } else if (side === "end") {
    resolvedPhysicalSide = isRTL ? "left" : "right"
  } else {
    resolvedPhysicalSide = side as "top" | "bottom" | "left" | "right"
  }

  // Animation variants using Framer Motion
  const variants: Variants = {
    hidden: {
      x: resolvedPhysicalSide === "left" ? "-100%" : resolvedPhysicalSide === "right" ? "100%" : 0,
      y: resolvedPhysicalSide === "top" ? "-100%" : resolvedPhysicalSide === "bottom" ? "100%" : 0,
    },
    visible: {
      x: 0,
      y: 0,
      transition: { type: "spring" as const, damping: 25, stiffness: 220 }
    },
    exit: {
      x: resolvedPhysicalSide === "left" ? "-100%" : resolvedPhysicalSide === "right" ? "100%" : 0,
      y: resolvedPhysicalSide === "top" ? "-100%" : resolvedPhysicalSide === "bottom" ? "100%" : 0,
      transition: { ease: "easeInOut", duration: 0.25 }
    }
  }

  const baseStyles = "fixed z-[70] gap-4 bg-[var(--surface)] text-[var(--text)] border-[var(--border)] p-6 shadow-2xl outline-none"
  
  // Resolve start/end styles using logical properties
  const getSideClass = (sideVal: string) => {
    if (sideVal === "top") return "border-b rounded-b-3xl"
    if (sideVal === "bottom") return "border-t rounded-t-3xl max-h-[90vh] overflow-y-auto no-scrollbar"
    
    // Resolve start vs end styling
    const isStartSide = sideVal === "start" || (isRTL ? sideVal === "right" : sideVal === "left")
    
    if (isStartSide) {
      return "h-auto w-3/4 max-w-[340px] border-e rounded-e-3xl"
    } else {
      return "h-auto w-3/4 max-w-[340px] border-s rounded-s-3xl"
    }
  }

  const getSideStyle = (sideVal: string): React.CSSProperties => {
    if (sideVal === "top") {
      return {
        top: 'var(--admin-sheet-top, 0px)',
        left: 'var(--admin-sheet-left, 0px)',
        right: 'var(--admin-sheet-right, 0px)',
      }
    }

    if (sideVal === "bottom") {
      return {
        bottom: 0,
        left: 'var(--admin-sheet-left, 0px)',
        right: 'var(--admin-sheet-right, 0px)',
      }
    }

    const isStartSide = sideVal === "start" || (isRTL ? sideVal === "right" : sideVal === "left")
    return {
      top: 'var(--admin-sheet-top, 0px)',
      bottom: 0,
      ...(isStartSide
        ? { left: 'var(--admin-sheet-left, 0px)' }
        : { right: 'var(--admin-sheet-right, 0px)' }),
    }
  }

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        asChild
        {...props}
      >
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`${baseStyles} ${getSideClass(side)} ${className}`}
          style={getSideStyle(side)}
        >
          {children}
          <DialogPrimitive.Close className="absolute end-4 top-4 rounded-full p-1.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]">
            <X className="h-4 w-4" />
            <span className="sr-only">{translateMessage('Close')}</span>
          </DialogPrimitive.Close>
        </motion.div>
      </DialogPrimitive.Content>
    </SheetPortal>
  )
})
SheetContent.displayName = DialogPrimitive.Content.displayName

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={`text-lg font-semibold text-[var(--text)] ${className}`}
    {...props}
  />
))
SheetTitle.displayName = DialogPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={`text-sm text-[var(--text-muted)] ${className}`}
    {...props}
  />
))
SheetDescription.displayName = DialogPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetDescription,
}
