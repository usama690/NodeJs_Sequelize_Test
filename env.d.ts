// env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_NAME: string;
    }
  }
  