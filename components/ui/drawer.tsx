"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DrawerContext = React.createContext<DrawerContextType | undefined>(undefined);

function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("Drawer components must be used within a Drawer");
  }
  return context;
}

interface DrawerProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Drawer({ children, open = false, onOpenChange }: DrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(open);

  const isControlled = onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <DrawerContext.Provider value={{ open: isOpen, onOpenChange: setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

interface DrawerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const { onOpenChange } = useDrawer();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onOpenChange(true);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={cn(className)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DrawerTrigger.displayName = "DrawerTrigger";

interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right";
}

export const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, children, side = "left", ...props }, ref) => {
    const { open, onOpenChange } = useDrawer();
    const [mounted, setMounted] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(false);

    // open이 true가 되면 먼저 isVisible을 true로 설정 (닫힌 상태로 렌더링)
    React.useEffect(() => {
      if (open) {
        setIsVisible(true);
        // 약간의 지연 후 mounted를 true로 설정하여 애니메이션 시작
        const timer = setTimeout(() => {
          setMounted(true);
        }, 10);
        return () => clearTimeout(timer);
      } else {
        setMounted(false);
        // 애니메이션 완료 후 isVisible을 false로 설정
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [open]);

    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 bg-black/50 transition-opacity duration-300 ease-out",
            mounted ? "opacity-100" : "opacity-0"
          )}
          onClick={() => onOpenChange(false)}
        />

        {/* Drawer Panel */}
        <div
          ref={ref}
          className={cn(
            "fixed top-0 h-full bg-white shadow-xl transition-transform duration-300 ease-out",
            side === "left"
              ? mounted ? "left-0 translate-x-0" : "left-0 -translate-x-full"
              : mounted ? "right-0 translate-x-0" : "right-0 translate-x-full",
            className
          )}
          {...props}
        >
          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          {children}
        </div>
      </div>
    );
  }
);
DrawerContent.displayName = "DrawerContent";
