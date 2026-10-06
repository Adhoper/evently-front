import {
  CheckCircle2,
  Clock3,
  Ban,
  Flag,
} from "lucide-react";

import type {
  EventStatus,
} from "../types/event";

interface EventStatusBadgeProps {
  status: EventStatus;
}

function EventStatusBadge({
  status,
}: EventStatusBadgeProps) {
  const styles = {
    Draft: {
      label: "Borrador",
      icon: Clock3,
      classes:
        "bg-amber-50 text-amber-700 ring-amber-600/15",
    },

    Published: {
      label: "Publicado",
      icon: CheckCircle2,
      classes:
        "bg-brand-50 text-brand-700 ring-brand-600/15",
    },

    Cancelled: {
      label: "Cancelado",
      icon: Ban,
      classes:
        "bg-red-50 text-red-700 ring-red-600/15",
    },

    Finished: {
      label: "Finalizado",
      icon: Flag,
      classes:
        "bg-slate-100 text-slate-600 ring-slate-500/15",
    },
  };

  const current =
    styles[status];

  const Icon =
    current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${current.classes}`}
    >
      <Icon size={13} />

      {current.label}
    </span>
  );
}

export default EventStatusBadge;