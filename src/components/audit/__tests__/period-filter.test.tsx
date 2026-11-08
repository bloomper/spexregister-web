import {describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {useState} from "react";
import {PeriodFilter} from "@/components/audit/period-filter.client";

const day = (text: string) =>
    screen.getAllByRole("button").find(button => button.textContent === text && !button.closest("[data-outside]"))!;

/** The filter with its period kept, as the change log keeps it in the address. */
function Host({ initial, spy }: { initial: { from?: string; to?: string }; spy: (from?: string, to?: string) => void }) {
    const [period, setPeriod] = useState(initial);

    return (
        <PeriodFilter
            from={period.from}
            to={period.to}
            onChange={(from, to) => {
                spy(from, to);
                setPeriod({ from, to });
            }}
        />
    );
}

describe("PeriodFilter", () => {
    it("takes the first day alone as from that day until now, and closes on the last day", async () => {
        const onChange = vi.fn();
        const user = userEvent.setup();

        render(<Host initial={{ from: "2026-10-05" }} spy={onChange} />);
        expect(screen.getByRole("button", { name: /Audit.period/ })).toHaveTextContent("2026-10-05 – Audit.untilNow");

        await user.click(screen.getByRole("button", { name: /Audit.period/ }));
        expect(screen.getByText("Audit.pickStart")).toBeInTheDocument();
        await user.click(day("20"));
        expect(onChange).toHaveBeenLastCalledWith("2026-10-20", undefined);
        expect(screen.getByText("Audit.pickEnd")).toBeInTheDocument();

        // The last day cannot come before the first
        expect(day("12")).toBeDisabled();
        expect(day("20")).toBeEnabled();
        await user.click(day("25"));
        expect(onChange).toHaveBeenLastCalledWith("2026-10-20", "2026-10-25");
        expect(screen.queryByText("Audit.pickEnd")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Audit.period/ })).toHaveTextContent("2026-10-20 – 2026-10-25");
    });

    it("starts over with the first day when opened again, and clears", async () => {
        const onChange = vi.fn();
        const user = userEvent.setup();

        render(<Host initial={{ from: "2026-10-05", to: "2026-10-09" }} spy={onChange} />);
        await user.click(screen.getByRole("button", { name: /Audit.period/ }));
        await user.click(day("15"));
        expect(onChange).toHaveBeenLastCalledWith("2026-10-15", undefined);

        await user.click(screen.getByRole("button", { name: "Common.reset" }));
        expect(onChange).toHaveBeenLastCalledWith(undefined, undefined);
    });

    it("offers no day after today", async () => {
        const user = userEvent.setup();
        const today = new Date();
        const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        render(<Host initial={{}} spy={vi.fn()} />);
        await user.click(screen.getByRole("button", { name: /Audit.period/ }));

        const cell = (date: Date) =>
            screen.getAllByRole("button").find(button => button.getAttribute("data-day") === date.toLocaleDateString())!;

        expect(cell(today)).toBeEnabled();
        // Tomorrow is in this month's grid, or the next month's, which the calendar does not go to
        if (tomorrow.getMonth() === today.getMonth()) {
            expect(cell(tomorrow)).toBeDisabled();
        }
        expect(screen.getByRole("button", { name: /next month|nästa månad/i })).toHaveAttribute("aria-disabled", "true");
    });

    it("ignores a malformed day in the address", () => {
        render(<PeriodFilter from="2026-02-31" onChange={vi.fn()} />);
        expect(screen.getByRole("button", { name: /Audit.period/ })).toBeInTheDocument();
    });
});
