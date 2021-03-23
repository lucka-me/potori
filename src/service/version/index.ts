import versionJSON from '@/data/version.json';
import umiJSON from '@/data/umi/umi.json';

/**
 * Version information
 */
export namespace version {
    export const full = !document.URL.includes('lucka.moe');
    export const text = `${versionJSON.version}-${full ? 'lite' : 'full'} (${versionJSON.build})`;
    export const data = umiJSON.version;
}