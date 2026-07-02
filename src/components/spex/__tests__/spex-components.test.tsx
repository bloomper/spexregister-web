import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/image', () => ({default: () => <span data-slot="mock-image"/>}));
vi.mock('@/components/data-audit-trail.client', () => ({AuditTrail: () => <div data-testid="audit-trail"/>}));
vi.mock('@/app/(app)/spex/actions.server', () => ({getEventsAction: vi.fn()}));
vi.mock('@/components/spex/spex-form.client', () => ({SpexForm: () => <div data-testid="spex-form"/>}));

import {SpexCard} from '@/components/spex/spex-card.client';
import {SpexViewDialog} from '@/components/spex/spex-view-dialog.client';
import {SpexEditSheet} from '@/components/spex/spex-edit-sheet.client';
import type {Spex} from '@/gql/schema';

const spex = {
    id: 'sp1', title: 'Hamlet', year: '2020', posterUrl: null,
    category: {id: 'c1', name: 'Chalmersspexet'}, revivals: [],
} as unknown as Spex;

describe('SpexCard', () => {
    it('renders title, year and category', () => {
        render(<SpexCard spex={spex} index={0} canUpdate={false} onSelect={vi.fn()} onEdit={vi.fn()}/>);
        expect(screen.getByText('Hamlet')).toBeInTheDocument();
        expect(screen.getByText('2020')).toBeInTheDocument();
        expect(screen.getByText('Chalmersspexet')).toBeInTheDocument();
    });

    it('fires onEdit from the edit button when updatable', async () => {
        const onEdit = vi.fn();
        render(<SpexCard spex={spex} index={0} canUpdate onSelect={vi.fn()} onEdit={onEdit}/>);
        await userEvent.click(screen.getByRole('button'));
        expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it('fires onSelect when the title is clicked', async () => {
        const onSelect = vi.fn();
        render(<SpexCard spex={spex} index={0} canUpdate={false} onSelect={onSelect} onEdit={vi.fn()}/>);
        await userEvent.click(screen.getByText('Hamlet'));
        expect(onSelect).toHaveBeenCalled();
    });
});

describe('SpexViewDialog', () => {
    it('renders the spex detail and closes', async () => {
        const onClose = vi.fn();
        render(<SpexViewDialog selected={spex} onClose={onClose}/>);
        expect(screen.getByText('Hamlet')).toBeInTheDocument();
        expect(screen.getByText('Chalmersspexet')).toBeInTheDocument();
        expect(screen.getByTestId('audit-trail')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', {name: /Common.close/}));
        expect(onClose).toHaveBeenCalled();
    });

    it('renders nothing when there is no selection', () => {
        render(<SpexViewDialog selected={null} onClose={vi.fn()}/>);
        expect(screen.queryByTestId('audit-trail')).not.toBeInTheDocument();
    });
});

describe('SpexEditSheet', () => {
    it('renders the form when an item is set', () => {
        render(<SpexEditSheet item={spex} categories={[]} onClose={vi.fn()} onSuccess={vi.fn()}/>);
        expect(screen.getByTestId('spex-form')).toBeInTheDocument();
    });

    it('renders nothing when closed', () => {
        render(<SpexEditSheet item={null} categories={[]} onClose={vi.fn()} onSuccess={vi.fn()}/>);
        expect(screen.queryByTestId('spex-form')).not.toBeInTheDocument();
    });
});
