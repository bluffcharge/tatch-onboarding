/**
 * Discovery questions — typed config the P4 screen renders.
 * Add or reorder questions here without touching the screen component.
 * Each answered question is stored under `id` on the partner record.
 */

export type Question =
  | {
      id: string;
      type: "short_text";
      prompt: string;
      helperText?: string;
      required?: boolean;
      placeholder?: string;
      inputMode?: "text" | "numeric" | "tel" | "email";
    }
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
      /** If a specific option (e.g. "other") needs an inline specify field. */
      specifyFor?: string;
      specifyPrompt?: string;
      specifyPlaceholder?: string;
    };

export const DISCOVERY_QUESTIONS: Question[] = [
  {
    id: "technician_count",
    type: "short_text",
    prompt: "How many technicians do you have?",
    helperText: "Including yourself, owners, and 1099 partners.",
    required: true,
    placeholder: "e.g. 12",
    inputMode: "numeric",
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
    specifyFor: "other",
    specifyPrompt: "What other services?",
    specifyPlaceholder: "e.g. Pool service, fencing, gutters",
  },
];

export const DISCOVERY_VERSION = "2026-05-21.v2";
