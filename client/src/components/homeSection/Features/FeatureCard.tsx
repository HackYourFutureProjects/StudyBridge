import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard = ({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) => {
  return (
    <div className={`card-glass-center group ${className || ""}`}>
      <div className="flex justify-center mb-6 text-purple-400 group-hover:text-purple-300 transition-colors">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>

      <p className="text-white/70 leading-relaxed">{description}</p>
    </div>
  );
};
