import StarterKit from "@tiptap/starter-kit";

export function createBaseExtensions() {
  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      link: {
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          rel: null,
          target: null,
        },
        openOnClick: false,
        protocols: ["http", "https", "mailto", "tel"],
      },
      underline: {},
    }),
  ];
}
