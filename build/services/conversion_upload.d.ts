import { CallConversion, ClickConversion } from 'google-ads-node/build/lib/resources';
import Service from './service';
export default class ConversionAdjustmentUploadService extends Service {
    uploadCallConversion(conversion: CallConversion): Promise<any>;
    uploadClickConversion(conversion: ClickConversion): Promise<any>;
}
