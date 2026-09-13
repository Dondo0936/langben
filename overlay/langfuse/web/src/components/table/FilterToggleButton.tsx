/* eslint-disable @repo/no-style-props */
import { Filter } from "lucide-react";

import { useDataTableControls } from "@/src/components/table/data-table-controls";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/utils/tailwind";
import { type FilterState } from "@langfuse/shared";

export function FilterToggleButton({
  filterState,
  className,
}: {
  filterState?: FilterState;
  className?: string;
}) {
  const { open, setOpen } = useDataTableControls();
  const activeFacetCount = filterState
    ? new Set(filterState.map((filter) => filter.column)).size
    : 0;
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setOpen(!open)}
      className={cn("flex h-8 items-center gap-2 text-sm", className)}
    >
      <Filter className="h-4 w-4" />
      <span>Bộ lọc</span>
      {activeFacetCount > 0 && (
        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
          {activeFacetCount}
        </Badge>
      )}
    </Button>
  );
}
