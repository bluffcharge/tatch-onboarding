/**
 * Discovery questions — typed config the P4 screen renders.
 * Add or reorder questions here without touching the screen component.
 * Each answered question is stored under `id` on the partner record.
 */

export type Question =
  | {
      id: string;
      type: "single_select_chips";
      prompt: string;
      helperText?: string;
      required?: boolean;
      options: { value: string; label: string }[];
    }
  | {
      id: string;
      type: "multi_select_chips";
      prompt: string;
      helperText?: string;
      required?: boolean;
      minSelected?: number;
      options: { value: string; label: string }[];
    };

export const DISCOVERY_QUESTIONS: Question[] = [
  {
    id: "technician_count",
    type: "single_select_chips",
    prompt: "How many technicians do you have?",
    helperText: "Including yourself, owners, and 1099 partners.",
    required: true,
    options: [
      { value: "1-5",   label: "1–5"    },
      { value: "6-15",  label: "6–15"   },
      { value: "16-50", label: "16–50"  },
      { value: "50+",   label: "50+"    },
    ],
  },
  {
    id: "services",
    type: "multi_select_chips",
    prompt: "What services do you provide?",
    helperText: "Pick all that apply. You can edit this later.",
    required: true,
    minSelected: 1,
    options: [
      { value: "roofing",       label: "Roofing"             },
      { value: "hvac",          label: "HVAC"                },
      { value: "plumbing",      label: "Plumbing"            },
      { value: "solar",         label: "Solar"               },
      { value: "electrical",    label: "Electrical"          },
      { value: "landscaping",   label: "Landscaping"         },
      { value: "general",       label: "General contracting" },
      { value: "other",         label: "Other"               },
    ],
  },
];

export const DISCOVERY_VERSION = "2026-05-20.v1";
