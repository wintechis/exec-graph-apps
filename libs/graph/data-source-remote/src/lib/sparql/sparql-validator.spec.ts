import { SparqlValidator } from './sparql-validator';

describe('SparqlValidator', () => {
  it('fails on invalid sparql', () => {
    const subject = new SparqlValidator();
    expect(
      subject.validate('CONSTRCT { ?s ?p ?o } WHERE { ?s ?p ?o }')
    ).toBeFalsy();
    expect(subject.validate('')).toBeFalsy();
  });

  it('accepts valid sparql', () => {
    const subject = new SparqlValidator();
    expect(
      subject.validate('CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }')
    ).toBeTruthy();
  });
});
