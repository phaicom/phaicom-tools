import { Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";
import { LuMenu, LuX } from "react-icons/lu";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { DocsNavigation } from "./DocsNavigation";

type DocsNavTriggerProps = {
  pathname: string;
};

export function DocsNavTrigger({ pathname }: DocsNavTriggerProps) {
  return (
    <DialogTrigger>
      <Button
        variant="quiet"
        className="h-10 w-10 xl:hidden"
        aria-label="Open documentation navigation"
      >
        <LuMenu className="size-5" />
      </Button>

      <ModalOverlay
        isDismissable
        className={({ isEntering, isExiting }) =>
          cn(
            "fixed inset-0 z-50 bg-background xl:hidden",
            isEntering && "animate-in duration-200 ease-out fade-in",
            isExiting && "animate-out duration-150 ease-in fade-out",
          )
        }
      >
        <Modal className="fixed inset-0 outline-none">
          <Dialog
            aria-label="Documentation navigation"
            className="flex h-full flex-col outline-none"
          >
            {({ close }) => (
              <>
                <div className="flex h-14 items-center justify-between border-b border-border/70 px-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="quiet"
                      className="h-10 w-10 rounded-full"
                      onPress={close}
                      aria-label="Close navigation"
                    >
                      <LuX className="size-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto px-4 py-5">
                  <DocsNavigation pathname={pathname} onNavigate={close} />
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
