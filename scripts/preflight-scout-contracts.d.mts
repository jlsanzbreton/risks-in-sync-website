export interface ScoutContractPreflightOptions {
  websiteRoot?: string;
  studioRoot?: string;
  contractVersion?: number;
}

export interface ScoutContractPreflightResult {
  ok: true;
  websiteRoot: string;
  studioRoot: string;
  contractVersion: 1 | 2;
  schema: {
    path: string;
    sha256: string;
    studioByteIdentical: true;
  };
  reviewDefinition: {
    path: string;
    definitionId: "cascade-risk-review";
    definitionVersion: 1 | 2;
    sha256: string;
    studioByteIdentical: true;
    provenanceMatches: true;
  };
}

export function verifyScoutContracts(options?: ScoutContractPreflightOptions): ScoutContractPreflightResult;
