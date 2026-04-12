import { ImageToWebpPage } from "@/features/image-to-webp";

export const handle = {
  docsNav: {
    title: "Image to WebP",
    order: 20,
  },
};

export function meta() {
  return [
    { title: "Image to WebP | Phaicom Tools" },
    {
      name: "description",
      content: "Convert batches of images into WebP files with server-side sharp processing.",
    },
  ];
}

export default function ImageToWebpDocsPage() {
  return <ImageToWebpPage />;
}
