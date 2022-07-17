export type SPARQL = string;

export interface Query {
  sparql: SPARQL;
  title: string;
}

export interface ExecutedQuery extends Query {
  executedAt: string; // ISO String
}

export interface History {
  storedLocally: boolean;
  enableLocalStorage: () => void;
  disableLocalStorage: () => void;
  queries: ExecutedQuery[];
}
