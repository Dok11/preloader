export type AssetType = 'xhr' | 'img';

export interface Asset {
	/**
	 * Symbol code of asset
	 */
	code: string;
	type?: AssetType;
	src?: string;
	section?: string;

	/**
	 * Is asset already loaded
	 */
	isLoaded?: boolean;
}
