export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: { key: string; label: string }[]
) {
  if (data.length === 0) {
    alert("Aucune donnée à exporter");
    return;
  }

  // Use provided columns or auto-detect from first row
  const cols = columns || Object.keys(data[0]).map((key) => ({
    key,
    label: key,
  }));

  // Create CSV content
  const headers = cols.map((col) => `"${col.label}"`).join(",");

  const rows = data.map((row) =>
    cols
      .map((col) => {
        let value = row[col.key];
        if (value === null || value === undefined) value = "";
        if (typeof value === "object") value = JSON.stringify(value);
        return `"${String(value).replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  const csv = [headers, ...rows].join("\n");

  // Create download
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function formatDateForCSV(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDurationForCSV(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h${m.toString().padStart(2, "0")}m`;
  return `${m}min${s.toString().padStart(2, "0")}s`;
}
