import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocalizedChartTooltipContent } from "@/components/analytics/chart-tooltip-content.client";

type Item = { name: string; dataKey: string; value: number; color: string; payload: object };

// The shadcn tooltip needs a sized chart, which jsdom cannot give; this stand-in draws each row with the formatter.
vi.mock("@/components/ui/chart", () => ({
  ChartTooltipContent: ({
    payload,
    formatter,
  }: {
    payload: Item[];
    formatter: (value: number, name: string, item: Item) => ReactNode;
  }) => (
    <div>
      {payload.map((item) => (
        <div key={item.name}>{formatter(item.value, item.name, item)}</div>
      ))}
    </div>
  ),
}));

describe("LocalizedChartTooltipContent", () => {
  it("shows the value in the app's language with the series' label", () => {
    const { container } = render(
      <LocalizedChartTooltipContent
        config={{ count: { label: "Antal" } }}
        active
        payload={[{ name: "count", dataKey: "count", value: 12345, color: "red", payload: {}, graphicalItemId: "bar" }]}
      />
    );

    expect(screen.getByText("Antal")).toBeInTheDocument();
    // Swedish groups thousands with a space; an English browser would give "12,345"
    expect(container.textContent).toContain((12345).toLocaleString("sv"));
    expect(container.textContent).not.toContain("12,345");
  });
});
