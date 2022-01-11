import {ExecutorContext} from '@nrwl/devkit';
import {download, extract} from 'gitly';

export interface IContentExecutorOptions {
  repository: string;
}

export default async function contentExecutor(options: IContentExecutorOptions, context: ExecutorContext) {
  const source = await download(options.repository);
  const path = await extract(source, './content');
  const isSuccessDownload = Boolean(path);
  if (!isSuccessDownload) {
    return { success: false };
  }

  return { success: true };
}
