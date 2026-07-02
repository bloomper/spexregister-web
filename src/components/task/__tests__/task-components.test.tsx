import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/components/data-audit-trail.client', () => ({AuditTrail: () => <div data-testid="audit-trail"/>}));
vi.mock('@/app/(app)/tasks/actions.server', () => ({getEventsAction: vi.fn()}));
vi.mock('@/components/task/task-form.client', () => ({TaskForm: () => <div data-testid="task-form"/>}));

import {TaskCard} from '@/components/task/task-card.client';
import {TaskViewDialog} from '@/components/task/task-view-dialog.client';
import {TaskEditSheet} from '@/components/task/task-edit-sheet.client';
import type {Task} from '@/gql/schema';

const task = {id: 't1', name: 'Lighting', category: {id: 'c1', name: 'Technical'}} as unknown as Task;
const uncategorised = {id: 't2', name: 'Misc', category: null} as unknown as Task;

describe('TaskCard', () => {
    it('renders the name and category', () => {
        render(<TaskCard task={task} canUpdate={false} onSelect={vi.fn()} onEdit={vi.fn()}/>);
        expect(screen.getByText('Lighting')).toBeInTheDocument();
        expect(screen.getByText('Technical')).toBeInTheDocument();
    });

    it('falls back to the "none" label for an uncategorised task', () => {
        render(<TaskCard task={uncategorised} canUpdate={false} onSelect={vi.fn()} onEdit={vi.fn()}/>);
        expect(screen.getByText('Common.none')).toBeInTheDocument();
    });

    it('fires onEdit and onSelect', async () => {
        const onEdit = vi.fn();
        const onSelect = vi.fn();
        render(<TaskCard task={task} canUpdate onSelect={onSelect} onEdit={onEdit}/>);
        await userEvent.click(screen.getByRole('button'));
        expect(onEdit).toHaveBeenCalledTimes(1);
        await userEvent.click(screen.getByText('Lighting'));
        expect(onSelect).toHaveBeenCalled();
    });
});

describe('TaskViewDialog', () => {
    it('renders the task detail and closes', async () => {
        const onClose = vi.fn();
        render(<TaskViewDialog selected={task} onClose={onClose}/>);
        expect(screen.getByText('Lighting')).toBeInTheDocument();
        expect(screen.getByTestId('audit-trail')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', {name: /Common.close/}));
        expect(onClose).toHaveBeenCalled();
    });

    it('renders nothing when there is no selection', () => {
        render(<TaskViewDialog selected={null} onClose={vi.fn()}/>);
        expect(screen.queryByTestId('audit-trail')).not.toBeInTheDocument();
    });
});

describe('TaskEditSheet', () => {
    it('renders the form when an item is set', () => {
        render(<TaskEditSheet item={task} categories={[]} onClose={vi.fn()} onSuccess={vi.fn()}/>);
        expect(screen.getByTestId('task-form')).toBeInTheDocument();
    });

    it('renders nothing when closed', () => {
        render(<TaskEditSheet item={null} categories={[]} onClose={vi.fn()} onSuccess={vi.fn()}/>);
        expect(screen.queryByTestId('task-form')).not.toBeInTheDocument();
    });
});
