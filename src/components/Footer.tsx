import type { FooterRenderProps } from "../types";
import { cn } from "../utils/cn";

export type FooterComponentProps = FooterRenderProps & {
  className?: string;
  hint?: string;
};

export function Footer(props: FooterComponentProps) {
  const { className, hint } = props;
  if (!hint) return null;
  return (
    <div
      className={cn(
        "relative mt-5 text-center text-[11px] font-semibold uppercase tracking-widest text-[color:var(--dp-fg-subtle)]",
        className,
      )}
      role="note"
    >
      {hint}
    </div>
  );
}
