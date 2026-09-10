export type ToolCategory = "Code & CSS" | "Images" | "Writing";

export type Tool = {
  category: ToolCategory;
  description: string;
  featured: boolean;
  icon: "code" | "image" | "writing";
  path: string;
  shortName: string;
  tags: string[];
  title: string;
};

export const tools = [
  {
    category: "Code & CSS",
    description: "Minify HTML safely in your browser, then copy or download the optimized result.",
    featured: true,
    icon: "code",
    path: "/tools/html-minifier",
    shortName: "HTML Minifier",
    tags: ["html", "minifier", "compress", "optimize", "developer"],
    title: "HTML Minifier",
  },
  {
    category: "Code & CSS",
    description: "Write and run HTML, CSS, and JavaScript with an instant sandboxed preview.",
    featured: true,
    icon: "code",
    path: "/tools/html-playground",
    shortName: "HTML Playground",
    tags: ["html", "css", "javascript", "editor", "playground", "developer"],
    title: "HTML Playground",
  },
  {
    category: "Code & CSS",
    description: "Convert CSS gradients into concise Tailwind background and text utilities.",
    featured: true,
    icon: "code",
    path: "/docs/gradient-to-tailwind",
    shortName: "Gradient to Tailwind",
    tags: ["css", "tailwind", "gradient", "developer"],
    title: "Gradient to Tailwind",
  },
  {
    category: "Images",
    description: "Automatically optimize images to fit an exact KB or MB limit in your browser.",
    featured: true,
    icon: "image",
    path: "/tools/compress-image-to-size",
    shortName: "Compress Image to Size",
    tags: ["image", "compress", "resize", "jpeg", "png", "webp", "files"],
    title: "Compress Image to Size",
  },
  {
    category: "Images",
    description: "Convert batches of common image formats to WebP and download one tidy ZIP.",
    featured: true,
    icon: "image",
    path: "/docs/image-to-webp",
    shortName: "Image to WebP",
    tags: ["image", "webp", "converter", "compression", "files"],
    title: "Image to WebP",
  },
  {
    category: "Writing",
    description: "Compose rich text and inspect clean, live HTML output side by side.",
    featured: true,
    icon: "writing",
    path: "/docs/editor",
    shortName: "HTML Editor",
    tags: ["html", "editor", "rich text", "preview", "developer"],
    title: "HTML Editor",
  },
] as const satisfies readonly Tool[];

export const categories = [
  {
    name: "Code & CSS" as const,
    description: "Format, generate, and inspect code for the web.",
  },
  {
    name: "Images" as const,
    description: "Convert and prepare visual assets for production.",
  },
  {
    name: "Writing" as const,
    description: "Create and transform content with focused editors.",
  },
].map((category) => ({
  ...category,
  count: tools.filter((tool) => tool.category === category.name).length,
}));

export function getToolByPath(pathname: string) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return tools.find((tool) => tool.path === normalized);
}
