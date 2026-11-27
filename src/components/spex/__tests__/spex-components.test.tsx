import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SpexViewDialog } from "@/components/spex/spex-view-dialog.client";

import type { Spex } from "@/gql/schema";

vi.mock("next/image", () => ({ default: () => <span data-slot="mock-image" /> }));

const spex = {
  id: "sp1",
  title: "Hamlet",
  year: "2020",
  posterUrl: null,
  category: { id: "c1", name: "Chalmersspexet" },
  revivals: [],
} as unknown as Spex;

describe("SpexViewDialog", () => {
  it("renders the spex detail and closes", async () => {
    const onClose = vi.fn();
    render(
      <SpexViewDialog
        selected={spex}
        onClose={onClose}
      />
    );
    expect(screen.getByText("Hamlet")).toBeInTheDocument();
    expect(screen.getByText("Chalmersspexet")).toBeInTheDocument();
    // The footer's button; the corner's X, after it, has the same name
    await userEvent.click(screen.getAllByRole("button", { name: /Common.close/ })[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it("renders nothing when there is no selection", () => {
    render(
      <SpexViewDialog
        selected={null}
        onClose={vi.fn()}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
