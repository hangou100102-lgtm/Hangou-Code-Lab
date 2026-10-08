/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 浏览数接口地址（后端见 api/views.php）。未配置时本地开发走 localStorage 模拟 */
  readonly VITE_VIEWS_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
