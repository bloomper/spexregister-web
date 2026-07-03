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
