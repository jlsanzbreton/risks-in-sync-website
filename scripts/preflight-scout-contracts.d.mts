export interface ScoutContractPreflightOptions {
  websiteRoot?: string;
  studioRoot?: string;
}

export interface ScoutContractPreflightResult {
  ok: true;
  websiteRoot: string;
  studioRoot: string;
  schema: {
    path: string;
    sha256: string;
    studioByteIdentical: true;
  };
  reviewDefinition: {
    path: string;
    definitionId: "cascade-risk-review";
    definitionVersion: 1;
    sha256: string;
    studioByteIdentical: true;
    provenanceMatches: true;
  };
}

export function verifyScoutContracts(options?: ScoutContractPreflightOptions): ScoutContractPreflightResult;
