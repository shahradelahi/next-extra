declare global {
  module 'next/dist/client/components/static-generation-async-storage.external' {
    export interface StaticGenerationStore {
      readonly urlPathname?: string;
    }
  }

  module 'next/dist/client/components/request-async-storage.external' {
    export interface RequestStore {
      readonly url?: {
        readonly pathname: string;
        readonly search: string;
      };
    }
  }
}
