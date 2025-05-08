/**
 * 文字列として環境変数を取得します。
*/
export function getEnvString(key: string, defaultValue: string): string {
  const value = process.env[key];
  if (value == null) {
    return defaultValue;
  }
  return value;
}

/**
 * 整数値として環境変数を取得します。
 * 変換に失敗した場合はエラーを発生させます。
*/
export function getEnvInteger(key: string, defaultValue: number): number {
  const valueSource = process.env[key];
  if (valueSource == null) {
    return defaultValue;
  }
  const value = Number.parseInt(valueSource);
  if (Number.isNaN(value)) {
    throw new TypeError(`Failed to convert type for environment variable '${key}'.`);
  }
  return value;
}
