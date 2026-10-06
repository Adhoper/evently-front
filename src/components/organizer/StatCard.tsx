import type {
  LucideIcon,
} from "lucide-react";

import {
  motion,
} from "motion/react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  variant:
    | "blue"
    | "yellow"
    | "green"
    | "slate";
}

const variants = {
  blue: {
    container:
      "bg-brand-50 border-brand-100",
    icon:
      "bg-brand-600 text-white shadow-brand-600/20",
  },

  yellow: {
    container:
      "bg-amber-50 border-amber-100",
    icon:
      "bg-accent-400 text-slate-950 shadow-accent-400/20",
  },

  green: {
    container:
      "bg-emerald-50 border-emerald-100",
    icon:
      "bg-emerald-500 text-white shadow-emerald-500/20",
  },

  slate: {
    container:
      "bg-white border-slate-200",
    icon:
      "bg-slate-950 text-white shadow-slate-900/20",
  },
};

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  variant,
}: StatCardProps) {
  const current =
    variants[variant];

  return (
    <motion.article
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-lg ${current.container}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`grid h-11 w-11 place-items-center rounded-xl shadow-lg ${current.icon}`}
        >
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-5 text-xs font-medium text-slate-500">
        {description}
      </p>
    </motion.article>
  );
}

export default StatCard;