import PageHeader, {
  type PageHeaderProps,
} from "@/src/components/layouts/page-header";
import { PageHeaderControlsSlotProvider } from "@/src/components/layouts/page-header-controls-slot";
import { MobileTopBar } from "@/src/components/layouts/mobile-top-bar";
import { MobilePageTitle } from "@/src/components/layouts/mobile-page-title";
import { useIsMobile } from "@/src/hooks/use-mobile";
import { cn } from "@/src/utils/tailwind";
import { vetHeaderProps } from "@/src/vet/copy";

type PageContainerProps = {
  children: React.ReactNode;
  headerProps: Omit<PageHeaderProps, "container">;
  scrollable?: boolean;
  withPadding?: boolean;
};

const Page = ({
  children,
  headerProps,
  scrollable = false,
  withPadding = false,
}: PageContainerProps) => {
  const isMobile = useIsMobile();
  const titled = vetHeaderProps(headerProps);

  return (
    <PageHeaderControlsSlotProvider>
      <div
        className={cn(
          "flex flex-col",
          scrollable
            ? "min-h-screen-with-banner relative flex flex-1"
            : "h-full",
        )}
        id="page"
      >
        <header className="sticky top-0 z-50 w-full">
          {isMobile ? (
            <MobileTopBar
              showSidebarTrigger={titled.showSidebarTrigger}
              leadingControl={titled.leadingControl}
            />
          ) : (
            <PageHeader {...titled} container={false} className="top-0" />
          )}
        </header>
        {isMobile && <MobilePageTitle headerProps={titled} />}
        <main
          className={cn(
            "flex flex-1 flex-col",
            scrollable
              ? "min-h-screen-with-banner relative flex"
              : "h-full overflow-hidden",
            withPadding && "p-3",
          )}
        >
          {children}
        </main>
      </div>
    </PageHeaderControlsSlotProvider>
  );
};

export default Page;
