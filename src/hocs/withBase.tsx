import { useAppDispatch } from "@/lib/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const withBase = <P extends object>(
  Component: React.ComponentType<P & IWithBaseProps>
) => {
  const WithBaseComponent = (props: Omit<P, keyof IWithBaseProps>) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const rangeCount = <T,>(items: T[], pagination: IPagination) => {
      const currentPage = Number(searchParams?.get("page")) || 1;
      const pageSize = pagination.limit;
      const start = items.length ? (currentPage - 1) * pageSize + 1 : 0;
      const end = Math.min(currentPage * pageSize, pagination?.totalItems || 0);
      return `${start} - ${end} `;
    };

    return (
      <Component
        {...(props as P)}
        router={router}
        pathname={pathname}
        searchParams={searchParams}
        rangeCount={rangeCount}
        dispatch={dispatch}
      />
    );
  };

  WithBaseComponent.displayName = `WithBase(${
    Component.displayName || Component.name || "Component"
  })`;

  return WithBaseComponent;
};

export default withBase;
