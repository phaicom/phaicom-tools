import { CompressImageToSizePage } from "@/features/compress-image-to-size";

export function meta() {
  return [
    { title: "Compress Image to Size – Reduce JPG, PNG & WebP to Exact KB or MB" },
    {
      name: "description",
      content:
        "Compress images to 100 KB, 200 KB, 500 KB, 1 MB, or a custom size directly in your browser.",
    },
  ];
}

export default function CompressImageToSizeRoute() {
  return <CompressImageToSizePage />;
}
