import {
  Parser as SparqlParser,
  SparqlParser as SparqlParserInterface,
} from 'sparqljs';

export type QueryType = "SELECT"|"CONSTRUCT"|"ASK"|"DESCRIBE";

/**
 * Wraps the sparqljs parser to allow validation of and 
 * extraction of information from SPARQL queries.
 */
export class SparqlValidator {
  private sparqlParser: SparqlParserInterface;

  constructor() {
    this.sparqlParser = new SparqlParser();
  }

    /**
     * Validates the given string to the SPARQL Spec. It only catch high level errors, queries may still fail upon execution.
     */
    validate(sparql: string): boolean {
      try {
        this.sparqlParser.parse(sparql);
        return sparql.length > 0;
      } catch {
        return false;
      }
    }

    /**
     * Extracts query type of sparql queries, throws if the sparql is an update query
     */
     queryTypeOf(sparql: string): QueryType {
      const parsed = this.sparqlParser.parse(sparql);
      if (parsed.type !== 'query' || !('queryType' in parsed)) {
        throw new Error(
          'Currently, only queries are supported and no modifications.'
        );
      }
      return parsed.queryType;
    }
}
