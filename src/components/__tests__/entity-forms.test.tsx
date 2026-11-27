import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NewsForm } from "@/components/news/news-form.client";

import type { News } from "@/gql/schema";

const newsActions = vi.hoisted(() => ({ createAction: vi.fn(), updateAction: vi.fn() }));
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
const track = vi.hoisted(() => vi.fn());
const ready = vi.hoisted(() => Object.assign(Promise.resolve(), { status: "fulfilled", value: undefined }));

vi.mock("@/app/(app)/news/actions.server", () => newsActions);
vi.mock("next/cache", () => ({ io: () => ready }));
vi.mock("sonner", () => ({ toast }));
vi.mock("@/utils/umami", () => ({ track }));
vi.mock("@/components/edit-queue/edit-form-shell.client", () => ({
  EditFormShell: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/edit-queue/edit-queue-form-state.client", () => ({ useReportEditQueueFormState: vi.fn() }));

function submit(container: HTMLElement, id: string) {
  fireEvent.submit(container.querySelector(`form#${id}`)!);
}

beforeEach(() => {
  vi.clearAllMocks();
  newsActions.createAction.mockResolvedValue({ id: "n9" });
  newsActions.updateAction.mockResolvedValue({ id: "n1" });
});

describe("NewsForm", () => {
  it("creates news", async () => {
    const onSuccess = vi.fn();
    const { container } = render(
      <NewsForm
        onSuccess={onSuccess}
        embedded
        formId="news-form"
      />
    );

    const [subject, text] = await screen.findAllByRole("textbox");

    await userEvent.type(subject, "Årsmöte");
    await userEvent.type(text, "Välkomna");
    submit(container, "news-form");

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(undefined));
    expect(newsActions.createAction).toHaveBeenCalledWith(
      expect.objectContaining({ subject: "Årsmöte", text: "Välkomna" })
    );
    expect(toast.success).toHaveBeenCalledWith("Common.createSuccess");
  });

  it("updates news and reports failures", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const item = {
      id: "n1",
      subject: "Årsmöte",
      text: "Text",
      visibleFrom: "2026-01-01",
      visibleTo: null,
    } as unknown as News;
    const { container } = render(
      <NewsForm
        item={item}
        onSuccess={onSuccess}
        onError={onError}
        embedded
        formId="news-form"
      />
    );

    expect((await screen.findAllByRole("textbox"))[0]).toHaveValue("Årsmöte");
    submit(container, "news-form");
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(newsActions.updateAction).toHaveBeenCalledWith("n1", expect.objectContaining({ subject: "Årsmöte" }));

    newsActions.updateAction.mockRejectedValue(new Error("boom"));
    submit(container, "news-form");
    await waitFor(() => expect(onError).toHaveBeenCalled());
  });
});
