export class ModuleContext {
  constructor(
    private moduleId: string,
    private modules: Map<string, any>,
  ) {}

  set(module: any) {
    this.modules.set(this.moduleId, module);
  }

  get<T>(moduleId: string): T {
    const module = this.modules.get(moduleId);
    return module;
  }
}

export type ModuleEventHandler = (ctx: ModuleContext) => (Promise<void> | void);

export interface ModuleOptions {
  required?: string[];
  onRegister?: ModuleEventHandler;
  onStart?: ModuleEventHandler;
};

export interface ModuleInfo {
  name: string;
  required: string[];
  onRegister: ModuleEventHandler;
  onStart: ModuleEventHandler;
};

let modules: ModuleInfo[] = [];
const moduleTable = new Map();

export function defineModule(name: string, opts: ModuleOptions) {
  const defaultHandler = () => {};
  const moduleInfo: ModuleInfo = {
    name: name,
    required: opts.required ?? [],
    onRegister: opts.onRegister ?? defaultHandler,
    onStart: opts.onStart ?? defaultHandler,
  };
  modules.push(moduleInfo);
}

export async function startModuleEngine() {
  modules = resolveModules(modules);

  for (const mod of modules) {
    const ctx = new ModuleContext(mod.name, moduleTable);
    await mod.onRegister(ctx);
  }

  for (const mod of modules) {
    const ctx = new ModuleContext(mod.name, moduleTable);
    await mod.onStart(ctx);
  }
}

function resolveModules(source: ModuleInfo[]): ModuleInfo[] {
  // トポロジカルソートによる依存関係の解決
  // https://qiita.com/s_taki/items/1d94e5e9544ebbf32778
  const remaining: ModuleInfo[] = [...source];
  const dest: ModuleInfo[] = [];

  // 残っているすべてのモジュールで処理を実行
  let i = 0;
  while (i < remaining.length) {
    const module = remaining[i]!;
    // モジュールが他のモジュールから依存されているかを確認
    const found = remaining.some(x => x.required.some(y => y == module.name));
    if (!found) {
      // モジュールをキューに移動
      dest.push(module);
      remaining.splice(i, 1);
      // 最初から
      i = 0;
    } else {
      // 次のモジュールへ
      i++;
    }
  }

  // 依存関係にループがあると解決に失敗する
  if (remaining.length > 0) {
    throw new Error("module resolution failed.");
  }

  // 依存されているモジュールから先に実行したいため逆順にする
  dest.reverse();

  return dest;
}
