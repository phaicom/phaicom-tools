import { HempConfetti } from "@/shared/components/misc/HempConfetti";

export const Footer = () => {
  return (
    <footer className="mt-auto">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-center px-4 md:px-6 xl:px-8 2xl:px-10">
        <p className="flex flex-row items-center gap-1 text-sm text-muted-foreground">
          Made with
          <HempConfetti />
          by
          <a
            href="https://github.com/phaicom"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition hover:text-foreground"
          >
            Phaicom
          </a>
        </p>
      </div>
    </footer>
  );
};
