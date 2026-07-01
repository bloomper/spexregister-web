import {beforeEach, describe, expect, it, vi} from 'vitest';
import {act, renderHook, waitFor} from '@testing-library/react';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({useRouter: () => ({refresh})}));

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock('sonner', () => ({toast: {success: (...a: unknown[]) => toastSuccess(...a), error: (...a: unknown[]) => toastError(...a)}}));

import {useDataTableActions} from '@/hooks/use-data-table-actions';

type Row = {id: string};

beforeEach(() => {
    refresh.mockClear();
    toastSuccess.mockClear();
    toastError.mockClear();
});

describe('useDataTableActions - single delete', () => {
    it('deletes the selected item, toasts success and refreshes', async () => {
        const deleteAction = vi.fn().mockResolvedValue(undefined);
        const onSuccess = vi.fn();
        const {result} = renderHook(() => useDataTableActions<Row>(deleteAction, undefined, onSuccess));

        act(() => result.current.setDeleteItem({id: '7'}));
        await act(async () => {
            result.current.handleDelete();
        });

        await waitFor(() => expect(result.current.deleteItem).toBeNull());
        expect(deleteAction).toHaveBeenCalledWith('7');
        expect(toastSuccess).toHaveBeenCalledWith('Common.deleteSuccess');
        expect(refresh).toHaveBeenCalled();
        expect(onSuccess).toHaveBeenCalled();
    });

    it('does nothing when there is no item to delete', () => {
        const deleteAction = vi.fn();
        const {result} = renderHook(() => useDataTableActions<Row>(deleteAction));

        act(() => result.current.handleDelete());
        expect(deleteAction).not.toHaveBeenCalled();
    });

    it('toasts an error and keeps the item when deletion fails', async () => {
        const deleteAction = vi.fn().mockRejectedValue(new Error('nope'));
        const {result} = renderHook(() => useDataTableActions<Row>(deleteAction));

        act(() => result.current.setDeleteItem({id: '9'}));
        await act(async () => {
            result.current.handleDelete();
        });

        await waitFor(() => expect(toastError).toHaveBeenCalledWith('Common.errorOccurred'));
        expect(result.current.deleteItem).toEqual({id: '9'});
        expect(toastSuccess).not.toHaveBeenCalled();
    });
});

describe('useDataTableActions - bulk delete', () => {
    it('bulk-deletes selected ids, clears selection and toasts', async () => {
        const deleteAction = vi.fn();
        const bulkDeleteAction = vi.fn().mockResolvedValue(undefined);
        const {result} = renderHook(() => useDataTableActions<Row>(deleteAction, bulkDeleteAction));

        act(() => {
            result.current.setSelectedRows([{id: '1'}, {id: '2'}]);
            result.current.setIsBulkDeleting(true);
        });
        await act(async () => {
            result.current.handleBulkDelete();
        });

        await waitFor(() => expect(result.current.selectedRows).toEqual([]));
        expect(bulkDeleteAction).toHaveBeenCalledWith(['1', '2']);
        expect(toastSuccess).toHaveBeenCalledWith('Common.deleteBulkSuccess');
        expect(result.current.isBulkDeleting).toBe(false);
    });

    it('no-ops when nothing is selected', () => {
        const bulkDeleteAction = vi.fn();
        const {result} = renderHook(() => useDataTableActions<Row>(vi.fn(), bulkDeleteAction));

        act(() => result.current.handleBulkDelete());
        expect(bulkDeleteAction).not.toHaveBeenCalled();
    });
});
