import { usePrototype } from '../../PrototypeContext';
import NetworkList from './NetworkList';
import NetworkListConcept1 from './NetworkListConcept1';
import NetworkListConcept2 from './NetworkListConcept2';
import NetworkListConcept3 from './NetworkListConcept3';
import NetworkListConcept4 from './NetworkListConcept4';

const CONCEPT_MAP = {
  current: NetworkList,
  concept1: NetworkListConcept1,
  concept2: NetworkListConcept2,
  concept3: NetworkListConcept3,
  concept4: NetworkListConcept4,
};

export default function NetworkListWrapper() {
  const { getVariable } = usePrototype();
  const conceptId = getVariable('networkConcept', 'current');
  const Component = CONCEPT_MAP[conceptId] || NetworkList;
  return <Component />;
}
