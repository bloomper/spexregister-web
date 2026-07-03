"use server";

import {getLocale} from "next-intl/server";
import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {getCountries, getTypes} from "@/lib/settings";
import {getAll as getAllTags} from "@/lib/tag";
import {getAll as getAllTasks} from "@/lib/task";
import {getAll as getAllTaskCategories} from "@/lib/task/category";
import {getAll as getAllSpex} from "@/lib/spex";
import {getAll as getAllSpexCategories} from "@/lib/spex/category";
import {getAuthorities, getStates} from "@/lib/user";
import {
    Authority,
    Country,
    Spex,
    SpexCategory,
    State,
    Tag,
    Task,
    TaskCategory,
    Type,
} from "@/gql/schema";
import type {EntityType} from "@/components/edit-queue/edit-queue-provider.client";

export type EditQueueOptions = {
    types: Type[];
    countries: Country[];
    tags: Tag[];
    tasks: Task[];
    taskCategories: TaskCategory[];
    spex: Spex[];
    spexCategories: SpexCategory[];
    authorities: Authority[];
    states: State[];
};

const empty: EditQueueOptions = {
    types: [], countries: [], tags: [], tasks: [], taskCategories: [],
    spex: [], spexCategories: [], authorities: [], states: [],
};

export async function getEditQueueOptions(entityType: EntityType): Promise<EditQueueOptions> {
    switch (entityType) {
        case "spexare":
            return withPolicyAction(Policies.spexare.requireUpdate, async () => {
                const locale = await getLocale();
                const [types, countries, tags, tasks, taskCategories, spex, spexCategories] = await Promise.all([
                    getTypes(locale), getCountries(locale), getAllTags(), getAllTasks(),
                    getAllTaskCategories(), getAllSpex(), getAllSpexCategories(),
                ]);
                return {...empty, types, countries, tags, tasks, taskCategories, spex, spexCategories};
            });
        case "spex":
            return withPolicyAction(Policies.spex.requireUpdate, async () => {
                const spexCategories = await getAllSpexCategories();
                return {...empty, spexCategories};
            });
        case "task":
            return withPolicyAction(Policies.task.requireUpdate, async () => {
                const taskCategories = await getAllTaskCategories();
                return {...empty, taskCategories};
            });
        case "user":
            return withPolicyAction(Policies.user.requireUpdate, async () => {
                const [authorities, states] = await Promise.all([getAuthorities(), getStates()]);
                return {...empty, authorities, states};
            });
        default:
            return empty;
    }
}
