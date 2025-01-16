function generateBreadcrumbs(
  data: ICategory[],
  slug: string,
  breadcrumbs = ""
): string {
  const item = data.find(
    (d: ICategory) => d.slug.toLowerCase() === slug.toLowerCase()
  );

  if (!item) return breadcrumbs;

  const newBreadcrumb = item.parent_slug
    ? generateBreadcrumbs(data, item.parent_slug, breadcrumbs) +
      " / " +
      item.title
    : item.title;

  return newBreadcrumb;
}

export default generateBreadcrumbs;
