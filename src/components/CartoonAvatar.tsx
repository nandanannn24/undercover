"use client";

import React from "react";
import Image from "next/image";
import {
  Search,
  Shield,
  Ghost,
  Eye,
  Zap,
  Compass,
  Star,
  Crown,
  Sparkles,
} from "lucide-react";

export interface AvatarOption {
  id: string;
  label: string;
  image?: string;
  bgGradient: string;
  borderColor: string;
  iconColor: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: "detective",
    label: "Detektif",
    image: "/characters/civilian.png",
    bgGradient: "from-amber-500/20 to-amber-900/40",
    borderColor: "#d4af37",
    iconColor: "text-amber-400",
  },
  {
    id: "undercover",
    label: "Penyusup",
    image: "/characters/undercover.png",
    bgGradient: "from-rose-500/20 to-rose-950/40",
    borderColor: "#f43f5e",
    iconColor: "text-rose-400",
  },
  {
    id: "ghost",
    label: "Mr. White",
    image: "/characters/mr_white.png",
    bgGradient: "from-purple-500/20 to-indigo-950/40",
    borderColor: "#c084fc",
    iconColor: "text-purple-300",
  },
  {
    id: "ninja",
    label: "Ninja",
    bgGradient: "from-indigo-500/20 to-indigo-950/40",
    borderColor: "#818cf8",
    iconColor: "text-indigo-400",
  },
  {
    id: "agent",
    label: "Agen",
    bgGradient: "from-emerald-500/20 to-emerald-950/40",
    borderColor: "#34d399",
    iconColor: "text-emerald-400",
  },
  {
    id: "crown",
    label: "Raja",
    bgGradient: "from-yellow-500/20 to-yellow-950/40",
    borderColor: "#eab308",
    iconColor: "text-yellow-400",
  },
  {
    id: "compass",
    label: "Penjelajah",
    bgGradient: "from-cyan-500/20 to-cyan-950/40",
    borderColor: "#38bdf8",
    iconColor: "text-cyan-400",
  },
  {
    id: "shield",
    label: "Penjaga",
    bgGradient: "from-blue-500/20 to-blue-950/40",
    borderColor: "#60a5fa",
    iconColor: "text-blue-400",
  },
];

interface CartoonAvatarProps {
  id: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showCharacterArt?: boolean;
}

export function CartoonAvatar({
  id,
  size = "md",
  className = "",
  showCharacterArt = true,
}: CartoonAvatarProps) {
  const option =
    AVATAR_OPTIONS.find((a) => a.id === id) ||
    (id === "wizard" ? AVATAR_OPTIONS[0] : AVATAR_OPTIONS[0]);

  const sizeClasses = {
    xs: "w-7 h-7 rounded-xl border p-0.5",
    sm: "w-9 h-9 rounded-xl border p-1",
    md: "w-12 h-12 rounded-2xl border-2 p-1.5",
    lg: "w-20 h-20 rounded-3xl border-2 p-2",
    xl: "w-32 h-32 rounded-3xl border-[3px] p-2.5",
  };

  const iconSizes = {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  // If option has 3D cartoon image generated and requested
  if (option.image && showCharacterArt && (size === "lg" || size === "xl")) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 bg-gradient-to-b ${option.bgGradient} backdrop-blur-md shadow-2xl transition-transform duration-300 hover:scale-105 ${sizeClasses[size]} ${className}`}
        style={{
          borderColor: option.borderColor,
          boxShadow: `0 12px 30px -4px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.2)`,
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
          <Image
            src={option.image}
            alt={option.label}
            fill
            className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transform hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 120px, 150px"
            priority
          />
        </div>
      </div>
    );
  }

  // Minimalist, elegant icon-based avatar
  const renderIcon = () => {
    switch (option.id) {
      case "detective":
        return <Search className={`${iconSizes[size]} ${option.iconColor} stroke-[2.5]`} />;
      case "undercover":
        return <Eye className={`${iconSizes[size]} ${option.iconColor} stroke-[2.5]`} />;
      case "ghost":
        return <Ghost className={`${iconSizes[size]} ${option.iconColor} stroke-[2.5]`} />;
      case "ninja":
        return <Zap className={`${iconSizes[size]} ${option.iconColor} stroke-[2.5]`} />;
      case "crown":
        return <Crown className={`${iconSizes[size]} ${option.iconColor} stroke-[2.5]`} />;
      case "compass":
        return <Compass className={`${iconSizes[size]} ${option.iconColor} stroke-[2.5]`} />;
      case "shield":
        return <Shield className={`${iconSizes[size]} ${option.iconColor} stroke-[2.5]`} />;
      default:
        return <Sparkles className={`${iconSizes[size]} ${option.iconColor} stroke-[2.5]`} />;
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 bg-gradient-to-b ${option.bgGradient} backdrop-blur-md transition-transform duration-200 active:scale-95 shadow-md ${sizeClasses[size]} ${className}`}
      style={{
        borderColor: option.borderColor,
        boxShadow: `0 6px 16px -2px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.2)`,
      }}
    >
      {renderIcon()}
    </div>
  );
}
