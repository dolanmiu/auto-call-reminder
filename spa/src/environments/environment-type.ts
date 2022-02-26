export interface Environment {
  readonly production: boolean;
  readonly firebase: { readonly [key: string]: string };
  readonly brandName: string;
}
