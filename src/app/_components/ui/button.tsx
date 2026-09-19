import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-250 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  const variants = {
    primary:
      "bg-primary hover:bg-primary-hover text-white shadow-md shadow-indigo-500/10 focus-visible:outline-indigo-500 hover:scale-[1.01]",
    secondary:
      "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-100",
    outline:
      "border border-card-border bg-transparent text-foreground hover:bg-black/[0.02] dark:hover:bg-white/[0.04]",
    ghost:
      "bg-transparent text-foreground hover:bg-black/[0.02] dark:hover:bg-white/[0.04]",
  };

  const sizes = {
    sm: "min-h-[38px] px-4 py-2 text-xs sm:text-sm font-semibold",
    md: "min-h-[44px] px-5 py-2.5 text-sm sm:text-base font-semibold",
    lg: "min-h-[50px] px-6 py-3.5 text-base sm:text-lg font-bold",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
