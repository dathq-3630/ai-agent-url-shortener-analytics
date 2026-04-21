/** Minimal RFC 4180–style escaping for spreadsheet-friendly CSV. */
export function csvEscape(cell: string): string {
  if (/[,"\r\n]/.test(cell)) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}

export function toCsv(headers: string[], rows: string[][]): string {
  const lines = [
    headers.map(csvEscape).join(","),
    ...rows.map((r) => r.map(csvEscape).join(",")),
  ];
  return `\ufeff${lines.join("\r\n")}`;
}
