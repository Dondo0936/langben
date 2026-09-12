import {
  SessionEventsPage,
  SessionPage,
} from "@/src/features/sessions/SessionPages";
import { useReadPath } from "@/src/features/events/hooks/useReadPath";
import {
  RouteParamsPendingFallback,
  useReadyRouteParams,
} from "@/src/hooks/useReadyRouteParams";
import { HoiThoai } from "@/src/vet/HoiThoai";

export default function Session() {
  const route = useReadyRouteParams(["projectId", "sessionId"]);
  const { isV4 } = useReadPath();

  if (!route.ready) return <RouteParamsPendingFallback />;

  const { projectId, sessionId } = route.params;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {isV4 ? (
        <SessionEventsPage sessionId={sessionId} projectId={projectId} />
      ) : (
        <SessionPage sessionId={sessionId} projectId={projectId} />
      )}
      <HoiThoai projectId={projectId} sessionId={sessionId} />
    </div>
  );
}
