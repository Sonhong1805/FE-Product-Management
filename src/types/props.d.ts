interface IWithBaseProps {
  searchParams: ReturnType<typeof useSearchParams>;
  rangeCount: (items: any, pagination: IPagination) => string;
  router: ReturnType<typeof useRouter>;
  pathname: ReturnType<typeof usePathname>;
  dispatch: ReturnType<typeof useAppDispatch>;
}
