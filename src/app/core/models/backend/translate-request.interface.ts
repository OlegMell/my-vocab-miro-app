export interface TranslateRequest {
    readonly text: string;
    readonly to: string;
    readonly from?: string;
}