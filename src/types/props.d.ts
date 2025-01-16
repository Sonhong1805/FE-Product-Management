interface IWithBaseProps {
  searchParams: ReturnType<typeof useSearchParams>;
  rangeCount: <T>(items: T[], pagination: IPagination) => string;
  router: ReturnType<typeof useRouter>;
  pathname: ReturnType<typeof usePathname>;
  dispatch: ReturnType<typeof useAppDispatch>;
}
