import React from "react";
import {
  CalendarClock,
  Clock,
  CircleAlert,
  CheckCircle2,
} from "lucide-react";

const cards = [
  {
    label: "Total follow-ups",
    key: "total",
    icon: CalendarClock,
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    label: "Upcoming",
    key: "upcoming",
    icon: Clock,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Overdue",
    key: "overdue",
    icon: CircleAlert,
    color: "text-red-600 bg-red-50",
  },
  {
    label: "Completed",
    key: "completed",
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-50",
  },
];

export default function FollowUpStats({ counts }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                {card.label}
              </p>

              <span className={`rounded-lg p-2 ${card.color}`}>
                <Icon size={19} />
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {counts[card.key]}
            </p>
          </div>
        );
      })}
    </div>
  );
}