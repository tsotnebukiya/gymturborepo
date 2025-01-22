interface ClerkError {
  status: number;
  errors: {
    code: string;
    message: string;
    longMessage: string;
  }[];
}
