"use client";

import {ReactNode} from "react";
import type {EntityType, QueueItem} from "@/components/edit-queue/edit-queue-provider.client";
import type {EditQueueOptions} from "@/app/(app)/edit-queue/actions.server";
import {NewsForm} from "@/components/news/news-form.client";
import {TagForm} from "@/components/tag/tag-form.client";
import {SpexForm} from "@/components/spex/spex-form.client";
import {SpexCategoryForm} from "@/components/spex/category/spex-category-form.client";
import {TaskForm} from "@/components/task/task-form.client";
import {TaskCategoryForm} from "@/components/task/category/task-category-form.client";
import {UserForm} from "@/components/user/user-form.client";
import {SpexareForm} from "@/components/spexare/spexare-form.client";
import {getAction as getSpexareAction} from "@/app/(app)/spexare/actions.server";
import {getAction as getNewsAction} from "@/app/(app)/news/actions.server";
import {getAction as getSpexAction} from "@/app/(app)/spex/actions.server";
import {getAction as getSpexCategoryAction} from "@/app/(app)/spex/categories/actions.server";
import {getAction as getTaskAction} from "@/app/(app)/tasks/actions.server";
import {getAction as getTaskCategoryAction} from "@/app/(app)/tasks/categories/actions.server";
import {getAction as getTagAction} from "@/app/(app)/tags/actions.server";
import {getAction as getUserAction} from "@/app/(app)/users/actions.server";
import {News, Spex, SpexCategory, Spexare, Tag, Task, TaskCategory, User} from "@/gql/schema";

export const EDIT_QUEUE_FORM_ID = "edit-queue-form";

type RenderArgs = {
    item: QueueItem;
    options: EditQueueOptions;
    onSuccess: (updated?: { id: string }) => void;
    onError: () => void;
};

type RegistryEntry = {
    needsOptions: boolean;
    formId: string;
    labelOf: (item: QueueItem) => string;
    Form: (props: RenderArgs) => ReactNode;
    // Fetch the full record before first render (used when the enqueued snapshot is summary-only).
    fetchFull?: (id: string) => Promise<{ id: string } | null | undefined>;
    // Refetch the authoritative record by id (used to refresh the snapshot after a save).
    getById: (id: string) => Promise<{ id: string } | null | undefined>;
};

export const editQueueRegistry: Record<EntityType, RegistryEntry> = {
    spexare: {
        needsOptions: true,
        formId: "spexare-general-form",
        fetchFull: (id) => getSpexareAction(id),
        getById: (id) => getSpexareAction(id),
        labelOf: (i) => `${(i as Spexare).firstName ?? ""} ${(i as Spexare).lastName ?? ""}`.trim(),
        Form: ({item, options, onSuccess, onError}) => (
            <SpexareForm
                item={item as Spexare}
                types={options.types}
                countries={options.countries}
                tags={options.tags}
                tasks={options.tasks}
                taskCategories={options.taskCategories}
                spex={options.spex}
                spexCategories={options.spexCategories}
                onSuccess={onSuccess}
                onError={onError}
                embedded
            />
        ),
    },
    news: {
        needsOptions: false,
        formId: EDIT_QUEUE_FORM_ID,
        getById: (id) => getNewsAction(id),
        labelOf: (i) => (i as News).subject ?? "",
        Form: ({item, onSuccess, onError}) => (
            <NewsForm item={item as News} onSuccess={onSuccess} onError={onError} embedded formId={EDIT_QUEUE_FORM_ID}/>
        ),
    },
    spex: {
        needsOptions: true,
        formId: EDIT_QUEUE_FORM_ID,
        getById: (id) => getSpexAction(id),
        labelOf: (i) => (i as Spex).title ?? "",
        Form: ({item, options, onSuccess, onError}) => (
            <SpexForm
                item={item as Spex}
                categories={options.spexCategories}
                onSuccess={onSuccess}
                onError={onError}
                embedded
                formId={EDIT_QUEUE_FORM_ID}
            />
        ),
    },
    spexCategory: {
        needsOptions: false,
        formId: EDIT_QUEUE_FORM_ID,
        getById: (id) => getSpexCategoryAction(id),
        labelOf: (i) => (i as SpexCategory).name ?? "",
        Form: ({item, onSuccess, onError}) => (
            <SpexCategoryForm item={item as SpexCategory} onSuccess={onSuccess} onError={onError} embedded formId={EDIT_QUEUE_FORM_ID}/>
        ),
    },
    task: {
        needsOptions: true,
        formId: EDIT_QUEUE_FORM_ID,
        getById: (id) => getTaskAction(id),
        labelOf: (i) => (i as Task).name ?? "",
        Form: ({item, options, onSuccess, onError}) => (
            <TaskForm
                item={item as Task}
                categories={options.taskCategories}
                onSuccess={onSuccess}
                onError={onError}
                embedded
                formId={EDIT_QUEUE_FORM_ID}
            />
        ),
    },
    taskCategory: {
        needsOptions: false,
        formId: EDIT_QUEUE_FORM_ID,
        getById: (id) => getTaskCategoryAction(id),
        labelOf: (i) => (i as TaskCategory).name ?? "",
        Form: ({item, onSuccess, onError}) => (
            <TaskCategoryForm item={item as TaskCategory} onSuccess={onSuccess} onError={onError} embedded formId={EDIT_QUEUE_FORM_ID}/>
        ),
    },
    tag: {
        needsOptions: false,
        formId: EDIT_QUEUE_FORM_ID,
        getById: (id) => getTagAction(id),
        labelOf: (i) => (i as Tag).name ?? "",
        Form: ({item, onSuccess, onError}) => (
            <TagForm item={item as Tag} onSuccess={onSuccess} onError={onError} embedded formId={EDIT_QUEUE_FORM_ID}/>
        ),
    },
    user: {
        needsOptions: true,
        formId: EDIT_QUEUE_FORM_ID,
        getById: (id) => getUserAction(id),
        labelOf: (i) => (i as User).email ?? "",
        Form: ({item, options, onSuccess, onError}) => (
            <UserForm
                item={item as User}
                authorities={options.authorities}
                states={options.states}
                onSuccess={onSuccess}
                onError={onError}
                embedded
                formId={EDIT_QUEUE_FORM_ID}
            />
        ),
    },
};
