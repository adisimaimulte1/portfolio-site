export function getGalleryLayout(ratios, width, targetHeight, gap) {
  if (width <= 0) return [];
  const layout = [];
  let row = [];
  let total = 0;

  function finishRow(last) {
    const available = Math.max(1, width - gap * (row.length - 1));
    const height = last ? Math.min(targetHeight, available / total) : available / total;
    row.forEach((ratio) => layout.push({ width: ratio * height, height }));
    row = [];
    total = 0;
  }

  ratios.forEach((ratio) => {
    const safeRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
    row.push(safeRatio);
    total += safeRatio;
    if (total * targetHeight + gap * (row.length - 1) >= width) finishRow(false);
  });
  if (row.length) finishRow(true);
  return layout;
}
