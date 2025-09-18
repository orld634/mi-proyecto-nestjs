declare module 'bcrypt' {
  export function compare(data: string | Buffer, encrypted: string): Promise<boolean>;
  export function hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
  export function genSalt(rounds?: number): Promise<string>;
}

declare module 'nodemailer' {
  export interface SendMailOptions {
    from?: string;
    to?: string | string[];
    subject?: string;
    text?: string;
    html?: string;
  }

  export interface SentMessageInfo {
    accepted: string[];
    rejected: string[];
    response: string;
  }

  export interface Transporter {
    sendMail(mail: SendMailOptions): Promise<SentMessageInfo>;
  }

  // 👉 Usa un tipo más concreto en lugar de `any`
  export interface TransportOptions {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
  }

  export function createTransport(options: TransportOptions): Transporter;

  const nodemailer: {
    createTransport: typeof createTransport;
  };

  export default nodemailer;
}
