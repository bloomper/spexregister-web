/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    fragment JobStatusFields on JobStatus {\n        id\n        name\n        status\n        exitStatus\n    }\n": typeof types.JobStatusFieldsFragmentDoc,
    "\n    fragment JobFields on Job {\n        id\n        name\n        status\n        exitStatus\n        createdAt\n        startedAt\n        finishedAt\n        hasDownload\n        importResult {\n            success\n            errors\n            messages\n            data\n        }\n    }\n": typeof types.JobFieldsFragmentDoc,
    "\n    query JobStatus($id: ID!) {\n        jobStatus(id: $id) {\n            ...JobStatusFields\n        }\n    }\n": typeof types.JobStatusDocument,
    "\n    query JobById($id: ID!) {\n        job(id: $id) {\n            ...JobFields\n        }\n    }\n": typeof types.JobByIdDocument,
    "\n    query Jobs {\n        jobs {\n            ...JobFields\n        }\n    }\n": typeof types.JobsDocument,
    "\n    mutation JobDelete($id: ID!) {\n        jobDelete(id: $id)\n    }\n": typeof types.JobDeleteDocument,
    "\n    fragment NewsSummary on News {\n        id\n        subject\n        text\n        visibleFrom\n    }\n": typeof types.NewsSummaryFragmentDoc,
    "\n    fragment NewsFull on News {\n        ...NewsSummary\n        published\n        visibleTo\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.NewsFullFragmentDoc,
    "\n    query NewsPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        newsPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...NewsSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.NewsPagedSummaryDocument,
    "\n    query NewsPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        newsPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...NewsFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.NewsPagedFullDocument,
    "\n    mutation NewsCreate($input: NewsCreate!) {\n        newsCreate(input: $input) { ...NewsFull }\n    }\n": typeof types.NewsCreateDocument,
    "\n    mutation NewsUpdate($input: NewsUpdate!) {\n        newsUpdate(input: $input) { ...NewsFull }\n    }\n": typeof types.NewsUpdateDocument,
    "\n    mutation NewsDelete($id: ID!) {\n        newsDelete(id: $id)\n    }\n": typeof types.NewsDeleteDocument,
    "\n    query NewsExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        newsExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": typeof types.NewsExportDocument,
    "\n    query NewsEvents($sourceId: ID!) {\n        newsEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": typeof types.NewsEventsDocument,
    "\n    query Countries {\n        countries {\n            isoCode\n            label\n        }\n    }\n": typeof types.CountriesDocument,
    "\n    query Types {\n        types {\n            id\n            label\n            type\n        }\n    }\n": typeof types.TypesDocument,
    "\n    fragment SpexCategorySummary on SpexCategory {\n        id\n        name\n        logoUrl\n        firstYear\n    }\n": typeof types.SpexCategorySummaryFragmentDoc,
    "\n    fragment SpexCategoryFull on SpexCategory {\n        ...SpexCategorySummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.SpexCategoryFullFragmentDoc,
    "\n    query SpexCategoryPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexCategorySummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.SpexCategoryPagedSummaryDocument,
    "\n    query SpexCategoryPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexCategoryFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.SpexCategoryPagedFullDocument,
    "\n    mutation SpexCategoryCreate($input: SpexCategoryCreate!) {\n        spexCategoryCreate(input: $input) { ...SpexCategoryFull }\n    }\n": typeof types.SpexCategoryCreateDocument,
    "\n    mutation SpexCategoryUpdate($input: SpexCategoryUpdate!) {\n        spexCategoryUpdate(input: $input) { ...SpexCategoryFull }\n    }\n": typeof types.SpexCategoryUpdateDocument,
    "\n    mutation SpexCategoryDelete($id: ID!) {\n        spexCategoryDelete(id: $id)\n    }\n": typeof types.SpexCategoryDeleteDocument,
    "\n    query SpexCategoryExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        spexCategoryExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": typeof types.SpexCategoryExportDocument,
    "\n    query SpexCategoryEvents($sourceId: ID!) {\n        spexCategoryEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": typeof types.SpexCategoryEventsDocument,
    "\n    fragment SpexSummary on Spex {\n        id\n        year\n        title\n        posterUrl\n        revival\n        revivals {\n            id\n            year\n        }\n        category {\n            id\n            name\n        }\n    }\n": typeof types.SpexSummaryFragmentDoc,
    "\n    fragment SpexFull on Spex {\n        ...SpexSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.SpexFullFragmentDoc,
    "\n    query SpexPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.SpexPagedSummaryDocument,
    "\n    query SpexPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.SpexPagedFullDocument,
    "\n    mutation SpexCreate($input: SpexCreate!) {\n        spexCreate(input: $input) { ...SpexFull }\n    }\n": typeof types.SpexCreateDocument,
    "\n    mutation SpexUpdate($input: SpexUpdate!) {\n        spexUpdate(input: $input) { ...SpexFull }\n    }\n": typeof types.SpexUpdateDocument,
    "\n    mutation SpexDelete($id: ID!) {\n        spexDelete(id: $id)\n    }\n": typeof types.SpexDeleteDocument,
    "\n    query SpexExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        spexExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": typeof types.SpexExportDocument,
    "\n    query SpexEvents($sourceId: ID!) {\n        spexEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": typeof types.SpexEventsDocument,
    "\n    mutation SpexCategoryAdd($id: ID!, $categoryId: ID!) {\n        spexCategoryAdd(spexId: $id, id: $categoryId)\n    }\n": typeof types.SpexCategoryAddDocument,
    "\n    mutation SpexCategoryRemove($id: ID!) {\n        spexCategoryRemove(spexId: $id)\n    }\n": typeof types.SpexCategoryRemoveDocument,
    "\n    mutation SpexRevivalCreate($spexId: ID!, $year: Year!) {\n        spexRevivalCreate(spexId: $spexId, year: $year) {\n            id\n            year\n        }\n    }\n": typeof types.SpexRevivalCreateDocument,
    "\n    mutation SpexRevivalDelete($id: ID!, $spexId: ID!) {\n        spexRevivalDelete(spexId: $spexId, id: $id)\n    }\n": typeof types.SpexRevivalDeleteDocument,
    "\n    fragment ActivityBase on Activity {\n        id\n    }\n": typeof types.ActivityBaseFragmentDoc,
    "\n    fragment ActivitySummary on Activity {\n        ...ActivityBase\n        spexActivity {\n            ...SpexActivitySummary\n        }\n        taskActivities {\n            ...TaskActivitySummary\n        }\n    }\n": typeof types.ActivitySummaryFragmentDoc,
    "\n    fragment ActivityFull on Activity {\n        ...ActivityBase\n        spexActivity {\n            ...SpexActivityFull\n        }\n        taskActivities {\n            ...TaskActivityFull\n        }\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.ActivityFullFragmentDoc,
    "\n    mutation ActivityCreate($spexareId: ID!) {\n        activityCreate(spexareId: $spexareId) {\n            ...ActivityFull\n        }\n    }\n": typeof types.ActivityCreateDocument,
    "\n    mutation ActivityDelete($spexareId: ID!, $id: ID!) {\n        activityDelete(spexareId: $spexareId, id: $id)\n    }\n": typeof types.ActivityDeleteDocument,
    "\n    fragment SpexActivityBase on SpexActivity {\n        id\n        spex {\n            id\n            year\n            title\n            revival\n            category {\n                name\n            }\n        }\n    }\n": typeof types.SpexActivityBaseFragmentDoc,
    "\n    fragment SpexActivitySummary on SpexActivity {\n        ...SpexActivityBase\n    }\n": typeof types.SpexActivitySummaryFragmentDoc,
    "\n    fragment SpexActivityFull on SpexActivity {\n        ...SpexActivityBase\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.SpexActivityFullFragmentDoc,
    "\n    mutation SpexActivityCreate($spexareId: ID!, $activityId: ID!, $spexId: ID!) {\n        spexActivityCreate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId) {\n            ...SpexActivityFull\n        }\n    }\n": typeof types.SpexActivityCreateDocument,
    "\n    mutation SpexActivityUpdate($spexareId: ID!, $activityId: ID!, $spexId: ID!, $id: ID!) {\n        spexActivityUpdate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId, id: $id) {\n            ...SpexActivityFull\n        }\n    }\n": typeof types.SpexActivityUpdateDocument,
    "\n    mutation SpexActivityDelete($spexareId: ID!, $activityId: ID!, $id: ID!) {\n        spexActivityDelete(spexareId: $spexareId, activityId: $activityId, id: $id)\n    }\n": typeof types.SpexActivityDeleteDocument,
    "\n    fragment ActorSummary on Actor {\n        id\n        role\n        vocal {\n            id\n            label\n        }\n    }\n": typeof types.ActorSummaryFragmentDoc,
    "\n    fragment ActorFull on Actor {\n        ...ActorSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.ActorFullFragmentDoc,
    "\n    mutation ActorCreate($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorCreate!) {\n        actorCreate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input) {\n            ...ActorFull\n        }\n    }\n": typeof types.ActorCreateDocument,
    "\n    mutation ActorUpdate($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorUpdate!) {\n        actorUpdate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input) {\n            ...ActorFull\n        }\n    }\n": typeof types.ActorUpdateDocument,
    "\n    mutation ActorDelete($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $id: ID!) {\n        actorDelete(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, id: $id)\n    }\n": typeof types.ActorDeleteDocument,
    "\n    fragment TaskActivityBase on TaskActivity {\n        id\n        task {\n            id\n            name\n            category {\n                name\n                actorPresent\n            }\n        }\n    }\n": typeof types.TaskActivityBaseFragmentDoc,
    "\n    fragment TaskActivitySummary on TaskActivity {\n        ...TaskActivityBase\n        actors {\n            ...ActorSummary\n        }\n    }\n": typeof types.TaskActivitySummaryFragmentDoc,
    "\n    fragment TaskActivityFull on TaskActivity {\n        ...TaskActivityBase\n        actors {\n            ...ActorFull\n        }\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.TaskActivityFullFragmentDoc,
    "\n    mutation TaskActivityCreate($spexareId: ID!, $activityId: ID!, $taskId: ID!) {\n        taskActivityCreate(spexareId: $spexareId, activityId: $activityId, taskId: $taskId) {\n            ...TaskActivityFull\n        }\n    }\n": typeof types.TaskActivityCreateDocument,
    "\n    mutation TaskActivityUpdate($spexareId: ID!, $activityId: ID!, $taskId: ID!, $id: ID!) {\n        taskActivityUpdate(spexareId: $spexareId, activityId: $activityId, taskId: $taskId, id: $id) {\n            ...TaskActivityFull\n        }\n    }\n": typeof types.TaskActivityUpdateDocument,
    "\n    mutation TaskActivityDelete($spexareId: ID!, $activityId: ID!, $id: ID!) {\n        taskActivityDelete(spexareId: $spexareId, activityId: $activityId, id: $id)\n    }\n": typeof types.TaskActivityDeleteDocument,
    "\n    fragment AddressSummary on Address {\n        id\n        streetAddress\n        postalCode\n        city\n        country\n        phone\n        phoneMobile\n        emailAddress\n        type {\n            id\n            label\n        }\n    }\n": typeof types.AddressSummaryFragmentDoc,
    "\n    fragment AddressFull on Address {\n        ...AddressSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.AddressFullFragmentDoc,
    "\n    mutation AddressCreate($spexareId: ID!, $typeId: ID!, $input: AddressCreate!) {\n        addressCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...AddressFull\n        }\n    }\n": typeof types.AddressCreateDocument,
    "\n    mutation AddressUpdate($spexareId: ID!, $typeId: ID!, $input: AddressUpdate!) {\n        addressUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...AddressFull\n        }\n    }\n": typeof types.AddressUpdateDocument,
    "\n    mutation AddressDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        addressDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n": typeof types.AddressDeleteDocument,
    "\n    fragment ConsentSummary on Consent {\n        id\n        value\n        type {\n            id\n            label\n        }\n    }\n": typeof types.ConsentSummaryFragmentDoc,
    "\n    fragment ConsentFull on Consent {\n        ...ConsentSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.ConsentFullFragmentDoc,
    "\n    mutation ConsentCreate($spexareId: ID!, $typeId: ID!, $input: ConsentCreate!) {\n        consentCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ConsentFull\n        }\n    }\n": typeof types.ConsentCreateDocument,
    "\n    mutation ConsentUpdate($spexareId: ID!, $typeId: ID!, $input: ConsentUpdate!) {\n        consentUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ConsentFull\n        }\n    }\n": typeof types.ConsentUpdateDocument,
    "\n    mutation ConsentDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        consentDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n": typeof types.ConsentDeleteDocument,
    "\n    fragment MembershipSummary on Membership {\n        id\n        year\n        type {\n            id\n            label\n        }\n    }\n": typeof types.MembershipSummaryFragmentDoc,
    "\n    fragment MembershipFull on Membership {\n        ...MembershipSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.MembershipFullFragmentDoc,
    "\n    mutation MembershipCreate($spexareId: ID!, $typeId: ID!, $input: MembershipCreate!) {\n        membershipCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...MembershipFull\n        }\n    }\n": typeof types.MembershipCreateDocument,
    "\n    mutation MembershipDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        membershipDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n": typeof types.MembershipDeleteDocument,
    "\n    fragment SpexareBase on Spexare {\n        id\n        firstName\n        lastName\n        nickName\n        socialSecurityNumber\n        deceased\n        published\n        graduation\n        comment\n        imageUrl\n        partner {\n            id\n            firstName\n            lastName\n            nickName\n            deceased\n            published\n            imageUrl\n        }\n    }\n": typeof types.SpexareBaseFragmentDoc,
    "\n    fragment SpexareSummary on Spexare {\n        ...SpexareBase\n    }\n": typeof types.SpexareSummaryFragmentDoc,
    "\n    fragment SpexareFull on Spexare {\n        ...SpexareBase\n        activities {\n            ...ActivityFull\n        }\n        addresses {\n            ...AddressFull\n        }\n        consents {\n            ...ConsentFull\n        }\n        memberships {\n            ...MembershipFull\n        }\n        taggings {\n            ...TaggingFull\n        }\n        toggles {\n            ...ToggleFull\n        }\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.SpexareFullFragmentDoc,
    "\n    query SpexarePagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexarePaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexareSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.SpexarePagedSummaryDocument,
    "\n    query SpexarePagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexarePaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexareFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.SpexarePagedFullDocument,
    "\n    mutation SpexareCreate($input: SpexareCreate!) {\n        spexareCreate(input: $input) { ...SpexareFull }\n    }\n": typeof types.SpexareCreateDocument,
    "\n    mutation SpexareUpdate($input: SpexareUpdate!) {\n        spexareUpdate(input: $input) { ...SpexareFull }\n    }\n": typeof types.SpexareUpdateDocument,
    "\n    mutation SpexareDelete($id: ID!) {\n        spexareDelete(id: $id)\n    }\n": typeof types.SpexareDeleteDocument,
    "\n    query SpexareEvents($sourceId: ID!) {\n        spexareEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": typeof types.SpexareEventsDocument,
    "\n    query SpexareGet($id: ID!) {\n        spexare(id: $id) { ...SpexareFull }\n    }\n": typeof types.SpexareGetDocument,
    "\n    mutation SpexarePartnerAdd($spexareId: ID!, $id: ID!) {\n        spexarePartnerAdd(spexareId: $spexareId, id: $id)\n    }\n": typeof types.SpexarePartnerAddDocument,
    "\n    mutation SpexarePartnerRemove($spexareId: ID!) {\n        spexarePartnerRemove(spexareId: $spexareId)\n    }\n": typeof types.SpexarePartnerRemoveDocument,
    "\n    query SpexareExport($ids: [ID], $filter: String, $type: ImpexType!, $reportType: ReportType) {\n        spexareExport(ids: $ids, filter: $filter, type: $type, reportType: $reportType) { id }\n    }\n": typeof types.SpexareExportDocument,
    "\n    query SpexareSearch($q: String!, $aggregationFilters: [AggregationFilterInput], $limit: Int, $offset: Int, $sort: [String], $direction: SortDirection) {\n        spexareSearchPaged(q: $q, aggregationFilters: $aggregationFilters, limit: $limit, offset: $offset, sort: $sort, direction: $direction) {\n            edges { cursor node { ...SpexareSummary } }\n            facets {\n                id\n                label\n                groups {\n                    id\n                    label\n                    values {\n                        id\n                        label\n                        count\n                    }\n                }\n            }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.SpexareSearchDocument,
    "\n    fragment TaggingSummary on Tag {\n        id\n        name\n    }\n": typeof types.TaggingSummaryFragmentDoc,
    "\n    fragment TaggingFull on Tag {\n        ...TaggingSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.TaggingFullFragmentDoc,
    "\n    mutation TaggingCreate($spexareId: ID!, $tagId: ID!) {\n        taggingCreate(spexareId: $spexareId, tagId: $tagId)\n    }\n": typeof types.TaggingCreateDocument,
    "\n    mutation TaggingDelete($spexareId: ID!, $tagId: ID!) {\n        taggingDelete(spexareId: $spexareId, tagId: $tagId)\n    }\n": typeof types.TaggingDeleteDocument,
    "\n    fragment ToggleSummary on Toggle {\n        id\n        value\n        type {\n            id\n            label\n        }\n    }\n": typeof types.ToggleSummaryFragmentDoc,
    "\n    fragment ToggleFull on Toggle {\n        ...ToggleSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.ToggleFullFragmentDoc,
    "\n    mutation ToggleCreate($spexareId: ID!, $typeId: ID!, $input: ToggleCreate!) {\n        toggleCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ToggleFull\n        }\n    }\n": typeof types.ToggleCreateDocument,
    "\n    mutation ToggleUpdate($spexareId: ID!, $typeId: ID!, $input: ToggleUpdate!) {\n        toggleUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ToggleFull\n        }\n    }\n": typeof types.ToggleUpdateDocument,
    "\n    mutation ToggleDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        toggleDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n": typeof types.ToggleDeleteDocument,
    "\n    fragment StatisticsFields on Statistics {\n        spexareCount\n        spexareCountHistory {\n            label\n            count\n        }\n        userCount\n        userCountHistory {\n            label\n            count\n        }\n        spexCount\n        spexCountHistory {\n            label\n            count\n        }\n        spexRevivalCount\n        spexRevivalCountHistory {\n            label\n            count\n        }\n        taskCount\n        taskCountHistory {\n            label\n            count\n        }\n    }\n": typeof types.StatisticsFieldsFragmentDoc,
    "\n    query Statistics {\n        statistics {\n            ...StatisticsFields\n        }\n    }\n": typeof types.StatisticsDocument,
    "\n    fragment TagSummary on Tag {\n        id\n        name\n    }\n": typeof types.TagSummaryFragmentDoc,
    "\n    fragment TagFull on Tag {\n        ...TagSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.TagFullFragmentDoc,
    "\n    query TagPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        tagPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TagSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.TagPagedSummaryDocument,
    "\n    query TagPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        tagPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TagFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.TagPagedFullDocument,
    "\n    mutation TagCreate($input: TagCreate!) {\n        tagCreate(input: $input) { ...TagFull }\n    }\n": typeof types.TagCreateDocument,
    "\n    mutation TagUpdate($input: TagUpdate!) {\n        tagUpdate(input: $input) { ...TagFull }\n    }\n": typeof types.TagUpdateDocument,
    "\n    mutation TagDelete($id: ID!) {\n        tagDelete(id: $id)\n    }\n": typeof types.TagDeleteDocument,
    "\n    query TagExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        tagExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": typeof types.TagExportDocument,
    "\n    query TagEvents($sourceId: ID!) {\n        tagEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": typeof types.TagEventsDocument,
    "\n    fragment TaskCategorySummary on TaskCategory {\n        id\n        name\n        actorPresent\n    }\n": typeof types.TaskCategorySummaryFragmentDoc,
    "\n    fragment TaskCategoryFull on TaskCategory {\n        ...TaskCategorySummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.TaskCategoryFullFragmentDoc,
    "\n    query TaskCategoryPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskCategorySummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.TaskCategoryPagedSummaryDocument,
    "\n    query TaskCategoryPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskCategoryFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.TaskCategoryPagedFullDocument,
    "\n    mutation TaskCategoryCreate($input: TaskCategoryCreate!) {\n        taskCategoryCreate(input: $input) { ...TaskCategoryFull }\n    }\n": typeof types.TaskCategoryCreateDocument,
    "\n    mutation TaskCategoryUpdate($input: TaskCategoryUpdate!) {\n        taskCategoryUpdate(input: $input) { ...TaskCategoryFull }\n    }\n": typeof types.TaskCategoryUpdateDocument,
    "\n    mutation TaskCategoryDelete($id: ID!) {\n        taskCategoryDelete(id: $id)\n    }\n": typeof types.TaskCategoryDeleteDocument,
    "\n    query TaskCategoryExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        taskCategoryExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": typeof types.TaskCategoryExportDocument,
    "\n    query TaskCategoryEvents($sourceId: ID!) {\n        taskCategoryEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": typeof types.TaskCategoryEventsDocument,
    "\n    fragment TaskSummary on Task {\n        id\n        name\n        category {\n            id\n            name\n            actorPresent\n        }\n    }\n": typeof types.TaskSummaryFragmentDoc,
    "\n    fragment TaskFull on Task {\n        ...TaskSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.TaskFullFragmentDoc,
    "\n    query TaskPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.TaskPagedSummaryDocument,
    "\n    query TaskPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.TaskPagedFullDocument,
    "\n    mutation TaskCreate($input: TaskCreate!) {\n        taskCreate(input: $input) { ...TaskFull }\n    }\n": typeof types.TaskCreateDocument,
    "\n    mutation TaskUpdate($input: TaskUpdate!) {\n        taskUpdate(input: $input) { ...TaskFull }\n    }\n": typeof types.TaskUpdateDocument,
    "\n    mutation TaskDelete($id: ID!) {\n        taskDelete(id: $id)\n    }\n": typeof types.TaskDeleteDocument,
    "\n    query TaskExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        taskExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": typeof types.TaskExportDocument,
    "\n    query TaskEvents($sourceId: ID!) {\n        taskEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": typeof types.TaskEventsDocument,
    "\n    mutation TaskCategoryAdd($id: ID!, $categoryId: ID!) {\n        taskCategoryAdd(taskId: $id, id: $categoryId)\n    }\n": typeof types.TaskCategoryAddDocument,
    "\n    mutation TaskCategoryRemove($id: ID!) {\n        taskCategoryRemove(taskId: $id)\n    }\n": typeof types.TaskCategoryRemoveDocument,
    "\n    fragment UserSummary on User {\n        id\n        externalId\n        email\n        authorities {\n            id\n            label\n        }\n        state {\n            id\n            label\n        }\n        spexare {\n            id\n            firstName\n            lastName\n            nickName\n        }\n    }\n": typeof types.UserSummaryFragmentDoc,
    "\n    fragment UserFull on User {\n        ...UserSummary\n        temporaryPassword\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": typeof types.UserFullFragmentDoc,
    "\n    query UserPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        userPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...UserSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.UserPagedSummaryDocument,
    "\n    query UserPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        userPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...UserFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": typeof types.UserPagedFullDocument,
    "\n    mutation UserCreate($input: UserCreate!) {\n        userCreate(input: $input) { ...UserFull }\n    }\n": typeof types.UserCreateDocument,
    "\n    mutation UserUpdate($input: UserUpdate!) {\n        userUpdate(input: $input) { ...UserFull }\n    }\n": typeof types.UserUpdateDocument,
    "\n    mutation UserDelete($id: ID!) {\n        userDelete(id: $id)\n    }\n": typeof types.UserDeleteDocument,
    "\n    query UserExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        userExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": typeof types.UserExportDocument,
    "\n    query UserEvents($sourceId: ID!) {\n        userEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": typeof types.UserEventsDocument,
    "\n    mutation UserAuthoritiesAdd($userId: ID!, $ids: [ID]!) {\n        userAuthoritiesAdd(userId: $userId, ids: $ids)\n    }\n": typeof types.UserAuthoritiesAddDocument,
    "\n    mutation UserAuthoritiesRemove($userId: ID!, $ids: [ID]!) {\n        userAuthoritiesRemove(userId: $userId, ids: $ids)\n    }\n": typeof types.UserAuthoritiesRemoveDocument,
    "\n    mutation UserStateSet($userId: ID!, $id: ID!) {\n        userStateSet(userId: $userId, id: $id)\n    }\n": typeof types.UserStateSetDocument,
    "\n    mutation UserSpexareAdd($userId: ID!, $id: ID!) {\n        userSpexareAdd(userId: $userId, id: $id)\n    }\n": typeof types.UserSpexareAddDocument,
    "\n    mutation UserSpexareRemove($userId: ID!) {\n        userSpexareRemove(userId: $userId)\n    }\n": typeof types.UserSpexareRemoveDocument,
    "\n    query UserMe {\n        me {\n            spexare {\n                ...SpexareFull\n            }\n        }\n    }\n": typeof types.UserMeDocument,
    "\n    query Authorities {\n        authorities {\n            id\n            label\n        }\n    }\n": typeof types.AuthoritiesDocument,
    "\n    query States {\n        states {\n            id\n            label\n        }\n    }\n": typeof types.StatesDocument,
};
const documents: Documents = {
    "\n    fragment JobStatusFields on JobStatus {\n        id\n        name\n        status\n        exitStatus\n    }\n": types.JobStatusFieldsFragmentDoc,
    "\n    fragment JobFields on Job {\n        id\n        name\n        status\n        exitStatus\n        createdAt\n        startedAt\n        finishedAt\n        hasDownload\n        importResult {\n            success\n            errors\n            messages\n            data\n        }\n    }\n": types.JobFieldsFragmentDoc,
    "\n    query JobStatus($id: ID!) {\n        jobStatus(id: $id) {\n            ...JobStatusFields\n        }\n    }\n": types.JobStatusDocument,
    "\n    query JobById($id: ID!) {\n        job(id: $id) {\n            ...JobFields\n        }\n    }\n": types.JobByIdDocument,
    "\n    query Jobs {\n        jobs {\n            ...JobFields\n        }\n    }\n": types.JobsDocument,
    "\n    mutation JobDelete($id: ID!) {\n        jobDelete(id: $id)\n    }\n": types.JobDeleteDocument,
    "\n    fragment NewsSummary on News {\n        id\n        subject\n        text\n        visibleFrom\n    }\n": types.NewsSummaryFragmentDoc,
    "\n    fragment NewsFull on News {\n        ...NewsSummary\n        published\n        visibleTo\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.NewsFullFragmentDoc,
    "\n    query NewsPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        newsPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...NewsSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.NewsPagedSummaryDocument,
    "\n    query NewsPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        newsPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...NewsFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.NewsPagedFullDocument,
    "\n    mutation NewsCreate($input: NewsCreate!) {\n        newsCreate(input: $input) { ...NewsFull }\n    }\n": types.NewsCreateDocument,
    "\n    mutation NewsUpdate($input: NewsUpdate!) {\n        newsUpdate(input: $input) { ...NewsFull }\n    }\n": types.NewsUpdateDocument,
    "\n    mutation NewsDelete($id: ID!) {\n        newsDelete(id: $id)\n    }\n": types.NewsDeleteDocument,
    "\n    query NewsExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        newsExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": types.NewsExportDocument,
    "\n    query NewsEvents($sourceId: ID!) {\n        newsEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": types.NewsEventsDocument,
    "\n    query Countries {\n        countries {\n            isoCode\n            label\n        }\n    }\n": types.CountriesDocument,
    "\n    query Types {\n        types {\n            id\n            label\n            type\n        }\n    }\n": types.TypesDocument,
    "\n    fragment SpexCategorySummary on SpexCategory {\n        id\n        name\n        logoUrl\n        firstYear\n    }\n": types.SpexCategorySummaryFragmentDoc,
    "\n    fragment SpexCategoryFull on SpexCategory {\n        ...SpexCategorySummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.SpexCategoryFullFragmentDoc,
    "\n    query SpexCategoryPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexCategorySummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.SpexCategoryPagedSummaryDocument,
    "\n    query SpexCategoryPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexCategoryFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.SpexCategoryPagedFullDocument,
    "\n    mutation SpexCategoryCreate($input: SpexCategoryCreate!) {\n        spexCategoryCreate(input: $input) { ...SpexCategoryFull }\n    }\n": types.SpexCategoryCreateDocument,
    "\n    mutation SpexCategoryUpdate($input: SpexCategoryUpdate!) {\n        spexCategoryUpdate(input: $input) { ...SpexCategoryFull }\n    }\n": types.SpexCategoryUpdateDocument,
    "\n    mutation SpexCategoryDelete($id: ID!) {\n        spexCategoryDelete(id: $id)\n    }\n": types.SpexCategoryDeleteDocument,
    "\n    query SpexCategoryExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        spexCategoryExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": types.SpexCategoryExportDocument,
    "\n    query SpexCategoryEvents($sourceId: ID!) {\n        spexCategoryEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": types.SpexCategoryEventsDocument,
    "\n    fragment SpexSummary on Spex {\n        id\n        year\n        title\n        posterUrl\n        revival\n        revivals {\n            id\n            year\n        }\n        category {\n            id\n            name\n        }\n    }\n": types.SpexSummaryFragmentDoc,
    "\n    fragment SpexFull on Spex {\n        ...SpexSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.SpexFullFragmentDoc,
    "\n    query SpexPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.SpexPagedSummaryDocument,
    "\n    query SpexPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.SpexPagedFullDocument,
    "\n    mutation SpexCreate($input: SpexCreate!) {\n        spexCreate(input: $input) { ...SpexFull }\n    }\n": types.SpexCreateDocument,
    "\n    mutation SpexUpdate($input: SpexUpdate!) {\n        spexUpdate(input: $input) { ...SpexFull }\n    }\n": types.SpexUpdateDocument,
    "\n    mutation SpexDelete($id: ID!) {\n        spexDelete(id: $id)\n    }\n": types.SpexDeleteDocument,
    "\n    query SpexExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        spexExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": types.SpexExportDocument,
    "\n    query SpexEvents($sourceId: ID!) {\n        spexEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": types.SpexEventsDocument,
    "\n    mutation SpexCategoryAdd($id: ID!, $categoryId: ID!) {\n        spexCategoryAdd(spexId: $id, id: $categoryId)\n    }\n": types.SpexCategoryAddDocument,
    "\n    mutation SpexCategoryRemove($id: ID!) {\n        spexCategoryRemove(spexId: $id)\n    }\n": types.SpexCategoryRemoveDocument,
    "\n    mutation SpexRevivalCreate($spexId: ID!, $year: Year!) {\n        spexRevivalCreate(spexId: $spexId, year: $year) {\n            id\n            year\n        }\n    }\n": types.SpexRevivalCreateDocument,
    "\n    mutation SpexRevivalDelete($id: ID!, $spexId: ID!) {\n        spexRevivalDelete(spexId: $spexId, id: $id)\n    }\n": types.SpexRevivalDeleteDocument,
    "\n    fragment ActivityBase on Activity {\n        id\n    }\n": types.ActivityBaseFragmentDoc,
    "\n    fragment ActivitySummary on Activity {\n        ...ActivityBase\n        spexActivity {\n            ...SpexActivitySummary\n        }\n        taskActivities {\n            ...TaskActivitySummary\n        }\n    }\n": types.ActivitySummaryFragmentDoc,
    "\n    fragment ActivityFull on Activity {\n        ...ActivityBase\n        spexActivity {\n            ...SpexActivityFull\n        }\n        taskActivities {\n            ...TaskActivityFull\n        }\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.ActivityFullFragmentDoc,
    "\n    mutation ActivityCreate($spexareId: ID!) {\n        activityCreate(spexareId: $spexareId) {\n            ...ActivityFull\n        }\n    }\n": types.ActivityCreateDocument,
    "\n    mutation ActivityDelete($spexareId: ID!, $id: ID!) {\n        activityDelete(spexareId: $spexareId, id: $id)\n    }\n": types.ActivityDeleteDocument,
    "\n    fragment SpexActivityBase on SpexActivity {\n        id\n        spex {\n            id\n            year\n            title\n            revival\n            category {\n                name\n            }\n        }\n    }\n": types.SpexActivityBaseFragmentDoc,
    "\n    fragment SpexActivitySummary on SpexActivity {\n        ...SpexActivityBase\n    }\n": types.SpexActivitySummaryFragmentDoc,
    "\n    fragment SpexActivityFull on SpexActivity {\n        ...SpexActivityBase\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.SpexActivityFullFragmentDoc,
    "\n    mutation SpexActivityCreate($spexareId: ID!, $activityId: ID!, $spexId: ID!) {\n        spexActivityCreate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId) {\n            ...SpexActivityFull\n        }\n    }\n": types.SpexActivityCreateDocument,
    "\n    mutation SpexActivityUpdate($spexareId: ID!, $activityId: ID!, $spexId: ID!, $id: ID!) {\n        spexActivityUpdate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId, id: $id) {\n            ...SpexActivityFull\n        }\n    }\n": types.SpexActivityUpdateDocument,
    "\n    mutation SpexActivityDelete($spexareId: ID!, $activityId: ID!, $id: ID!) {\n        spexActivityDelete(spexareId: $spexareId, activityId: $activityId, id: $id)\n    }\n": types.SpexActivityDeleteDocument,
    "\n    fragment ActorSummary on Actor {\n        id\n        role\n        vocal {\n            id\n            label\n        }\n    }\n": types.ActorSummaryFragmentDoc,
    "\n    fragment ActorFull on Actor {\n        ...ActorSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.ActorFullFragmentDoc,
    "\n    mutation ActorCreate($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorCreate!) {\n        actorCreate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input) {\n            ...ActorFull\n        }\n    }\n": types.ActorCreateDocument,
    "\n    mutation ActorUpdate($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorUpdate!) {\n        actorUpdate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input) {\n            ...ActorFull\n        }\n    }\n": types.ActorUpdateDocument,
    "\n    mutation ActorDelete($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $id: ID!) {\n        actorDelete(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, id: $id)\n    }\n": types.ActorDeleteDocument,
    "\n    fragment TaskActivityBase on TaskActivity {\n        id\n        task {\n            id\n            name\n            category {\n                name\n                actorPresent\n            }\n        }\n    }\n": types.TaskActivityBaseFragmentDoc,
    "\n    fragment TaskActivitySummary on TaskActivity {\n        ...TaskActivityBase\n        actors {\n            ...ActorSummary\n        }\n    }\n": types.TaskActivitySummaryFragmentDoc,
    "\n    fragment TaskActivityFull on TaskActivity {\n        ...TaskActivityBase\n        actors {\n            ...ActorFull\n        }\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.TaskActivityFullFragmentDoc,
    "\n    mutation TaskActivityCreate($spexareId: ID!, $activityId: ID!, $taskId: ID!) {\n        taskActivityCreate(spexareId: $spexareId, activityId: $activityId, taskId: $taskId) {\n            ...TaskActivityFull\n        }\n    }\n": types.TaskActivityCreateDocument,
    "\n    mutation TaskActivityUpdate($spexareId: ID!, $activityId: ID!, $taskId: ID!, $id: ID!) {\n        taskActivityUpdate(spexareId: $spexareId, activityId: $activityId, taskId: $taskId, id: $id) {\n            ...TaskActivityFull\n        }\n    }\n": types.TaskActivityUpdateDocument,
    "\n    mutation TaskActivityDelete($spexareId: ID!, $activityId: ID!, $id: ID!) {\n        taskActivityDelete(spexareId: $spexareId, activityId: $activityId, id: $id)\n    }\n": types.TaskActivityDeleteDocument,
    "\n    fragment AddressSummary on Address {\n        id\n        streetAddress\n        postalCode\n        city\n        country\n        phone\n        phoneMobile\n        emailAddress\n        type {\n            id\n            label\n        }\n    }\n": types.AddressSummaryFragmentDoc,
    "\n    fragment AddressFull on Address {\n        ...AddressSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.AddressFullFragmentDoc,
    "\n    mutation AddressCreate($spexareId: ID!, $typeId: ID!, $input: AddressCreate!) {\n        addressCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...AddressFull\n        }\n    }\n": types.AddressCreateDocument,
    "\n    mutation AddressUpdate($spexareId: ID!, $typeId: ID!, $input: AddressUpdate!) {\n        addressUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...AddressFull\n        }\n    }\n": types.AddressUpdateDocument,
    "\n    mutation AddressDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        addressDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n": types.AddressDeleteDocument,
    "\n    fragment ConsentSummary on Consent {\n        id\n        value\n        type {\n            id\n            label\n        }\n    }\n": types.ConsentSummaryFragmentDoc,
    "\n    fragment ConsentFull on Consent {\n        ...ConsentSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.ConsentFullFragmentDoc,
    "\n    mutation ConsentCreate($spexareId: ID!, $typeId: ID!, $input: ConsentCreate!) {\n        consentCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ConsentFull\n        }\n    }\n": types.ConsentCreateDocument,
    "\n    mutation ConsentUpdate($spexareId: ID!, $typeId: ID!, $input: ConsentUpdate!) {\n        consentUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ConsentFull\n        }\n    }\n": types.ConsentUpdateDocument,
    "\n    mutation ConsentDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        consentDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n": types.ConsentDeleteDocument,
    "\n    fragment MembershipSummary on Membership {\n        id\n        year\n        type {\n            id\n            label\n        }\n    }\n": types.MembershipSummaryFragmentDoc,
    "\n    fragment MembershipFull on Membership {\n        ...MembershipSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.MembershipFullFragmentDoc,
    "\n    mutation MembershipCreate($spexareId: ID!, $typeId: ID!, $input: MembershipCreate!) {\n        membershipCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...MembershipFull\n        }\n    }\n": types.MembershipCreateDocument,
    "\n    mutation MembershipDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        membershipDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n": types.MembershipDeleteDocument,
    "\n    fragment SpexareBase on Spexare {\n        id\n        firstName\n        lastName\n        nickName\n        socialSecurityNumber\n        deceased\n        published\n        graduation\n        comment\n        imageUrl\n        partner {\n            id\n            firstName\n            lastName\n            nickName\n            deceased\n            published\n            imageUrl\n        }\n    }\n": types.SpexareBaseFragmentDoc,
    "\n    fragment SpexareSummary on Spexare {\n        ...SpexareBase\n    }\n": types.SpexareSummaryFragmentDoc,
    "\n    fragment SpexareFull on Spexare {\n        ...SpexareBase\n        activities {\n            ...ActivityFull\n        }\n        addresses {\n            ...AddressFull\n        }\n        consents {\n            ...ConsentFull\n        }\n        memberships {\n            ...MembershipFull\n        }\n        taggings {\n            ...TaggingFull\n        }\n        toggles {\n            ...ToggleFull\n        }\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.SpexareFullFragmentDoc,
    "\n    query SpexarePagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexarePaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexareSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.SpexarePagedSummaryDocument,
    "\n    query SpexarePagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexarePaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexareFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.SpexarePagedFullDocument,
    "\n    mutation SpexareCreate($input: SpexareCreate!) {\n        spexareCreate(input: $input) { ...SpexareFull }\n    }\n": types.SpexareCreateDocument,
    "\n    mutation SpexareUpdate($input: SpexareUpdate!) {\n        spexareUpdate(input: $input) { ...SpexareFull }\n    }\n": types.SpexareUpdateDocument,
    "\n    mutation SpexareDelete($id: ID!) {\n        spexareDelete(id: $id)\n    }\n": types.SpexareDeleteDocument,
    "\n    query SpexareEvents($sourceId: ID!) {\n        spexareEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": types.SpexareEventsDocument,
    "\n    query SpexareGet($id: ID!) {\n        spexare(id: $id) { ...SpexareFull }\n    }\n": types.SpexareGetDocument,
    "\n    mutation SpexarePartnerAdd($spexareId: ID!, $id: ID!) {\n        spexarePartnerAdd(spexareId: $spexareId, id: $id)\n    }\n": types.SpexarePartnerAddDocument,
    "\n    mutation SpexarePartnerRemove($spexareId: ID!) {\n        spexarePartnerRemove(spexareId: $spexareId)\n    }\n": types.SpexarePartnerRemoveDocument,
    "\n    query SpexareExport($ids: [ID], $filter: String, $type: ImpexType!, $reportType: ReportType) {\n        spexareExport(ids: $ids, filter: $filter, type: $type, reportType: $reportType) { id }\n    }\n": types.SpexareExportDocument,
    "\n    query SpexareSearch($q: String!, $aggregationFilters: [AggregationFilterInput], $limit: Int, $offset: Int, $sort: [String], $direction: SortDirection) {\n        spexareSearchPaged(q: $q, aggregationFilters: $aggregationFilters, limit: $limit, offset: $offset, sort: $sort, direction: $direction) {\n            edges { cursor node { ...SpexareSummary } }\n            facets {\n                id\n                label\n                groups {\n                    id\n                    label\n                    values {\n                        id\n                        label\n                        count\n                    }\n                }\n            }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.SpexareSearchDocument,
    "\n    fragment TaggingSummary on Tag {\n        id\n        name\n    }\n": types.TaggingSummaryFragmentDoc,
    "\n    fragment TaggingFull on Tag {\n        ...TaggingSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.TaggingFullFragmentDoc,
    "\n    mutation TaggingCreate($spexareId: ID!, $tagId: ID!) {\n        taggingCreate(spexareId: $spexareId, tagId: $tagId)\n    }\n": types.TaggingCreateDocument,
    "\n    mutation TaggingDelete($spexareId: ID!, $tagId: ID!) {\n        taggingDelete(spexareId: $spexareId, tagId: $tagId)\n    }\n": types.TaggingDeleteDocument,
    "\n    fragment ToggleSummary on Toggle {\n        id\n        value\n        type {\n            id\n            label\n        }\n    }\n": types.ToggleSummaryFragmentDoc,
    "\n    fragment ToggleFull on Toggle {\n        ...ToggleSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.ToggleFullFragmentDoc,
    "\n    mutation ToggleCreate($spexareId: ID!, $typeId: ID!, $input: ToggleCreate!) {\n        toggleCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ToggleFull\n        }\n    }\n": types.ToggleCreateDocument,
    "\n    mutation ToggleUpdate($spexareId: ID!, $typeId: ID!, $input: ToggleUpdate!) {\n        toggleUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ToggleFull\n        }\n    }\n": types.ToggleUpdateDocument,
    "\n    mutation ToggleDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        toggleDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n": types.ToggleDeleteDocument,
    "\n    fragment StatisticsFields on Statistics {\n        spexareCount\n        spexareCountHistory {\n            label\n            count\n        }\n        userCount\n        userCountHistory {\n            label\n            count\n        }\n        spexCount\n        spexCountHistory {\n            label\n            count\n        }\n        spexRevivalCount\n        spexRevivalCountHistory {\n            label\n            count\n        }\n        taskCount\n        taskCountHistory {\n            label\n            count\n        }\n    }\n": types.StatisticsFieldsFragmentDoc,
    "\n    query Statistics {\n        statistics {\n            ...StatisticsFields\n        }\n    }\n": types.StatisticsDocument,
    "\n    fragment TagSummary on Tag {\n        id\n        name\n    }\n": types.TagSummaryFragmentDoc,
    "\n    fragment TagFull on Tag {\n        ...TagSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.TagFullFragmentDoc,
    "\n    query TagPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        tagPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TagSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.TagPagedSummaryDocument,
    "\n    query TagPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        tagPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TagFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.TagPagedFullDocument,
    "\n    mutation TagCreate($input: TagCreate!) {\n        tagCreate(input: $input) { ...TagFull }\n    }\n": types.TagCreateDocument,
    "\n    mutation TagUpdate($input: TagUpdate!) {\n        tagUpdate(input: $input) { ...TagFull }\n    }\n": types.TagUpdateDocument,
    "\n    mutation TagDelete($id: ID!) {\n        tagDelete(id: $id)\n    }\n": types.TagDeleteDocument,
    "\n    query TagExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        tagExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": types.TagExportDocument,
    "\n    query TagEvents($sourceId: ID!) {\n        tagEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": types.TagEventsDocument,
    "\n    fragment TaskCategorySummary on TaskCategory {\n        id\n        name\n        actorPresent\n    }\n": types.TaskCategorySummaryFragmentDoc,
    "\n    fragment TaskCategoryFull on TaskCategory {\n        ...TaskCategorySummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.TaskCategoryFullFragmentDoc,
    "\n    query TaskCategoryPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskCategorySummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.TaskCategoryPagedSummaryDocument,
    "\n    query TaskCategoryPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskCategoryFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.TaskCategoryPagedFullDocument,
    "\n    mutation TaskCategoryCreate($input: TaskCategoryCreate!) {\n        taskCategoryCreate(input: $input) { ...TaskCategoryFull }\n    }\n": types.TaskCategoryCreateDocument,
    "\n    mutation TaskCategoryUpdate($input: TaskCategoryUpdate!) {\n        taskCategoryUpdate(input: $input) { ...TaskCategoryFull }\n    }\n": types.TaskCategoryUpdateDocument,
    "\n    mutation TaskCategoryDelete($id: ID!) {\n        taskCategoryDelete(id: $id)\n    }\n": types.TaskCategoryDeleteDocument,
    "\n    query TaskCategoryExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        taskCategoryExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": types.TaskCategoryExportDocument,
    "\n    query TaskCategoryEvents($sourceId: ID!) {\n        taskCategoryEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": types.TaskCategoryEventsDocument,
    "\n    fragment TaskSummary on Task {\n        id\n        name\n        category {\n            id\n            name\n            actorPresent\n        }\n    }\n": types.TaskSummaryFragmentDoc,
    "\n    fragment TaskFull on Task {\n        ...TaskSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.TaskFullFragmentDoc,
    "\n    query TaskPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.TaskPagedSummaryDocument,
    "\n    query TaskPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.TaskPagedFullDocument,
    "\n    mutation TaskCreate($input: TaskCreate!) {\n        taskCreate(input: $input) { ...TaskFull }\n    }\n": types.TaskCreateDocument,
    "\n    mutation TaskUpdate($input: TaskUpdate!) {\n        taskUpdate(input: $input) { ...TaskFull }\n    }\n": types.TaskUpdateDocument,
    "\n    mutation TaskDelete($id: ID!) {\n        taskDelete(id: $id)\n    }\n": types.TaskDeleteDocument,
    "\n    query TaskExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        taskExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": types.TaskExportDocument,
    "\n    query TaskEvents($sourceId: ID!) {\n        taskEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": types.TaskEventsDocument,
    "\n    mutation TaskCategoryAdd($id: ID!, $categoryId: ID!) {\n        taskCategoryAdd(taskId: $id, id: $categoryId)\n    }\n": types.TaskCategoryAddDocument,
    "\n    mutation TaskCategoryRemove($id: ID!) {\n        taskCategoryRemove(taskId: $id)\n    }\n": types.TaskCategoryRemoveDocument,
    "\n    fragment UserSummary on User {\n        id\n        externalId\n        email\n        authorities {\n            id\n            label\n        }\n        state {\n            id\n            label\n        }\n        spexare {\n            id\n            firstName\n            lastName\n            nickName\n        }\n    }\n": types.UserSummaryFragmentDoc,
    "\n    fragment UserFull on User {\n        ...UserSummary\n        temporaryPassword\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n": types.UserFullFragmentDoc,
    "\n    query UserPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        userPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...UserSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.UserPagedSummaryDocument,
    "\n    query UserPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        userPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...UserFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n": types.UserPagedFullDocument,
    "\n    mutation UserCreate($input: UserCreate!) {\n        userCreate(input: $input) { ...UserFull }\n    }\n": types.UserCreateDocument,
    "\n    mutation UserUpdate($input: UserUpdate!) {\n        userUpdate(input: $input) { ...UserFull }\n    }\n": types.UserUpdateDocument,
    "\n    mutation UserDelete($id: ID!) {\n        userDelete(id: $id)\n    }\n": types.UserDeleteDocument,
    "\n    query UserExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        userExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n": types.UserExportDocument,
    "\n    query UserEvents($sourceId: ID!) {\n        userEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n": types.UserEventsDocument,
    "\n    mutation UserAuthoritiesAdd($userId: ID!, $ids: [ID]!) {\n        userAuthoritiesAdd(userId: $userId, ids: $ids)\n    }\n": types.UserAuthoritiesAddDocument,
    "\n    mutation UserAuthoritiesRemove($userId: ID!, $ids: [ID]!) {\n        userAuthoritiesRemove(userId: $userId, ids: $ids)\n    }\n": types.UserAuthoritiesRemoveDocument,
    "\n    mutation UserStateSet($userId: ID!, $id: ID!) {\n        userStateSet(userId: $userId, id: $id)\n    }\n": types.UserStateSetDocument,
    "\n    mutation UserSpexareAdd($userId: ID!, $id: ID!) {\n        userSpexareAdd(userId: $userId, id: $id)\n    }\n": types.UserSpexareAddDocument,
    "\n    mutation UserSpexareRemove($userId: ID!) {\n        userSpexareRemove(userId: $userId)\n    }\n": types.UserSpexareRemoveDocument,
    "\n    query UserMe {\n        me {\n            spexare {\n                ...SpexareFull\n            }\n        }\n    }\n": types.UserMeDocument,
    "\n    query Authorities {\n        authorities {\n            id\n            label\n        }\n    }\n": types.AuthoritiesDocument,
    "\n    query States {\n        states {\n            id\n            label\n        }\n    }\n": types.StatesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment JobStatusFields on JobStatus {\n        id\n        name\n        status\n        exitStatus\n    }\n"): (typeof documents)["\n    fragment JobStatusFields on JobStatus {\n        id\n        name\n        status\n        exitStatus\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment JobFields on Job {\n        id\n        name\n        status\n        exitStatus\n        createdAt\n        startedAt\n        finishedAt\n        hasDownload\n        importResult {\n            success\n            errors\n            messages\n            data\n        }\n    }\n"): (typeof documents)["\n    fragment JobFields on Job {\n        id\n        name\n        status\n        exitStatus\n        createdAt\n        startedAt\n        finishedAt\n        hasDownload\n        importResult {\n            success\n            errors\n            messages\n            data\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query JobStatus($id: ID!) {\n        jobStatus(id: $id) {\n            ...JobStatusFields\n        }\n    }\n"): (typeof documents)["\n    query JobStatus($id: ID!) {\n        jobStatus(id: $id) {\n            ...JobStatusFields\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query JobById($id: ID!) {\n        job(id: $id) {\n            ...JobFields\n        }\n    }\n"): (typeof documents)["\n    query JobById($id: ID!) {\n        job(id: $id) {\n            ...JobFields\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Jobs {\n        jobs {\n            ...JobFields\n        }\n    }\n"): (typeof documents)["\n    query Jobs {\n        jobs {\n            ...JobFields\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation JobDelete($id: ID!) {\n        jobDelete(id: $id)\n    }\n"): (typeof documents)["\n    mutation JobDelete($id: ID!) {\n        jobDelete(id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment NewsSummary on News {\n        id\n        subject\n        text\n        visibleFrom\n    }\n"): (typeof documents)["\n    fragment NewsSummary on News {\n        id\n        subject\n        text\n        visibleFrom\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment NewsFull on News {\n        ...NewsSummary\n        published\n        visibleTo\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment NewsFull on News {\n        ...NewsSummary\n        published\n        visibleTo\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query NewsPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        newsPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...NewsSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query NewsPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        newsPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...NewsSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query NewsPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        newsPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...NewsFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query NewsPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        newsPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...NewsFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation NewsCreate($input: NewsCreate!) {\n        newsCreate(input: $input) { ...NewsFull }\n    }\n"): (typeof documents)["\n    mutation NewsCreate($input: NewsCreate!) {\n        newsCreate(input: $input) { ...NewsFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation NewsUpdate($input: NewsUpdate!) {\n        newsUpdate(input: $input) { ...NewsFull }\n    }\n"): (typeof documents)["\n    mutation NewsUpdate($input: NewsUpdate!) {\n        newsUpdate(input: $input) { ...NewsFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation NewsDelete($id: ID!) {\n        newsDelete(id: $id)\n    }\n"): (typeof documents)["\n    mutation NewsDelete($id: ID!) {\n        newsDelete(id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query NewsExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        newsExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"): (typeof documents)["\n    query NewsExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        newsExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query NewsEvents($sourceId: ID!) {\n        newsEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"): (typeof documents)["\n    query NewsEvents($sourceId: ID!) {\n        newsEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Countries {\n        countries {\n            isoCode\n            label\n        }\n    }\n"): (typeof documents)["\n    query Countries {\n        countries {\n            isoCode\n            label\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Types {\n        types {\n            id\n            label\n            type\n        }\n    }\n"): (typeof documents)["\n    query Types {\n        types {\n            id\n            label\n            type\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment SpexCategorySummary on SpexCategory {\n        id\n        name\n        logoUrl\n        firstYear\n    }\n"): (typeof documents)["\n    fragment SpexCategorySummary on SpexCategory {\n        id\n        name\n        logoUrl\n        firstYear\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment SpexCategoryFull on SpexCategory {\n        ...SpexCategorySummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment SpexCategoryFull on SpexCategory {\n        ...SpexCategorySummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexCategoryPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexCategorySummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query SpexCategoryPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexCategorySummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexCategoryPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexCategoryFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query SpexCategoryPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexCategoryFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexCategoryCreate($input: SpexCategoryCreate!) {\n        spexCategoryCreate(input: $input) { ...SpexCategoryFull }\n    }\n"): (typeof documents)["\n    mutation SpexCategoryCreate($input: SpexCategoryCreate!) {\n        spexCategoryCreate(input: $input) { ...SpexCategoryFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexCategoryUpdate($input: SpexCategoryUpdate!) {\n        spexCategoryUpdate(input: $input) { ...SpexCategoryFull }\n    }\n"): (typeof documents)["\n    mutation SpexCategoryUpdate($input: SpexCategoryUpdate!) {\n        spexCategoryUpdate(input: $input) { ...SpexCategoryFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexCategoryDelete($id: ID!) {\n        spexCategoryDelete(id: $id)\n    }\n"): (typeof documents)["\n    mutation SpexCategoryDelete($id: ID!) {\n        spexCategoryDelete(id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexCategoryExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        spexCategoryExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"): (typeof documents)["\n    query SpexCategoryExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        spexCategoryExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexCategoryEvents($sourceId: ID!) {\n        spexCategoryEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"): (typeof documents)["\n    query SpexCategoryEvents($sourceId: ID!) {\n        spexCategoryEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment SpexSummary on Spex {\n        id\n        year\n        title\n        posterUrl\n        revival\n        revivals {\n            id\n            year\n        }\n        category {\n            id\n            name\n        }\n    }\n"): (typeof documents)["\n    fragment SpexSummary on Spex {\n        id\n        year\n        title\n        posterUrl\n        revival\n        revivals {\n            id\n            year\n        }\n        category {\n            id\n            name\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment SpexFull on Spex {\n        ...SpexSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment SpexFull on Spex {\n        ...SpexSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query SpexPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query SpexPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexCreate($input: SpexCreate!) {\n        spexCreate(input: $input) { ...SpexFull }\n    }\n"): (typeof documents)["\n    mutation SpexCreate($input: SpexCreate!) {\n        spexCreate(input: $input) { ...SpexFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexUpdate($input: SpexUpdate!) {\n        spexUpdate(input: $input) { ...SpexFull }\n    }\n"): (typeof documents)["\n    mutation SpexUpdate($input: SpexUpdate!) {\n        spexUpdate(input: $input) { ...SpexFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexDelete($id: ID!) {\n        spexDelete(id: $id)\n    }\n"): (typeof documents)["\n    mutation SpexDelete($id: ID!) {\n        spexDelete(id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        spexExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"): (typeof documents)["\n    query SpexExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        spexExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexEvents($sourceId: ID!) {\n        spexEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"): (typeof documents)["\n    query SpexEvents($sourceId: ID!) {\n        spexEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexCategoryAdd($id: ID!, $categoryId: ID!) {\n        spexCategoryAdd(spexId: $id, id: $categoryId)\n    }\n"): (typeof documents)["\n    mutation SpexCategoryAdd($id: ID!, $categoryId: ID!) {\n        spexCategoryAdd(spexId: $id, id: $categoryId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexCategoryRemove($id: ID!) {\n        spexCategoryRemove(spexId: $id)\n    }\n"): (typeof documents)["\n    mutation SpexCategoryRemove($id: ID!) {\n        spexCategoryRemove(spexId: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexRevivalCreate($spexId: ID!, $year: Year!) {\n        spexRevivalCreate(spexId: $spexId, year: $year) {\n            id\n            year\n        }\n    }\n"): (typeof documents)["\n    mutation SpexRevivalCreate($spexId: ID!, $year: Year!) {\n        spexRevivalCreate(spexId: $spexId, year: $year) {\n            id\n            year\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexRevivalDelete($id: ID!, $spexId: ID!) {\n        spexRevivalDelete(spexId: $spexId, id: $id)\n    }\n"): (typeof documents)["\n    mutation SpexRevivalDelete($id: ID!, $spexId: ID!) {\n        spexRevivalDelete(spexId: $spexId, id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment ActivityBase on Activity {\n        id\n    }\n"): (typeof documents)["\n    fragment ActivityBase on Activity {\n        id\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment ActivitySummary on Activity {\n        ...ActivityBase\n        spexActivity {\n            ...SpexActivitySummary\n        }\n        taskActivities {\n            ...TaskActivitySummary\n        }\n    }\n"): (typeof documents)["\n    fragment ActivitySummary on Activity {\n        ...ActivityBase\n        spexActivity {\n            ...SpexActivitySummary\n        }\n        taskActivities {\n            ...TaskActivitySummary\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment ActivityFull on Activity {\n        ...ActivityBase\n        spexActivity {\n            ...SpexActivityFull\n        }\n        taskActivities {\n            ...TaskActivityFull\n        }\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment ActivityFull on Activity {\n        ...ActivityBase\n        spexActivity {\n            ...SpexActivityFull\n        }\n        taskActivities {\n            ...TaskActivityFull\n        }\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ActivityCreate($spexareId: ID!) {\n        activityCreate(spexareId: $spexareId) {\n            ...ActivityFull\n        }\n    }\n"): (typeof documents)["\n    mutation ActivityCreate($spexareId: ID!) {\n        activityCreate(spexareId: $spexareId) {\n            ...ActivityFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ActivityDelete($spexareId: ID!, $id: ID!) {\n        activityDelete(spexareId: $spexareId, id: $id)\n    }\n"): (typeof documents)["\n    mutation ActivityDelete($spexareId: ID!, $id: ID!) {\n        activityDelete(spexareId: $spexareId, id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment SpexActivityBase on SpexActivity {\n        id\n        spex {\n            id\n            year\n            title\n            revival\n            category {\n                name\n            }\n        }\n    }\n"): (typeof documents)["\n    fragment SpexActivityBase on SpexActivity {\n        id\n        spex {\n            id\n            year\n            title\n            revival\n            category {\n                name\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment SpexActivitySummary on SpexActivity {\n        ...SpexActivityBase\n    }\n"): (typeof documents)["\n    fragment SpexActivitySummary on SpexActivity {\n        ...SpexActivityBase\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment SpexActivityFull on SpexActivity {\n        ...SpexActivityBase\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment SpexActivityFull on SpexActivity {\n        ...SpexActivityBase\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexActivityCreate($spexareId: ID!, $activityId: ID!, $spexId: ID!) {\n        spexActivityCreate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId) {\n            ...SpexActivityFull\n        }\n    }\n"): (typeof documents)["\n    mutation SpexActivityCreate($spexareId: ID!, $activityId: ID!, $spexId: ID!) {\n        spexActivityCreate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId) {\n            ...SpexActivityFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexActivityUpdate($spexareId: ID!, $activityId: ID!, $spexId: ID!, $id: ID!) {\n        spexActivityUpdate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId, id: $id) {\n            ...SpexActivityFull\n        }\n    }\n"): (typeof documents)["\n    mutation SpexActivityUpdate($spexareId: ID!, $activityId: ID!, $spexId: ID!, $id: ID!) {\n        spexActivityUpdate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId, id: $id) {\n            ...SpexActivityFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexActivityDelete($spexareId: ID!, $activityId: ID!, $id: ID!) {\n        spexActivityDelete(spexareId: $spexareId, activityId: $activityId, id: $id)\n    }\n"): (typeof documents)["\n    mutation SpexActivityDelete($spexareId: ID!, $activityId: ID!, $id: ID!) {\n        spexActivityDelete(spexareId: $spexareId, activityId: $activityId, id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment ActorSummary on Actor {\n        id\n        role\n        vocal {\n            id\n            label\n        }\n    }\n"): (typeof documents)["\n    fragment ActorSummary on Actor {\n        id\n        role\n        vocal {\n            id\n            label\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment ActorFull on Actor {\n        ...ActorSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment ActorFull on Actor {\n        ...ActorSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ActorCreate($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorCreate!) {\n        actorCreate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input) {\n            ...ActorFull\n        }\n    }\n"): (typeof documents)["\n    mutation ActorCreate($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorCreate!) {\n        actorCreate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input) {\n            ...ActorFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ActorUpdate($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorUpdate!) {\n        actorUpdate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input) {\n            ...ActorFull\n        }\n    }\n"): (typeof documents)["\n    mutation ActorUpdate($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorUpdate!) {\n        actorUpdate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input) {\n            ...ActorFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ActorDelete($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $id: ID!) {\n        actorDelete(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, id: $id)\n    }\n"): (typeof documents)["\n    mutation ActorDelete($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $id: ID!) {\n        actorDelete(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment TaskActivityBase on TaskActivity {\n        id\n        task {\n            id\n            name\n            category {\n                name\n                actorPresent\n            }\n        }\n    }\n"): (typeof documents)["\n    fragment TaskActivityBase on TaskActivity {\n        id\n        task {\n            id\n            name\n            category {\n                name\n                actorPresent\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment TaskActivitySummary on TaskActivity {\n        ...TaskActivityBase\n        actors {\n            ...ActorSummary\n        }\n    }\n"): (typeof documents)["\n    fragment TaskActivitySummary on TaskActivity {\n        ...TaskActivityBase\n        actors {\n            ...ActorSummary\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment TaskActivityFull on TaskActivity {\n        ...TaskActivityBase\n        actors {\n            ...ActorFull\n        }\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment TaskActivityFull on TaskActivity {\n        ...TaskActivityBase\n        actors {\n            ...ActorFull\n        }\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TaskActivityCreate($spexareId: ID!, $activityId: ID!, $taskId: ID!) {\n        taskActivityCreate(spexareId: $spexareId, activityId: $activityId, taskId: $taskId) {\n            ...TaskActivityFull\n        }\n    }\n"): (typeof documents)["\n    mutation TaskActivityCreate($spexareId: ID!, $activityId: ID!, $taskId: ID!) {\n        taskActivityCreate(spexareId: $spexareId, activityId: $activityId, taskId: $taskId) {\n            ...TaskActivityFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TaskActivityUpdate($spexareId: ID!, $activityId: ID!, $taskId: ID!, $id: ID!) {\n        taskActivityUpdate(spexareId: $spexareId, activityId: $activityId, taskId: $taskId, id: $id) {\n            ...TaskActivityFull\n        }\n    }\n"): (typeof documents)["\n    mutation TaskActivityUpdate($spexareId: ID!, $activityId: ID!, $taskId: ID!, $id: ID!) {\n        taskActivityUpdate(spexareId: $spexareId, activityId: $activityId, taskId: $taskId, id: $id) {\n            ...TaskActivityFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TaskActivityDelete($spexareId: ID!, $activityId: ID!, $id: ID!) {\n        taskActivityDelete(spexareId: $spexareId, activityId: $activityId, id: $id)\n    }\n"): (typeof documents)["\n    mutation TaskActivityDelete($spexareId: ID!, $activityId: ID!, $id: ID!) {\n        taskActivityDelete(spexareId: $spexareId, activityId: $activityId, id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment AddressSummary on Address {\n        id\n        streetAddress\n        postalCode\n        city\n        country\n        phone\n        phoneMobile\n        emailAddress\n        type {\n            id\n            label\n        }\n    }\n"): (typeof documents)["\n    fragment AddressSummary on Address {\n        id\n        streetAddress\n        postalCode\n        city\n        country\n        phone\n        phoneMobile\n        emailAddress\n        type {\n            id\n            label\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment AddressFull on Address {\n        ...AddressSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment AddressFull on Address {\n        ...AddressSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation AddressCreate($spexareId: ID!, $typeId: ID!, $input: AddressCreate!) {\n        addressCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...AddressFull\n        }\n    }\n"): (typeof documents)["\n    mutation AddressCreate($spexareId: ID!, $typeId: ID!, $input: AddressCreate!) {\n        addressCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...AddressFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation AddressUpdate($spexareId: ID!, $typeId: ID!, $input: AddressUpdate!) {\n        addressUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...AddressFull\n        }\n    }\n"): (typeof documents)["\n    mutation AddressUpdate($spexareId: ID!, $typeId: ID!, $input: AddressUpdate!) {\n        addressUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...AddressFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation AddressDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        addressDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n"): (typeof documents)["\n    mutation AddressDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        addressDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment ConsentSummary on Consent {\n        id\n        value\n        type {\n            id\n            label\n        }\n    }\n"): (typeof documents)["\n    fragment ConsentSummary on Consent {\n        id\n        value\n        type {\n            id\n            label\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment ConsentFull on Consent {\n        ...ConsentSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment ConsentFull on Consent {\n        ...ConsentSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ConsentCreate($spexareId: ID!, $typeId: ID!, $input: ConsentCreate!) {\n        consentCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ConsentFull\n        }\n    }\n"): (typeof documents)["\n    mutation ConsentCreate($spexareId: ID!, $typeId: ID!, $input: ConsentCreate!) {\n        consentCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ConsentFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ConsentUpdate($spexareId: ID!, $typeId: ID!, $input: ConsentUpdate!) {\n        consentUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ConsentFull\n        }\n    }\n"): (typeof documents)["\n    mutation ConsentUpdate($spexareId: ID!, $typeId: ID!, $input: ConsentUpdate!) {\n        consentUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ConsentFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ConsentDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        consentDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n"): (typeof documents)["\n    mutation ConsentDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        consentDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment MembershipSummary on Membership {\n        id\n        year\n        type {\n            id\n            label\n        }\n    }\n"): (typeof documents)["\n    fragment MembershipSummary on Membership {\n        id\n        year\n        type {\n            id\n            label\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment MembershipFull on Membership {\n        ...MembershipSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment MembershipFull on Membership {\n        ...MembershipSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation MembershipCreate($spexareId: ID!, $typeId: ID!, $input: MembershipCreate!) {\n        membershipCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...MembershipFull\n        }\n    }\n"): (typeof documents)["\n    mutation MembershipCreate($spexareId: ID!, $typeId: ID!, $input: MembershipCreate!) {\n        membershipCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...MembershipFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation MembershipDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        membershipDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n"): (typeof documents)["\n    mutation MembershipDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        membershipDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment SpexareBase on Spexare {\n        id\n        firstName\n        lastName\n        nickName\n        socialSecurityNumber\n        deceased\n        published\n        graduation\n        comment\n        imageUrl\n        partner {\n            id\n            firstName\n            lastName\n            nickName\n            deceased\n            published\n            imageUrl\n        }\n    }\n"): (typeof documents)["\n    fragment SpexareBase on Spexare {\n        id\n        firstName\n        lastName\n        nickName\n        socialSecurityNumber\n        deceased\n        published\n        graduation\n        comment\n        imageUrl\n        partner {\n            id\n            firstName\n            lastName\n            nickName\n            deceased\n            published\n            imageUrl\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment SpexareSummary on Spexare {\n        ...SpexareBase\n    }\n"): (typeof documents)["\n    fragment SpexareSummary on Spexare {\n        ...SpexareBase\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment SpexareFull on Spexare {\n        ...SpexareBase\n        activities {\n            ...ActivityFull\n        }\n        addresses {\n            ...AddressFull\n        }\n        consents {\n            ...ConsentFull\n        }\n        memberships {\n            ...MembershipFull\n        }\n        taggings {\n            ...TaggingFull\n        }\n        toggles {\n            ...ToggleFull\n        }\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment SpexareFull on Spexare {\n        ...SpexareBase\n        activities {\n            ...ActivityFull\n        }\n        addresses {\n            ...AddressFull\n        }\n        consents {\n            ...ConsentFull\n        }\n        memberships {\n            ...MembershipFull\n        }\n        taggings {\n            ...TaggingFull\n        }\n        toggles {\n            ...ToggleFull\n        }\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexarePagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexarePaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexareSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query SpexarePagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexarePaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexareSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexarePagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexarePaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexareFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query SpexarePagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        spexarePaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...SpexareFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexareCreate($input: SpexareCreate!) {\n        spexareCreate(input: $input) { ...SpexareFull }\n    }\n"): (typeof documents)["\n    mutation SpexareCreate($input: SpexareCreate!) {\n        spexareCreate(input: $input) { ...SpexareFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexareUpdate($input: SpexareUpdate!) {\n        spexareUpdate(input: $input) { ...SpexareFull }\n    }\n"): (typeof documents)["\n    mutation SpexareUpdate($input: SpexareUpdate!) {\n        spexareUpdate(input: $input) { ...SpexareFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexareDelete($id: ID!) {\n        spexareDelete(id: $id)\n    }\n"): (typeof documents)["\n    mutation SpexareDelete($id: ID!) {\n        spexareDelete(id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexareEvents($sourceId: ID!) {\n        spexareEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"): (typeof documents)["\n    query SpexareEvents($sourceId: ID!) {\n        spexareEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexareGet($id: ID!) {\n        spexare(id: $id) { ...SpexareFull }\n    }\n"): (typeof documents)["\n    query SpexareGet($id: ID!) {\n        spexare(id: $id) { ...SpexareFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexarePartnerAdd($spexareId: ID!, $id: ID!) {\n        spexarePartnerAdd(spexareId: $spexareId, id: $id)\n    }\n"): (typeof documents)["\n    mutation SpexarePartnerAdd($spexareId: ID!, $id: ID!) {\n        spexarePartnerAdd(spexareId: $spexareId, id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SpexarePartnerRemove($spexareId: ID!) {\n        spexarePartnerRemove(spexareId: $spexareId)\n    }\n"): (typeof documents)["\n    mutation SpexarePartnerRemove($spexareId: ID!) {\n        spexarePartnerRemove(spexareId: $spexareId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexareExport($ids: [ID], $filter: String, $type: ImpexType!, $reportType: ReportType) {\n        spexareExport(ids: $ids, filter: $filter, type: $type, reportType: $reportType) { id }\n    }\n"): (typeof documents)["\n    query SpexareExport($ids: [ID], $filter: String, $type: ImpexType!, $reportType: ReportType) {\n        spexareExport(ids: $ids, filter: $filter, type: $type, reportType: $reportType) { id }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexareSearch($q: String!, $aggregationFilters: [AggregationFilterInput], $limit: Int, $offset: Int, $sort: [String], $direction: SortDirection) {\n        spexareSearchPaged(q: $q, aggregationFilters: $aggregationFilters, limit: $limit, offset: $offset, sort: $sort, direction: $direction) {\n            edges { cursor node { ...SpexareSummary } }\n            facets {\n                id\n                label\n                groups {\n                    id\n                    label\n                    values {\n                        id\n                        label\n                        count\n                    }\n                }\n            }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query SpexareSearch($q: String!, $aggregationFilters: [AggregationFilterInput], $limit: Int, $offset: Int, $sort: [String], $direction: SortDirection) {\n        spexareSearchPaged(q: $q, aggregationFilters: $aggregationFilters, limit: $limit, offset: $offset, sort: $sort, direction: $direction) {\n            edges { cursor node { ...SpexareSummary } }\n            facets {\n                id\n                label\n                groups {\n                    id\n                    label\n                    values {\n                        id\n                        label\n                        count\n                    }\n                }\n            }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment TaggingSummary on Tag {\n        id\n        name\n    }\n"): (typeof documents)["\n    fragment TaggingSummary on Tag {\n        id\n        name\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment TaggingFull on Tag {\n        ...TaggingSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment TaggingFull on Tag {\n        ...TaggingSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TaggingCreate($spexareId: ID!, $tagId: ID!) {\n        taggingCreate(spexareId: $spexareId, tagId: $tagId)\n    }\n"): (typeof documents)["\n    mutation TaggingCreate($spexareId: ID!, $tagId: ID!) {\n        taggingCreate(spexareId: $spexareId, tagId: $tagId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TaggingDelete($spexareId: ID!, $tagId: ID!) {\n        taggingDelete(spexareId: $spexareId, tagId: $tagId)\n    }\n"): (typeof documents)["\n    mutation TaggingDelete($spexareId: ID!, $tagId: ID!) {\n        taggingDelete(spexareId: $spexareId, tagId: $tagId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment ToggleSummary on Toggle {\n        id\n        value\n        type {\n            id\n            label\n        }\n    }\n"): (typeof documents)["\n    fragment ToggleSummary on Toggle {\n        id\n        value\n        type {\n            id\n            label\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment ToggleFull on Toggle {\n        ...ToggleSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment ToggleFull on Toggle {\n        ...ToggleSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ToggleCreate($spexareId: ID!, $typeId: ID!, $input: ToggleCreate!) {\n        toggleCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ToggleFull\n        }\n    }\n"): (typeof documents)["\n    mutation ToggleCreate($spexareId: ID!, $typeId: ID!, $input: ToggleCreate!) {\n        toggleCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ToggleFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ToggleUpdate($spexareId: ID!, $typeId: ID!, $input: ToggleUpdate!) {\n        toggleUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ToggleFull\n        }\n    }\n"): (typeof documents)["\n    mutation ToggleUpdate($spexareId: ID!, $typeId: ID!, $input: ToggleUpdate!) {\n        toggleUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {\n            ...ToggleFull\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ToggleDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        toggleDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n"): (typeof documents)["\n    mutation ToggleDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {\n        toggleDelete(spexareId: $spexareId, typeId: $typeId, id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment StatisticsFields on Statistics {\n        spexareCount\n        spexareCountHistory {\n            label\n            count\n        }\n        userCount\n        userCountHistory {\n            label\n            count\n        }\n        spexCount\n        spexCountHistory {\n            label\n            count\n        }\n        spexRevivalCount\n        spexRevivalCountHistory {\n            label\n            count\n        }\n        taskCount\n        taskCountHistory {\n            label\n            count\n        }\n    }\n"): (typeof documents)["\n    fragment StatisticsFields on Statistics {\n        spexareCount\n        spexareCountHistory {\n            label\n            count\n        }\n        userCount\n        userCountHistory {\n            label\n            count\n        }\n        spexCount\n        spexCountHistory {\n            label\n            count\n        }\n        spexRevivalCount\n        spexRevivalCountHistory {\n            label\n            count\n        }\n        taskCount\n        taskCountHistory {\n            label\n            count\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Statistics {\n        statistics {\n            ...StatisticsFields\n        }\n    }\n"): (typeof documents)["\n    query Statistics {\n        statistics {\n            ...StatisticsFields\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment TagSummary on Tag {\n        id\n        name\n    }\n"): (typeof documents)["\n    fragment TagSummary on Tag {\n        id\n        name\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment TagFull on Tag {\n        ...TagSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment TagFull on Tag {\n        ...TagSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TagPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        tagPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TagSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query TagPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        tagPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TagSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TagPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        tagPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TagFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query TagPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        tagPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TagFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TagCreate($input: TagCreate!) {\n        tagCreate(input: $input) { ...TagFull }\n    }\n"): (typeof documents)["\n    mutation TagCreate($input: TagCreate!) {\n        tagCreate(input: $input) { ...TagFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TagUpdate($input: TagUpdate!) {\n        tagUpdate(input: $input) { ...TagFull }\n    }\n"): (typeof documents)["\n    mutation TagUpdate($input: TagUpdate!) {\n        tagUpdate(input: $input) { ...TagFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TagDelete($id: ID!) {\n        tagDelete(id: $id)\n    }\n"): (typeof documents)["\n    mutation TagDelete($id: ID!) {\n        tagDelete(id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TagExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        tagExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"): (typeof documents)["\n    query TagExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        tagExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TagEvents($sourceId: ID!) {\n        tagEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"): (typeof documents)["\n    query TagEvents($sourceId: ID!) {\n        tagEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment TaskCategorySummary on TaskCategory {\n        id\n        name\n        actorPresent\n    }\n"): (typeof documents)["\n    fragment TaskCategorySummary on TaskCategory {\n        id\n        name\n        actorPresent\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment TaskCategoryFull on TaskCategory {\n        ...TaskCategorySummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment TaskCategoryFull on TaskCategory {\n        ...TaskCategorySummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TaskCategoryPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskCategorySummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query TaskCategoryPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskCategorySummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TaskCategoryPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskCategoryFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query TaskCategoryPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskCategoryFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TaskCategoryCreate($input: TaskCategoryCreate!) {\n        taskCategoryCreate(input: $input) { ...TaskCategoryFull }\n    }\n"): (typeof documents)["\n    mutation TaskCategoryCreate($input: TaskCategoryCreate!) {\n        taskCategoryCreate(input: $input) { ...TaskCategoryFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TaskCategoryUpdate($input: TaskCategoryUpdate!) {\n        taskCategoryUpdate(input: $input) { ...TaskCategoryFull }\n    }\n"): (typeof documents)["\n    mutation TaskCategoryUpdate($input: TaskCategoryUpdate!) {\n        taskCategoryUpdate(input: $input) { ...TaskCategoryFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TaskCategoryDelete($id: ID!) {\n        taskCategoryDelete(id: $id)\n    }\n"): (typeof documents)["\n    mutation TaskCategoryDelete($id: ID!) {\n        taskCategoryDelete(id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TaskCategoryExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        taskCategoryExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"): (typeof documents)["\n    query TaskCategoryExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        taskCategoryExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TaskCategoryEvents($sourceId: ID!) {\n        taskCategoryEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"): (typeof documents)["\n    query TaskCategoryEvents($sourceId: ID!) {\n        taskCategoryEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment TaskSummary on Task {\n        id\n        name\n        category {\n            id\n            name\n            actorPresent\n        }\n    }\n"): (typeof documents)["\n    fragment TaskSummary on Task {\n        id\n        name\n        category {\n            id\n            name\n            actorPresent\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment TaskFull on Task {\n        ...TaskSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment TaskFull on Task {\n        ...TaskSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TaskPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query TaskPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TaskPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query TaskPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        taskPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...TaskFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TaskCreate($input: TaskCreate!) {\n        taskCreate(input: $input) { ...TaskFull }\n    }\n"): (typeof documents)["\n    mutation TaskCreate($input: TaskCreate!) {\n        taskCreate(input: $input) { ...TaskFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TaskUpdate($input: TaskUpdate!) {\n        taskUpdate(input: $input) { ...TaskFull }\n    }\n"): (typeof documents)["\n    mutation TaskUpdate($input: TaskUpdate!) {\n        taskUpdate(input: $input) { ...TaskFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TaskDelete($id: ID!) {\n        taskDelete(id: $id)\n    }\n"): (typeof documents)["\n    mutation TaskDelete($id: ID!) {\n        taskDelete(id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TaskExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        taskExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"): (typeof documents)["\n    query TaskExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        taskExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TaskEvents($sourceId: ID!) {\n        taskEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"): (typeof documents)["\n    query TaskEvents($sourceId: ID!) {\n        taskEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TaskCategoryAdd($id: ID!, $categoryId: ID!) {\n        taskCategoryAdd(taskId: $id, id: $categoryId)\n    }\n"): (typeof documents)["\n    mutation TaskCategoryAdd($id: ID!, $categoryId: ID!) {\n        taskCategoryAdd(taskId: $id, id: $categoryId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation TaskCategoryRemove($id: ID!) {\n        taskCategoryRemove(taskId: $id)\n    }\n"): (typeof documents)["\n    mutation TaskCategoryRemove($id: ID!) {\n        taskCategoryRemove(taskId: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment UserSummary on User {\n        id\n        externalId\n        email\n        authorities {\n            id\n            label\n        }\n        state {\n            id\n            label\n        }\n        spexare {\n            id\n            firstName\n            lastName\n            nickName\n        }\n    }\n"): (typeof documents)["\n    fragment UserSummary on User {\n        id\n        externalId\n        email\n        authorities {\n            id\n            label\n        }\n        state {\n            id\n            label\n        }\n        spexare {\n            id\n            firstName\n            lastName\n            nickName\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment UserFull on User {\n        ...UserSummary\n        temporaryPassword\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"): (typeof documents)["\n    fragment UserFull on User {\n        ...UserSummary\n        temporaryPassword\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query UserPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        userPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...UserSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query UserPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        userPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...UserSummary } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query UserPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        userPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...UserFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"): (typeof documents)["\n    query UserPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {\n        userPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {\n            edges { cursor node { ...UserFull } }\n            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UserCreate($input: UserCreate!) {\n        userCreate(input: $input) { ...UserFull }\n    }\n"): (typeof documents)["\n    mutation UserCreate($input: UserCreate!) {\n        userCreate(input: $input) { ...UserFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UserUpdate($input: UserUpdate!) {\n        userUpdate(input: $input) { ...UserFull }\n    }\n"): (typeof documents)["\n    mutation UserUpdate($input: UserUpdate!) {\n        userUpdate(input: $input) { ...UserFull }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UserDelete($id: ID!) {\n        userDelete(id: $id)\n    }\n"): (typeof documents)["\n    mutation UserDelete($id: ID!) {\n        userDelete(id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query UserExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        userExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"): (typeof documents)["\n    query UserExport($ids: [ID], $filter: String, $type: ImpexType!) {\n        userExport(ids: $ids, filter: $filter, type: $type) { id }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query UserEvents($sourceId: ID!) {\n        userEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"): (typeof documents)["\n    query UserEvents($sourceId: ID!) {\n        userEvents(sourceId: $sourceId) { id eventType createdAt createdBy }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UserAuthoritiesAdd($userId: ID!, $ids: [ID]!) {\n        userAuthoritiesAdd(userId: $userId, ids: $ids)\n    }\n"): (typeof documents)["\n    mutation UserAuthoritiesAdd($userId: ID!, $ids: [ID]!) {\n        userAuthoritiesAdd(userId: $userId, ids: $ids)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UserAuthoritiesRemove($userId: ID!, $ids: [ID]!) {\n        userAuthoritiesRemove(userId: $userId, ids: $ids)\n    }\n"): (typeof documents)["\n    mutation UserAuthoritiesRemove($userId: ID!, $ids: [ID]!) {\n        userAuthoritiesRemove(userId: $userId, ids: $ids)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UserStateSet($userId: ID!, $id: ID!) {\n        userStateSet(userId: $userId, id: $id)\n    }\n"): (typeof documents)["\n    mutation UserStateSet($userId: ID!, $id: ID!) {\n        userStateSet(userId: $userId, id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UserSpexareAdd($userId: ID!, $id: ID!) {\n        userSpexareAdd(userId: $userId, id: $id)\n    }\n"): (typeof documents)["\n    mutation UserSpexareAdd($userId: ID!, $id: ID!) {\n        userSpexareAdd(userId: $userId, id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UserSpexareRemove($userId: ID!) {\n        userSpexareRemove(userId: $userId)\n    }\n"): (typeof documents)["\n    mutation UserSpexareRemove($userId: ID!) {\n        userSpexareRemove(userId: $userId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query UserMe {\n        me {\n            spexare {\n                ...SpexareFull\n            }\n        }\n    }\n"): (typeof documents)["\n    query UserMe {\n        me {\n            spexare {\n                ...SpexareFull\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Authorities {\n        authorities {\n            id\n            label\n        }\n    }\n"): (typeof documents)["\n    query Authorities {\n        authorities {\n            id\n            label\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query States {\n        states {\n            id\n            label\n        }\n    }\n"): (typeof documents)["\n    query States {\n        states {\n            id\n            label\n        }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;