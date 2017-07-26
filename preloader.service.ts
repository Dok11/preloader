import {Injectable} from '@angular/core';
import {Asset} from './asset';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PreloaderService {
	private assetList: Asset[];
	private assetListSubject: BehaviorSubject<Asset[]>;

	private preloader: boolean;
	private preloaderSubject: BehaviorSubject<boolean>;


	constructor() {
		this.assetList = [];
		this.assetListSubject = new BehaviorSubject(this.assetList);

		this.preloader = false;
		this.preloaderSubject = new BehaviorSubject(this.preloader);
	}


	/**
	 * Method for adding asset to list of assets
	 * @param {Asset} asset
	 * @return {boolean} True if asset was added and false if else
	 */
	public addAsset(asset: Asset): boolean {
		let result: boolean = false;
		const existsAsset = this.assetList.find(item => item.code === asset.code);

		if (existsAsset) {
			// asset already exists
		} else {
			this.assetList.push(asset);
			this.checkPreloader();

			result = true;
		}

		return result;
	}


	/**
	 * Method for set status of asset
	 * @param {Asset} asset
	 * @param {boolean} status
	 */
	public setAssetStatus(asset: Asset, status: boolean): void {
		this.assetList
			.find(item => item.code === asset.code)
			.isLoaded = status;

		this.checkPreloader();
	}


	/**
	 * Set asset status isLoaded by symbol code of asset
	 * @param {string} code
	 * @param {boolean} status
	 */
	public setAssetStatusByCode(code: string, status: boolean): void {
		this.assetList.forEach(item => {
			if (item.code === code) {
				 item.isLoaded = status;
			}
		});

		this.checkPreloader();
	}


	/**
	 * Return an observable with subscription to preloader status change
	 * @return {Observable<boolean>}
	 */
	public getStatus(): Observable<boolean> {
		return this.preloaderSubject.asObservable();
	}


	/**
	 * Return an observable with subscription to current list of assets
	 * @return {Observable<Asset[]>}
	 */
	public getAssetList(): Observable<Asset[]> {
		return this.assetListSubject.asObservable();
	}


	/**
	 * Remove assets by asset section code
	 * @param {string} section
	 */
	public clearAssetListBySection(section: string): void {
		this.assetList.forEach((asset, index) => {
			if (asset.section === section) {
				this.assetList.splice(index, 1);
			}
		});
	}


	/**
	 * Check preloader status using current list of assets (this.assetList)
	 */
	private checkPreloader(): void {
		let preloader = false;

		this.assetList.forEach(asset => {
			if (asset.isLoaded !== true) {
				preloader = true;
				return;
			}
		});

		if (preloader !== this.preloader) {
			this.preloader = preloader;
			this.preloaderSubject.next(this.preloader);
		}

		this.assetListSubject.next(this.assetList);
	}

}
