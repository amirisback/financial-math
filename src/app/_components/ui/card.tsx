import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
  className?: string;
}

export function Card({ children, glow = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${
        glow ? "glass-panel-glow" : "glass-panel"
      } p-6 sm:p-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "", ...props }: CardHeaderProps) {
  return (
    <div className={`mb-6 flex flex-col gap-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "", ...props }: CardTitleProps) {
  return (
    <h3
      className={`text-xl font-bold tracking-tight text-foreground sm:text-2xl ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className = "", ...props }: CardDescriptionProps) {
  return (
    <p
      className={`text-sm text-zinc-500 dark:text-zinc-400 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "", ...props }: CardContentProps) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
}
