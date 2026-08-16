export function formatViews(views: number, includeLabel = true) {
  const formatted = new Intl.NumberFormat('en-US').format(views);
  return includeLabel ? `${formatted} views` : formatted;
}
