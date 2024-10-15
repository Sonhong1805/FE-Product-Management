import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface WithBaseProps {
  router: ReturnType<typeof useRouter>;
  createQueryString: (name: string, value: string) => string;
  deleteQueryString: (name: string) => string;
}

const withBase = <P extends object>(
  Component: React.ComponentType<P & WithBaseProps>
) => {
  return (props: Omit<P, keyof WithBaseProps>) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
      (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);

        return params.toString();
      },
      [searchParams]
    );

    const deleteQueryString = useCallback(
      (name: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(name);

        return params.toString();
      },
      [searchParams]
    );

    const rangeCount = (items: any, pagination: IPagination) => {
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
        createQueryString={createQueryString}
        deleteQueryString={deleteQueryString}
        rangeCount={rangeCount}
      />
    );
  };
};

export default withBase;
