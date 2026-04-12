import type { LinkProps as AriaLinkProps, ToggleButtonProps } from "react-aria-components";

import {
  Link as AriaLink,
  ToggleButton as AriaToggleButton,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { focusRing } from "@/shared/utils/react-aria";

const headerActionStyles = tv({
  extend: focusRing,
  base: "relative inline-flex h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-sm border border-border/70 bg-background/75 px-3 text-sm font-medium text-foreground/80 no-underline shadow-xs backdrop-blur-sm transition-[background-color,border-color,color,transform] duration-200 ease-out forced-color-adjust-none select-none [-webkit-tap-highlight-color:transparent] hover:border-primary/20 hover:bg-accent/70 hover:text-accent-foreground pressed:scale-[0.98] pressed:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4.5 [&_svg]:shrink-0",
  variants: {
    isSelected: {
      false: "",
      true: "border-primary/30 bg-primary/10 text-foreground hover:border-primary/40 hover:bg-primary/14 dark:bg-primary/15",
    },
  },
});

export function HeaderActionLink(props: AriaLinkProps) {
  return (
    <AriaLink
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        headerActionStyles({ ...renderProps, className }),
      )}
    />
  );
}

export function HeaderActionToggle(props: ToggleButtonProps) {
  return (
    <AriaToggleButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        headerActionStyles({ ...renderProps, className }),
      )}
    />
  );
}
