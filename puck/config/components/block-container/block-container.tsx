import { PuckComponent, Slot } from "@puckeditor/core";
import {
  CompoundContainer,
  CompoundContainerProps,
} from "@/puck/components/container";
import { cn } from "@/puck/lib/utils";

type BlockContainerHeight = "auto" | "small" | "medium" | "large";
type BlockContainerSpacing = "none" | "small" | "medium" | "large";

export interface BlockContainerProps {
  padding?: CompoundContainerProps["padding"];
  heading?: string;
  height?: BlockContainerHeight;
  margin?: {
    top?: BlockContainerSpacing;
    bottom?: BlockContainerSpacing;
  };
  columns?: "1" | "2" | "3" | "4" | "6";
  blocks?: Slot;
  className?: string;
}

export const BlockContainer: PuckComponent<BlockContainerProps> = ({
  padding,
  heading,
  height = "auto",
  margin,
  columns = "2",
  blocks: Blocks,
  className,
}) => {
  const resolvedPadding = padding ?? { top: "none", bottom: "none" };
  const { top = "none", bottom = "none" } = margin ?? {};

  return (
    <CompoundContainer
      padding={resolvedPadding}
      className={cn(
        {
          "mt-0": top === "none",
          "mb-0": bottom === "none",
          "mt-4": top === "small",
          "mb-4": bottom === "small",
          "mt-8": top === "medium",
          "mb-8": bottom === "medium",
          "mt-12": top === "large",
          "mb-12": bottom === "large",
        },
        className
      )}
    >
      <div
        className={cn("w-full", {
          "min-h-0": height === "auto",
          "min-h-40": height === "small",
          "min-h-56": height === "medium",
          "min-h-72": height === "large",
        })}
      >
        {heading ? (
          <h3 className="mb-6 text-xl font-semibold tracking-tight">{heading}</h3>
        ) : null}
        {Blocks ? (
          <Blocks
            className={cn("grid gap-8", {
              "grid-cols-1": columns === "1",
              "grid-cols-1 md:grid-cols-2": columns === "2",
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": columns === "3",
              "grid-cols-1 md:grid-cols-2 xl:grid-cols-4": columns === "4",
              "grid-cols-1 md:grid-cols-2 xl:grid-cols-6": columns === "6",
            })}
          />
        ) : null}
      </div>
    </CompoundContainer>
  );
};
