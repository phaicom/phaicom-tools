import { HempConfetti } from "@/components/HempConfetti";

export const Header = () => {
  return (
    <header className="flex h-14 flex-row items-center gap-2 border-b border-border bg-primary-foreground px-4">
      <HempConfetti />
      <h4 className="font-semibold">
        <span className="hidden md:inline">Phaicom's Tools</span>
        <span className="md:hidden">PCTs</span>
      </h4>
    </header>
  );
};
