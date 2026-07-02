import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';

vi.mock('next/image', () => ({default: () => <span data-slot="mock-image"/>}));
vi.mock('@/components/data-audit-trail.client', () => ({AuditTrail: () => <div data-testid="audit-trail"/>}));
vi.mock('@/components/data-table-audit-info.client', () => ({AuditInfo: () => <div data-testid="audit-info"/>}));
vi.mock('@/app/(app)/spexare/actions.server', () => ({getEventsAction: vi.fn()}));

import {
    AddressesSection,
    ConsentsSection,
    MembershipsSection,
    PartnerSection,
    TaggingsSection,
    TogglesSection,
} from '@/components/spexare/spexare-view-sections.client';
import type {Country, Spexare} from '@/gql/schema';

type Slice<K extends keyof Spexare> = Spexare[K];

describe('MembershipsSection', () => {
    it('groups years under each membership type and sorts them ascending', () => {
        const memberships = [
            {id: 'm1', year: '2020', type: {id: 't', label: 'Chairman'}},
            {id: 'm2', year: '2018', type: {id: 't', label: 'Chairman'}},
            {id: 'm3', year: '2021', type: {id: 't2', label: 'Treasurer'}},
        ] as unknown as Slice<'memberships'>;

        render(<MembershipsSection memberships={memberships}/>);

        expect(screen.getByText('Chairman')).toBeInTheDocument();
        expect(screen.getByText('Treasurer')).toBeInTheDocument();
        const years = screen.getAllByText(/20(18|20|21)/).map((n) => n.textContent);
        expect(years).toEqual(['2018', '2020', '2021']);
    });

    it('renders an empty state when there are no memberships', () => {
        render(<MembershipsSection memberships={[]}/>);
        expect(screen.getByText('Common.noDataHeading')).toBeInTheDocument();
    });
});

describe('ConsentsSection', () => {
    it('shows granted and withdrawn states', () => {
        const consents = [
            {id: 'c1', value: true, type: {id: 't', label: 'GDPR'}},
            {id: 'c2', value: false, type: {id: 't2', label: 'Photo'}},
        ] as unknown as Slice<'consents'>;

        render(<ConsentsSection consents={consents}/>);

        expect(screen.getByText('Spexare.Consent.granted')).toBeInTheDocument();
        expect(screen.getByText('Spexare.Consent.withdrawn')).toBeInTheDocument();
    });
});

describe('AddressesSection', () => {
    it('renders address fields and resolves the country label', () => {
        const addresses = [{
            id: 'a1', type: {id: 't', label: 'Home'},
            streetAddress: 'Main St 1', postalCode: '41100', city: 'Göteborg',
            country: 'SE', emailAddress: 'ada@example.com', phone: '123',
        }] as unknown as Slice<'addresses'>;
        const countries = [{isoCode: 'SE', label: 'Sweden'}] as unknown as Country[];

        render(<AddressesSection addresses={addresses} countries={countries}/>);

        expect(screen.getByText('Main St 1')).toBeInTheDocument();
        expect(screen.getByText('Sweden')).toBeInTheDocument();
        expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    });
});

describe('TogglesSection', () => {
    it('renders yes/no for toggle values', () => {
        const toggles = [
            {id: 'tg1', value: true, type: {id: 't', label: 'Newsletter'}},
            {id: 'tg2', value: false, type: {id: 't2', label: 'SMS'}},
        ] as unknown as Slice<'toggles'>;

        render(<TogglesSection toggles={toggles}/>);

        expect(screen.getByText('Common.yes')).toBeInTheDocument();
        expect(screen.getByText('Common.no')).toBeInTheDocument();
    });
});

describe('TaggingsSection', () => {
    it('renders tag names', () => {
        const taggings = [{id: 'x1', name: 'alumni'}] as unknown as Slice<'taggings'>;
        render(<TaggingsSection taggings={taggings}/>);
        expect(screen.getByText('alumni')).toBeInTheDocument();
    });
});

describe('PartnerSection', () => {
    it('renders the partner name', () => {
        const partner = {
            id: 'p1', firstName: 'Bob', lastName: 'Byron', published: true, deceased: false, imageUrl: null,
        } as unknown as Slice<'partner'>;
        render(<PartnerSection partner={partner}/>);
        expect(screen.getByText('Bob Byron')).toBeInTheDocument();
    });

    it('renders an empty state without a partner', () => {
        render(<PartnerSection partner={null}/>);
        expect(screen.getByText('Common.noDataHeading')).toBeInTheDocument();
    });
});
