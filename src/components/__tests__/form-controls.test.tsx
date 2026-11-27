import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormValidation } from "@/components/form-validation.client";
import { DatePicker } from "@/components/date-picker.client";

describe("FormValidation", () => {
  const form = () =>
    render(
      <form>
        <FormValidation />
        <input
          aria-label="name"
          required
        />
        <input
          aria-label="code"
          pattern="[a-z]+"
          title="a-z"
          defaultValue="A1"
        />
        <input
          aria-label="email"
          type="email"
          defaultValue="nej"
        />
        <input
          aria-label="own"
          ref={(input) => input?.setCustomValidity("Egen")}
        />
      </form>
    );

  it("replaces the browser's messages with the app's", () => {
    form();
    const name = screen.getByLabelText<HTMLInputElement>("name");

    name.checkValidity();
    expect(name.validationMessage).toBe("valueMissing");
    screen.getByLabelText<HTMLInputElement>("code").checkValidity();
    expect(screen.getByLabelText<HTMLInputElement>("code").validationMessage).toBe('patternWithHint:{"hint":"a-z"}');
    screen.getByLabelText<HTMLInputElement>("email").checkValidity();
    expect(screen.getByLabelText<HTMLInputElement>("email").validationMessage).toBe("email");
  });

  it("clears its message when the value changes, and leaves a control's own message alone", () => {
    form();
    const name = screen.getByLabelText<HTMLInputElement>("name");

    name.checkValidity();
    fireEvent.input(name, { target: { value: "Spex" } });
    expect(name.checkValidity()).toBe(true);

    const own = screen.getByLabelText<HTMLInputElement>("own");

    own.checkValidity();
    expect(own.validationMessage).toBe("Egen");
  });
});

describe("DatePicker", () => {
  it("shows the date in the app's language and submits it as an ISO date", async () => {
    render(
      <form aria-label="form">
        <DatePicker
          id="d"
          name="day"
          defaultValue="1975-02-14"
        />
      </form>
    );

    expect(screen.getByRole("button", { name: /14 februari 1975/ })).toBeInTheDocument();
    expect(new FormData(screen.getByRole<HTMLFormElement>("form", { name: "form" })).get("day")).toBe("1975-02-14");

    await userEvent.click(screen.getByRole("button", { name: "clearDate" }));
    expect(screen.getByRole("button", { name: /chooseDate/ })).toBeInTheDocument();
    expect(new FormData(screen.getByRole<HTMLFormElement>("form", { name: "form" })).get("day")).toBe("");
  });

  it("shows the date in a given format", () => {
    render(
      <DatePicker
        defaultValue="1975-02-14"
        displayFormat="yyyy-MM-dd"
      />
    );

    expect(screen.getByRole("button", { name: /1975-02-14/ })).toBeInTheDocument();
  });

  it("names the months in the calendar's dropdown in the app's language", async () => {
    render(<DatePicker defaultValue="1975-02-14" />);
    await userEvent.click(screen.getByRole("button", { name: /14 februari 1975/ }));

    expect(await screen.findByRole("option", { name: "feb." })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Feb" })).not.toBeInTheDocument();
  });

  it("blocks an empty required date and goes back to the default on reset", async () => {
    render(
      <form aria-label="form">
        <DatePicker
          name="day"
          required
        />
      </form>
    );
    const form = screen.getByRole<HTMLFormElement>("form", { name: "form" });

    expect(form.checkValidity()).toBe(false);
    form.reset();
    expect(screen.queryByRole("button", { name: "clearDate" })).not.toBeInTheDocument();
  });

  it("reports a controlled value change", async () => {
    const changes: string[] = [];

    render(
      <DatePicker
        value="2026-01-01"
        onChange={(value) => changes.push(value)}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "clearDate" }));
    expect(changes).toEqual([""]);
  });
});
