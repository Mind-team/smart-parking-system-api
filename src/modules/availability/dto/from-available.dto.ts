export class FromAvailableDto {
  guardData: {
    isAuth: boolean;
    decodedJwt:
      | Record<string, never>
      | {
          id: string;
          phone: string;
        };
  };
}
