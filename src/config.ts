import fs from "fs";
import os from "os";
import path from "path";

// نوع Config بالكاميل كيس
export type Config = {
  dbUrl: string;
  currentUserName?: string;
};

// النوع الداخلي لتمثيل JSON في الملف (snake_case)+
type RawConfig = {
  db_url: string;
  current_user_name?: string;
};

// مسار الملف في HOME
const getConfigFilePath = (): string => {
  return path.join(os.homedir(), ".gatorconfig.json");
};

// تحويل Config → RawConfig وكتابة الملف
const writeConfig = (cfg: Config): void => {
  const raw: RawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  fs.writeFileSync(getConfigFilePath(), JSON.stringify(raw, null, 2));
};

// التحقق من صحة JSON بعد القراءة
const validateConfig = (rawConfig: any): Config => {
  if (typeof rawConfig.db_url !== "string") {
    throw new Error("Invalid config: db_url is required");
  }
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
};

// قراءة الملف وتحويله إلى Config
export const readConfig = (): Config => {
  const raw = fs.readFileSync(getConfigFilePath(), { encoding: "utf-8" });
  const parsed = JSON.parse(raw);
  return validateConfig(parsed);
};

// تعيين المستخدم الحالي وتحديث الملف
export const setUser = (userName: string): void => {
  const cfg = readConfig();
  cfg.currentUserName = userName;
  writeConfig(cfg);
};
export const getUser = (): string | undefined=> {
  const cfg = readConfig();
  return cfg.currentUserName;
};