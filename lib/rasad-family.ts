type Benefit = {BenefitKey: number; EventDate: string; Paid?: string; Fund: number; Kind: string; Service: string};
type Membership = {MembershipKey: number; HistoryTypeCode?: string; StartDate: string; EndDate?: string | null};

export function demoCoverage(personKey: number, memberships: Membership[]) {
  const rows = memberships.map(row => ({
    CoverageReference: "MEM-" + row.MembershipKey, HistoryTypeCode: row.HistoryTypeCode,
    StartDate: row.StartDate, EndDate: row.EndDate, CoverageOrigin: "ردیف عضویت بسته"
  }));
  if (personKey !== 1 && personKey % 4 !== 0) return rows;
  const day = 86400000;
  const first = Math.min(...rows.map(row => Date.parse(row.StartDate)).filter(Number.isFinite));
  if (!Number.isFinite(first)) return rows;
  const earlier = (days: number) => new Date(first - days * day).toISOString().slice(0, 10);
  return [
    {CoverageReference: 'DEMO-COVERAGE-' + personKey + '-1', HistoryTypeCode: '08', StartDate: earlier(540), EndDate: earlier(221), CoverageOrigin: 'نمونهٔ تکمیلی رصد'},
    {CoverageReference: 'DEMO-COVERAGE-' + personKey + '-2', HistoryTypeCode: '09', StartDate: earlier(220), EndDate: earlier(1), CoverageOrigin: 'نمونهٔ تکمیلی رصد'},
    ...rows
  ];
}

export function demoHousehold(personKey: number, benefits: Benefit[]) {
  const count = personKey === 1 ? 10 : personKey % 6;
  const dependents = Array.from({length: count}, (_, index) => ({
    DependentKey: 'DEP-' + personKey + '-' + (index + 1),
    DependentLabel: 'عضو تبعی ' + (index + 1),
    RelationLabel: index === 0 && personKey !== 1 ? 'همسر' : 'فرزند',
    LinkedFrom: '2023-03-21',
    LinkedTo: personKey !== 1 && index === 2 ? '2025-03-20' : null
  }));
  const templates = benefits.filter(benefit => benefit.Kind === 'درمان' && benefit.Paid && benefit.Fund > 0);
  const dependentBenefits = dependents.flatMap((dependent, index) => templates
    .filter((benefit, templateIndex) => (templateIndex + index) % 3 === 0
      && benefit.EventDate >= dependent.LinkedFrom && (!dependent.LinkedTo || benefit.EventDate <= dependent.LinkedTo))
    .map(benefit => ({
      DependentBenefitKey: dependent.DependentKey + '-' + benefit.BenefitKey,
      DependentKey: dependent.DependentKey, DependentLabel: dependent.DependentLabel,
      BenefitDate: benefit.Paid!, Service: benefit.Service,
      FamilyPaid: Math.round(benefit.Fund * (0.52 + (index % 5) * 0.09))
    })));
  return {dependents, dependentBenefits, origin: 'DEMO-HOUSEHOLD-1'};
}
