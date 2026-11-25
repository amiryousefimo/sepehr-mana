type Benefit = {BenefitKey: number; EventDate: string; Paid?: string; Fund: number; Kind: string; Service: string};

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
