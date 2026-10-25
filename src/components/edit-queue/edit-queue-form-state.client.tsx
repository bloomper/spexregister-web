"use client";

import * as React from "react";
import {createContext, useContext, useEffect} from "react";

export type EditQueueFormState = {
    isDirty: boolean;
    canSubmit: boolean;
};

export const IDLE_FORM_STATE: EditQueueFormState = {isDirty: false, canSubmit: true};

type Report = (state: EditQueueFormState) => void;

const EditQueueFormStateContext = createContext<Report | null>(null);

/**
 * Lets a form inside the edit queue tell the drawer whether it has unsaved changes and can be saved.
 */
export function EditQueueFormStateProvider({
                                               onFormStateChange,
                                               children,
                                           }: {
    onFormStateChange: Report;
    children: React.ReactNode;
}) {
    return (
        <EditQueueFormStateContext.Provider value={onFormStateChange}>
            {children}
        </EditQueueFormStateContext.Provider>
    );
}

/**
 * Reports the form's state to the edit queue drawer, and that it is idle when it goes away. Does nothing outside the
 * queue.
 */
export function useReportEditQueueFormState({isDirty, canSubmit = true}: {
    isDirty: boolean;
    canSubmit?: boolean;
}) {
    const report = useContext(EditQueueFormStateContext);

    useEffect(() => {
        report?.({isDirty, canSubmit});
    }, [report, isDirty, canSubmit]);

    useEffect(() => {
        return () => report?.(IDLE_FORM_STATE);
    }, [report]);
}
