import { masks } from 'dateformat';

masks.WME = 'yyyy-mm-dd HH:MM';

declare module 'dateformat' {
  interface DateFormatMasks {
    /**
     * @default "yyyy-mm-dd HH:MM"
     */
    WME: string;
  }
}
