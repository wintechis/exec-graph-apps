import { QueryType } from '@exec-graph/graph/data-source-remote';

export type SparqlQueryType = 'DESCRIBE' | 'SELECT' | 'CONSTRUCT' | 'ASK';

export interface Triple {
  predicate: string;
  object: string;
  subject: string;
}

export type Term = {
  termType: 'Variable' | 'NamedNode' | 'Literal' | 'BlankNode' | 'Quad';
  value: string;
};

export interface Modifiers {
  orderByDir: '' | 'ASCENDING' | 'DESCENDING';
  orderBy: string | null;
  limit: number | null;
  offset: number | null;
}

interface GeneratorQuery {
  queryType: SparqlQueryType;
  variables?: object[];
  template?: { subject: Term; predicate: Term; object: Term }[];
  where?: object[];
  limit?: number;
  offset?: number;
  order?: { descending: boolean; expression: Term }[];
}

/**
 * RegEx to test a URI
 *
 * As defined in https://www.rfc-editor.org/rfc/rfc3986#page-50
 * Slightly modified to expect a protocoll
 */
const URI_REGEX = /^(([^:/?#]+):)+(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;

export class QueryBuilder {
  private query: GeneratorQuery;

  constructor(queryType: QueryType) {
    this.query = { queryType };
  }

  public static term(t: string): Term {
    if (t?.charAt(0) === '?') {
      return { termType: 'Variable', value: t.substring(1) };
    }
    if (URI_REGEX.test(t)) {
      return { termType: 'NamedNode', value: t };
    }
    return { termType: 'Literal', value: String(t) };
  }

  public static termToString(t: Term): string {
    if (t.termType === 'Variable') {
      return '?' + t.value;
    }
    return t.value;
  }

  public addModifiers(modifiers: Modifiers) {
    if (modifiers.limit !== null) {
      this.query.limit = modifiers.limit;
    }
    if (modifiers.offset !== null) {
      this.query.offset = modifiers.offset;
    }
    if (modifiers.orderByDir !== '') {
      this.query.order = [
        {
          expression: QueryBuilder.term(modifiers.orderBy || ''),
          descending: modifiers.orderByDir === 'DESCENDING',
        },
      ];
    }
  }

  public addWhereTriples(triples: object[]) {
    this.query.where = [{ type: 'bgp', triples: triples }];
  }

  public addDescribeTargets(targets: string[]) {
    this.query.variables = targets?.map((t) => ({
      termType: 'NamedNode',
      value: t,
    }));
  }

  public select(variables: Term[]) {
    if (this.query.queryType === 'SELECT') {
      this.query.variables = variables;
    } else {
      this.query.template = [
        {
          subject: variables[0],
          predicate: variables[1],
          object: variables[2],
        },
      ];
    }
  }

  public template(
    template: { subject: Term; predicate: Term; object: Term }[]
  ) {
    this.query.template = template;
  }

  public getQuery(): GeneratorQuery {
    return this.query;
  }
}
