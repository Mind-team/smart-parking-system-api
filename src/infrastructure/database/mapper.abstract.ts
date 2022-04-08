export type Additional = {
  data?: { [param: string]: unknown };
  documents?: { [documentName: string]: unknown };
  models?: { [modelName: string]: unknown };
  options?: { isNotThrowError?: boolean };
};

export abstract class Mapper<Model, Document> {
  abstract fromDB(id: string, additional?: Additional): Promise<Model>;

  abstract fromDocument(
    document: Document,
    additional?: Additional,
  ): Promise<Model>;

  abstract toDocument(model: Model, additional?: Additional): Promise<Document>;
}
