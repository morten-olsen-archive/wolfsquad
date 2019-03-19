import { Open } from 'contexts/WindowManager';
export interface App {
  name: string;
  open: (open: Open) => void;
}

const context = (require as any).context('./', true, /[a-z]+\/index.ts/)

const resolved: App[] = context.keys().map((key: string) => context(key).default);

export default resolved;