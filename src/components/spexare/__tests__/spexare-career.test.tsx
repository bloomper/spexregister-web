import {describe, expect, it} from "vitest";
import {render, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SpexareCareer} from "@/components/spexare/spexare-career.client";
import type {Activity} from "@/gql/schema";

let seq = 0;

const activity = (year: string, title: string, category: string, tasks: [string, string[]][] = []): Activity => ({
    id: `a-${seq++}`,
    spexActivity: {id: `sa-${year}`, spex: {id: `s-${title}`, year, title, category: {id: "c", name: category}}},
    taskActivities: tasks.map(([name, roles], index) => ({
        id: `ta-${year}-${index}`,
        task: {id: `t-${index}`, name},
        actors: roles.map((role, r) => ({id: `ac-${year}-${index}-${r}`, role})),
    })),
} as unknown as Activity);

const activities = [
    activity("2015", "Bacchus", "Chalmersspexet", [["Skådespelare", ["Greve"]]]),
    // Skådespelare again - the functions metric counts it once.
    activity("2016", "Caesar", "Chalmersspexet", [["Skådespelare", []]]),
    // 2017-2019 deliberately absent - the gap is the thing the strip must show.
    activity("2020", "Dante", "Vasaspexet", [["Orkester", []]]),
];

describe("SpexareCareer", () => {
    it("shows the empty state when there is nothing to plot", () => {
        render(<SpexareCareer/>);
        expect(screen.getByText("Common.noDataHeading")).toBeInTheDocument();
    });

    it("summarises the career in the stat tiles", () => {
        render(<SpexareCareer activities={activities}/>);

        const tiles = screen.getAllByRole("definition").map((tile) => tile.textContent);
        // 3 spex over 3 active years, 2015-2020; Skådespelare twice plus Orkester is 2
        // distinct functions, and only one of those credits a role.
        expect(tiles).toEqual(["3", "3", "2015–2020", "2", "1"]);
    });

    it("fills every year of the span so absences render as gaps", () => {
        render(<SpexareCareer activities={activities}/>);

        // Only years with a production become buttons; 2017-2019 stay blank.
        expect(screen.getByRole("button", {name: "Spex.heading 2016"})).toBeInTheDocument();
        expect(screen.queryByRole("button", {name: "Spex.heading 2018"})).not.toBeInTheDocument();
    });

    it("shows a single-year career as a year, not a period", () => {
        render(<SpexareCareer activities={[activity("2013", "Vera", "Veraspexet")]}/>);

        expect(screen.getAllByRole("definition")[2]).toHaveTextContent("2013");
        expect(screen.getAllByRole("definition")[2]).not.toHaveTextContent("–");
    });

    it("ignores memberships entirely - they are unrelated to spex", () => {
        render(<SpexareCareer activities={activities}/>);

        // The span is the spex span, and nothing outside it appears.
        expect(screen.getAllByRole("definition")[2]).toHaveTextContent("2015–2020");
        expect(screen.queryByRole("button", {name: /1991/})).not.toBeInTheDocument();
    });

    it("splits a year that holds more than one category across the cell", () => {
        render(<SpexareCareer activities={[
            activity("2015", "Vera", "Veraspexet"),
            activity("2015", "Bob", "Bobspexet"),
        ]}/>);

        const cell = screen.getByRole("button", {name: "Spex.heading 2015"});
        // Two hard-stop bands rather than only the first category's colour.
        expect(cell.style.background).toContain("linear-gradient");
        expect(cell.style.background).toContain("0% 50%");
        expect(cell.style.background).toContain("50% 100%");
    });

    it("gives each category its own legend entry", () => {
        render(<SpexareCareer activities={activities}/>);

        expect(screen.getByText("Chalmersspexet")).toBeInTheDocument();
        expect(screen.getByText("Vasaspexet")).toBeInTheDocument();
    });

    it("offers the table view as an alternative to colour", async () => {
        render(<SpexareCareer activities={activities}/>);

        await userEvent.click(screen.getByRole("button", {name: "Spexare.Career.showTable"}));

        const rows = screen.getAllByRole("row").slice(1);
        expect(rows).toHaveLength(3);
        expect(within(rows[0]).getByText("Bacchus")).toBeInTheDocument();
        expect(within(rows[0]).getByText("Skådespelare (Greve)")).toBeInTheDocument();
        // 2016 repeats the function but credits no role, so it shows the bare name.
        expect(within(rows[1]).getByText("Skådespelare")).toBeInTheDocument();
    });
});
