import { GradientToTailwindPage } from "@/features/gradient-to-tailwind";

export const handle = {
  docsNav: {
    title: "Gradient to Tailwind",
    order: 10,
  },
};

export function meta() {
  return [
    { title: "Gradient to Tailwind | Phaicom Tools" },
    {
      name: "description",
      content: "Convert CSS gradients into Tailwind background and text utility classes.",
    },
  ];
}

export default function GradientToTailwindDocsPage() {
  return <GradientToTailwindPage />;
}
