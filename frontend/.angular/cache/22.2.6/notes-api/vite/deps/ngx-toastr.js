import { $a as ɵɵdomElementEnd, Ai as setClassMetadata, Bo as ɵɵnextContext, Es as ɵɵstoreLet, Fs as ɵɵtextInterpolate1, Ga as ɵɵdefineNgModule, Gt as ChangeDetectionStrategy, Ji as ɵɵInheritDefinitionFeature, Jt as Component, M as createComponent, Nn as NgModule, Ns as ɵɵtext, Os as ɵɵstyleProp, Qa as ɵɵdomElementContainerStart, Qi as ɵɵanimateEnter, Ro as ɵɵlistener, Ua as ɵɵdefineComponent, Vt as ApplicationRef, Wa as ɵɵdefineDirective, Ya as ɵɵdomElement, Za as ɵɵdomElementContainerEnd, Zi as ɵɵadvance, _o as ɵɵgetInheritedFactory, aa as ɵɵattribute, ca as ɵɵclassMap, cs as ɵɵreadContextLet, da as ɵɵconditional, eo as ɵɵdomElementStart, fn as ElementRef, go as ɵɵgetCurrentView, no as ɵɵdomProperty, pa as ɵɵconditionalCreate, to as ɵɵdomListener, un as Directive, va as ɵɵdeclareLet, vs as ɵɵsanitizeHtml, xn as Injectable } from "./core-CP38VavK.js";
import { Qn as Subject } from "./esm5-Doa4YBQt.js";
import { r as DomSanitizer } from "./platform-browser-DihMvTi0.js";
import { T as DOCUMENT, U as InjectionToken, Ui as signal, W as Injector, c as computed, dt as SecurityContext, et as NgZone, la as ɵɵdefineInjectable, p as linkedSignal, si as makeEnvironmentProviders, ua as ɵɵdefineInjector, va as ɵɵresetView, wr as inject, ya as ɵɵrestoreView } from "./_resource-chunk-SRLM8pPW.js";
// node_modules/ngx-toastr/fesm2022/ngx-toastr.mjs
var ToastContainerDirective = class ToastContainerDirective {
	el = inject(ElementRef);
	getContainerElement() {
		return this.el.nativeElement;
	}
	static ɵfac = function ToastContainerDirective_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || ToastContainerDirective)();
	};
	static ɵdir = /*@__PURE__*/ ɵɵdefineDirective({
		type: ToastContainerDirective,
		selectors: [[
			"",
			"toastContainer",
			""
		]],
		exportAs: ["toastContainer"]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastContainerDirective, [{
		type: Directive,
		args: [{
			selector: "[toastContainer]",
			exportAs: "toastContainer",
			standalone: true
		}]
	}], null, null);
})();
/**
* Everything a toast needs to launch
*/
var ToastPackage = class {
	toastId;
	config;
	message;
	title;
	toastType;
	toastRef;
	_onTap = new Subject();
	_onAction = new Subject();
	constructor(toastId, config, message, title, toastType, toastRef) {
		this.toastId = toastId;
		this.config = config;
		this.message = message;
		this.title = title;
		this.toastType = toastType;
		this.toastRef = toastRef;
		this.toastRef.afterClosed().subscribe(() => {
			this._onAction.complete();
			this._onTap.complete();
		});
	}
	/** Fired on click */
	triggerTap() {
		this._onTap.next();
		if (this.config.tapToDismiss) this._onTap.complete();
	}
	onTap() {
		return this._onTap.asObservable();
	}
	/** available for use in custom toast */
	triggerAction(action) {
		this._onAction.next(action);
	}
	onAction() {
		return this._onAction.asObservable();
	}
};
var DefaultNoComponentGlobalConfig = {
	maxOpened: 0,
	autoDismiss: false,
	newestOnTop: true,
	preventDuplicates: false,
	countDuplicates: false,
	resetTimeoutOnDuplicate: false,
	includeTitleDuplicates: false,
	iconClasses: {
		error: "toast-error",
		info: "toast-info",
		success: "toast-success",
		warning: "toast-warning"
	},
	closeButton: false,
	disableTimeOut: false,
	timeOut: 5e3,
	extendedTimeOut: 1e3,
	enableHtml: false,
	progressBar: false,
	toastClass: "ngx-toastr",
	positionClass: "toast-top-right",
	titleClass: "toast-title",
	messageClass: "toast-message",
	easing: "ease-in",
	easeTime: 300,
	tapToDismiss: true,
	onActivateTick: false,
	progressAnimation: "decreasing"
};
var TOAST_CONFIG = new InjectionToken("ToastConfig");
/**
* A `ComponentPortal` is a portal that instantiates some Component upon attachment.
*/
var ComponentPortal = class {
	_attachedHost;
	/** The type of the component that will be instantiated for attachment. */
	component;
	/**
	* [Optional] Where the attached component should live in Angular's *logical* component tree.
	* This is different from where the component *renders*, which is determined by the PortalHost.
	* The origin necessary when the host is outside of the Angular application context.
	*/
	viewContainerRef;
	/** Injector used for the instantiation of the component. */
	injector;
	constructor(component, injector) {
		this.component = component;
		this.injector = injector;
	}
	/** Attach this portal to a host. */
	attach(host, newestOnTop) {
		this._attachedHost = host;
		return host.attach(this, newestOnTop);
	}
	/** Detach this portal from its host */
	detach() {
		const host = this._attachedHost;
		if (host) {
			this._attachedHost = void 0;
			return host.detach();
		}
	}
	/** Whether this portal is attached to a host. */
	get isAttached() {
		return this._attachedHost != null;
	}
	/**
	* Sets the PortalHost reference without performing `attach()`. This is used directly by
	* the PortalHost when it is performing an `attach()` or `detach()`.
	*/
	setAttachedHost(host) {
		this._attachedHost = host;
	}
};
/**
* Partial implementation of PortalHost that only deals with attaching a
* ComponentPortal
*/
var BasePortalHost = class {
	/** The portal currently attached to the host. */
	_attachedPortal;
	/** A function that will permanently dispose this host. */
	_disposeFn;
	attach(portal, newestOnTop) {
		this._attachedPortal = portal;
		return this.attachComponentPortal(portal, newestOnTop);
	}
	detach() {
		if (this._attachedPortal) this._attachedPortal.setAttachedHost();
		this._attachedPortal = void 0;
		if (this._disposeFn) {
			this._disposeFn();
			this._disposeFn = void 0;
		}
	}
	setDisposeFn(fn) {
		this._disposeFn = fn;
	}
};
/**
* A PortalHost for attaching portals to an arbitrary DOM element outside of the Angular
* application context.
*
* This is the only part of the portal core that directly touches the DOM.
*/
var DomPortalHost = class extends BasePortalHost {
	_hostDomElement;
	_appRef;
	constructor(_hostDomElement, _appRef) {
		super();
		this._hostDomElement = _hostDomElement;
		this._appRef = _appRef;
	}
	/**
	* Attach the given ComponentPortal to DOM element using the ComponentFactoryResolver.
	* @param portal Portal to be attached
	*/
	attachComponentPortal(portal, newestOnTop) {
		const componentRef = createComponent(portal.component, {
			environmentInjector: this._appRef.injector,
			elementInjector: portal.injector
		});
		this._appRef.attachView(componentRef.hostView);
		this.setDisposeFn(() => {
			this._appRef.detachView(componentRef.hostView);
			componentRef.destroy();
		});
		if (newestOnTop) this._hostDomElement.insertBefore(this._getComponentRootNode(componentRef), this._hostDomElement.firstChild);
		else this._hostDomElement.appendChild(this._getComponentRootNode(componentRef));
		return componentRef;
	}
	/** Gets the root HTMLElement for an instantiated component. */
	_getComponentRootNode(componentRef) {
		return componentRef.hostView.rootNodes[0];
	}
};
/** Container inside which all toasts will render. */
var OverlayContainer = class OverlayContainer {
	_document = inject(DOCUMENT);
	_containerElement;
	ngOnDestroy() {
		if (this._containerElement && this._containerElement.parentNode) this._containerElement.parentNode.removeChild(this._containerElement);
	}
	/**
	* This method returns the overlay container element. It will lazily
	* create the element the first time  it is called to facilitate using
	* the container in non-browser environments.
	* @returns the container element
	*/
	getContainerElement() {
		if (!this._containerElement) this._createContainer();
		return this._containerElement;
	}
	/**
	* Create the overlay container element, which is simply a div
	* with the 'cdk-overlay-container' class on the document body
	* and 'aria-live="polite"'
	*/
	_createContainer() {
		const container = this._document.createElement("div");
		container.classList.add("overlay-container");
		container.setAttribute("aria-live", "polite");
		this._document.body.appendChild(container);
		this._containerElement = container;
	}
	static ɵfac = function OverlayContainer_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || OverlayContainer)();
	};
	static ɵprov = /*@__PURE__*/ ɵɵdefineInjectable({
		token: OverlayContainer,
		factory: OverlayContainer.ɵfac,
		providedIn: "root"
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayContainer, [{
		type: Injectable,
		args: [{ providedIn: "root" }]
	}], null, null);
})();
/**
* Reference to an overlay that has been created with the Overlay service.
* Used to manipulate or dispose of said overlay.
*/
var OverlayRef = class {
	_portalHost;
	constructor(_portalHost) {
		this._portalHost = _portalHost;
	}
	attach(portal, newestOnTop = true) {
		return this._portalHost.attach(portal, newestOnTop);
	}
	/**
	* Detaches an overlay from a portal.
	* @returns Resolves when the overlay has been detached.
	*/
	detach() {
		return this._portalHost.detach();
	}
};
/**
* Service to create Overlays. Overlays are dynamically added pieces of floating UI, meant to be
* used as a low-level building building block for other components. Dialogs, tooltips, menus,
* selects, etc. can all be built using overlays. The service should primarily be used by authors
* of re-usable components rather than developers building end-user applications.
*
* An overlay *is* a PortalHost, so any kind of Portal can be loaded into one.
*/
var Overlay = class Overlay {
	_overlayContainer = inject(OverlayContainer);
	_appRef = inject(ApplicationRef);
	_document = inject(DOCUMENT);
	_paneElements = /* @__PURE__ */ new Map();
	/**
	* Creates an overlay.
	* @returns A reference to the created overlay.
	*/
	create(positionClass, overlayContainer) {
		return this._createOverlayRef(this.getPaneElement(positionClass, overlayContainer));
	}
	getPaneElement(positionClass = "", overlayContainer) {
		if (!this._paneElements.get(overlayContainer)) this._paneElements.set(overlayContainer, {});
		if (!this._paneElements.get(overlayContainer)[positionClass]) this._paneElements.get(overlayContainer)[positionClass] = this._createPaneElement(positionClass, overlayContainer);
		return this._paneElements.get(overlayContainer)[positionClass];
	}
	/**
	* Creates the DOM element for an overlay and appends it to the overlay container.
	* @returns Newly-created pane element
	*/
	_createPaneElement(positionClass, overlayContainer) {
		const pane = this._document.createElement("div");
		pane.id = "toast-container";
		pane.classList.add(positionClass);
		pane.classList.add("toast-container");
		if (!overlayContainer) this._overlayContainer.getContainerElement().appendChild(pane);
		else overlayContainer.getContainerElement().appendChild(pane);
		return pane;
	}
	/**
	* Create a DomPortalHost into which the overlay content can be loaded.
	* @param pane The DOM element to turn into a portal host.
	* @returns A portal host for the given DOM element.
	*/
	_createPortalHost(pane) {
		return new DomPortalHost(pane, this._appRef);
	}
	/**
	* Creates an OverlayRef for an overlay in the given DOM element.
	* @param pane DOM element for the overlay
	*/
	_createOverlayRef(pane) {
		return new OverlayRef(this._createPortalHost(pane));
	}
	static ɵfac = function Overlay_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || Overlay)();
	};
	static ɵprov = /*@__PURE__*/ ɵɵdefineInjectable({
		token: Overlay,
		factory: Overlay.ɵfac,
		providedIn: "root"
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Overlay, [{
		type: Injectable,
		args: [{ providedIn: "root" }]
	}], null, null);
})();
/**
* Reference to a toast opened via the Toastr service.
*/
var ToastRef = class {
	_overlayRef;
	/** The instance of component opened into the toast. */
	componentInstance;
	/** Count of duplicates of this toast */
	duplicatesCount = 0;
	/** Subject for notifying the user that the toast has finished closing. */
	_afterClosed = new Subject();
	/** triggered when toast is activated */
	_activate = new Subject();
	/** notifies the toast that it should close before the timeout */
	_manualClose = new Subject();
	/** notifies the toast that it should reset the timeouts */
	_resetTimeout = new Subject();
	/** notifies the toast that it should count a duplicate toast */
	_countDuplicate = new Subject();
	constructor(_overlayRef) {
		this._overlayRef = _overlayRef;
	}
	manualClose() {
		this._manualClose.next();
		this._manualClose.complete();
	}
	manualClosed() {
		return this._manualClose.asObservable();
	}
	timeoutReset() {
		return this._resetTimeout.asObservable();
	}
	countDuplicate() {
		return this._countDuplicate.asObservable();
	}
	/**
	* Close the toast.
	*/
	close() {
		this._overlayRef.detach();
		this._afterClosed.next();
		this._manualClose.next();
		this._afterClosed.complete();
		this._manualClose.complete();
		this._activate.complete();
		this._resetTimeout.complete();
		this._countDuplicate.complete();
	}
	/** Gets an observable that is notified when the toast is finished closing. */
	afterClosed() {
		return this._afterClosed.asObservable();
	}
	isInactive() {
		return this._activate.closed;
	}
	activate() {
		this._activate.next();
		this._activate.complete();
	}
	/** Gets an observable that is notified when the toast has started opening. */
	afterActivate() {
		return this._activate.asObservable();
	}
	/** Reset the toast timouts and count duplicates */
	onDuplicate(resetTimeout, countDuplicate) {
		if (resetTimeout) this._resetTimeout.next();
		if (countDuplicate) this._countDuplicate.next(++this.duplicatesCount);
	}
};
var ToastrService = class ToastrService {
	overlay = inject(Overlay);
	_injector = inject(Injector);
	sanitizer = inject(DomSanitizer);
	ngZone = inject(NgZone);
	toastrConfig;
	currentlyActive = 0;
	toasts = [];
	overlayContainer;
	previousToastMessage;
	index = 0;
	constructor() {
		const token = inject(TOAST_CONFIG);
		this.toastrConfig = {
			...token.default,
			...token.config
		};
		if (token.config.iconClasses) this.toastrConfig.iconClasses = {
			...token.default.iconClasses,
			...token.config.iconClasses
		};
	}
	/** show toast */
	show(message, title, override = {}, type = "") {
		return this._preBuildNotification(type, message, title, this.applyConfig(override));
	}
	/** show successful toast */
	success(message, title, override = {}) {
		const type = this.toastrConfig.iconClasses.success || "";
		return this._preBuildNotification(type, message, title, this.applyConfig(override));
	}
	/** show error toast */
	error(message, title, override = {}) {
		const type = this.toastrConfig.iconClasses.error || "";
		return this._preBuildNotification(type, message, title, this.applyConfig(override));
	}
	/** show info toast */
	info(message, title, override = {}) {
		const type = this.toastrConfig.iconClasses.info || "";
		return this._preBuildNotification(type, message, title, this.applyConfig(override));
	}
	/** show warning toast */
	warning(message, title, override = {}) {
		const type = this.toastrConfig.iconClasses.warning || "";
		return this._preBuildNotification(type, message, title, this.applyConfig(override));
	}
	/**
	* Remove all or a single toast by id
	*/
	clear(toastId) {
		for (const toast of this.toasts) if (toastId !== void 0) {
			if (toast.toastId === toastId) {
				toast.toastRef.manualClose();
				return;
			}
		} else toast.toastRef.manualClose();
	}
	/**
	* Remove and destroy a single toast by id
	*/
	remove(toastId) {
		const found = this._findToast(toastId);
		if (!found) return false;
		found.activeToast.toastRef.close();
		this.toasts.splice(found.index, 1);
		this.currentlyActive = this.currentlyActive - 1;
		if (!this.toastrConfig.maxOpened || !this.toasts.length) return false;
		if (this.currentlyActive < this.toastrConfig.maxOpened && this.toasts[this.currentlyActive]) {
			const p = this.toasts[this.currentlyActive].toastRef;
			if (!p.isInactive()) {
				this.currentlyActive = this.currentlyActive + 1;
				p.activate();
			}
		}
		return true;
	}
	/**
	* Determines if toast message is already shown
	*/
	findDuplicate(title = "", message = "", resetOnDuplicate, countDuplicates) {
		const { includeTitleDuplicates } = this.toastrConfig;
		for (const toast of this.toasts) {
			const hasDuplicateTitle = includeTitleDuplicates && toast.title === title;
			if ((!includeTitleDuplicates || hasDuplicateTitle) && toast.message === message) {
				toast.toastRef.onDuplicate(resetOnDuplicate, countDuplicates);
				return toast;
			}
		}
		return null;
	}
	/** create a clone of global config and apply individual settings */
	applyConfig(override = {}) {
		return {
			...this.toastrConfig,
			...override
		};
	}
	/**
	* Find toast object by id
	*/
	_findToast(toastId) {
		for (let i = 0; i < this.toasts.length; i++) if (this.toasts[i].toastId === toastId) return {
			index: i,
			activeToast: this.toasts[i]
		};
		return null;
	}
	/**
	* Determines the need to run inside angular's zone then builds the toast
	*/
	_preBuildNotification(toastType, message, title, config) {
		if (config.onActivateTick) return this.ngZone.run(() => this._buildNotification(toastType, message, title, config));
		return this._buildNotification(toastType, message, title, config);
	}
	/**
	* Creates and attaches toast data to component
	* returns the active toast, or in case preventDuplicates is enabled the original/non-duplicate active toast.
	*/
	_buildNotification(toastType, message, title, config) {
		if (!config.toastComponent) throw new Error("toastComponent required");
		const duplicate = this.findDuplicate(title, message, this.toastrConfig.resetTimeoutOnDuplicate && config.timeOut > 0, this.toastrConfig.countDuplicates);
		if ((this.toastrConfig.includeTitleDuplicates && title || message) && this.toastrConfig.preventDuplicates && duplicate !== null) return duplicate;
		this.previousToastMessage = message;
		let keepInactive = false;
		if (this.toastrConfig.maxOpened && this.currentlyActive >= this.toastrConfig.maxOpened) {
			keepInactive = true;
			if (this.toastrConfig.autoDismiss) this.clear(this.toasts[0].toastId);
		}
		const overlayRef = this.overlay.create(config.positionClass, this.overlayContainer);
		this.index = this.index + 1;
		let sanitizedMessage = message;
		if (message && config.enableHtml) sanitizedMessage = this.sanitizer.sanitize(SecurityContext.HTML, message);
		const toastRef = new ToastRef(overlayRef);
		const toastPackage = new ToastPackage(this.index, config, sanitizedMessage, title, toastType, toastRef);
		/** New injector that contains an instance of `ToastPackage`. */
		const providers = [{
			provide: ToastPackage,
			useValue: toastPackage
		}];
		const toastInjector = Injector.create({
			providers,
			parent: this._injector
		});
		const component = new ComponentPortal(config.toastComponent, toastInjector);
		const portal = overlayRef.attach(component, config.newestOnTop);
		toastRef.componentInstance = portal.instance;
		const ins = {
			toastId: this.index,
			title: title || "",
			message: message || "",
			toastRef,
			onShown: toastRef.afterActivate(),
			onHidden: toastRef.afterClosed(),
			onTap: toastPackage.onTap(),
			onAction: toastPackage.onAction(),
			portal
		};
		if (!keepInactive) {
			this.currentlyActive = this.currentlyActive + 1;
			setTimeout(() => {
				ins.toastRef.activate();
			});
		}
		this.toasts.push(ins);
		return ins;
	}
	static ɵfac = function ToastrService_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || ToastrService)();
	};
	static ɵprov = /*@__PURE__*/ ɵɵdefineInjectable({
		token: ToastrService,
		factory: ToastrService.ɵfac,
		providedIn: "root"
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastrService, [{
		type: Injectable,
		args: [{ providedIn: "root" }]
	}], () => [], null);
})();
var TimeoutsService = class TimeoutsService {
	ngZone = inject(NgZone);
	setInterval(func, timeout) {
		if (this.ngZone) return this.ngZone.runOutsideAngular(() => window.setInterval(() => this.runInsideAngular(func), timeout));
		else return window.setInterval(() => func(), timeout);
	}
	setTimeout(func, timeout) {
		if (this.ngZone) return this.ngZone.runOutsideAngular(() => window.setTimeout(() => this.runInsideAngular(func), timeout));
		else return window.setTimeout(() => func(), timeout);
	}
	runInsideAngular(func) {
		if (this.ngZone) this.ngZone.run(() => func());
		else func();
	}
	static ɵfac = function TimeoutsService_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || TimeoutsService)();
	};
	static ɵprov = /*@__PURE__*/ ɵɵdefineInjectable({
		token: TimeoutsService,
		factory: TimeoutsService.ɵfac,
		providedIn: "root"
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TimeoutsService, [{
		type: Injectable,
		args: [{ providedIn: "root" }]
	}], null, null);
})();
var ToastBase = class ToastBase {
	toastPackage = inject(ToastPackage);
	toastrService = inject(ToastrService);
	appRef = inject(ApplicationRef);
	timeoutsService = inject(TimeoutsService);
	duplicatesCount;
	hideTime;
	/** width of progress bar */
	width = signal(-1, ...ngDevMode ? [{ debugName: "width" }] : []);
	state = signal("inactive", ...ngDevMode ? [{ debugName: "state" }] : []);
	/** hides component when waiting to be displayed */
	displayStyle = computed(() => this.state() === "inactive" ? "none" : void 0, ...ngDevMode ? [{ debugName: "displayStyle" }] : []);
	message = computed(() => this.toastPackage.message, ...ngDevMode ? [{ debugName: "message" }] : []);
	title = computed(() => this.toastPackage.title, ...ngDevMode ? [{ debugName: "title" }] : []);
	options = linkedSignal(() => this.toastPackage.config, ...ngDevMode ? [{ debugName: "options" }] : []);
	originalTimeout = computed(() => this.toastPackage.config.timeOut, ...ngDevMode ? [{ debugName: "originalTimeout" }] : []);
	toastClasses = computed(() => `${this.toastPackage.toastType} ${this.toastPackage.config.toastClass}`, ...ngDevMode ? [{ debugName: "toastClasses" }] : []);
	timeout;
	intervalId;
	afterActivateSubscription;
	manualClosedSubscription;
	timeoutResetSubscription;
	countDuplicateSubscription;
	constructor() {
		this.afterActivateSubscription = this.toastPackage.toastRef.afterActivate().subscribe(() => {
			this.activateToast();
		});
		this.manualClosedSubscription = this.toastPackage.toastRef.manualClosed().subscribe(() => {
			this.remove();
		});
		this.timeoutResetSubscription = this.toastPackage.toastRef.timeoutReset().subscribe(() => {
			this.resetTimeout();
		});
		this.countDuplicateSubscription = this.toastPackage.toastRef.countDuplicate().subscribe((count) => {
			this.duplicatesCount = count;
		});
	}
	ngOnDestroy() {
		this.afterActivateSubscription.unsubscribe();
		this.manualClosedSubscription.unsubscribe();
		this.timeoutResetSubscription.unsubscribe();
		this.countDuplicateSubscription.unsubscribe();
		clearInterval(this.intervalId);
		clearTimeout(this.timeout);
	}
	/**
	* activates toast and sets timeout
	*/
	activateToast() {
		const options = this.options();
		this.state.set("active");
		if (!(options.disableTimeOut === true || options.disableTimeOut === "timeOut") && options.timeOut) {
			this.timeout = this.timeoutsService.setTimeout(() => this.remove(), options.timeOut);
			this.hideTime = (/* @__PURE__ */ new Date()).getTime() + options.timeOut;
			if (options.progressBar) this.intervalId = this.timeoutsService.setInterval(() => this.updateProgress(), 10);
		}
	}
	/**
	* updates progress bar width
	*/
	updateProgress() {
		const options = this.options();
		if (this.width() === 0 || this.width() === 100 || !options.timeOut) return;
		const now = (/* @__PURE__ */ new Date()).getTime();
		const remaining = this.hideTime - now;
		this.width.set(remaining / options.timeOut * 100);
		if (options.progressAnimation === "increasing") this.width.update((width) => 100 - width);
		if (this.width() <= 0) this.width.set(0);
		if (this.width() >= 100) this.width.set(100);
	}
	resetTimeout() {
		const options = this.options();
		clearTimeout(this.timeout);
		clearInterval(this.intervalId);
		this.state.set("active");
		this.options.update((options) => ({
			...options,
			timeOut: this.originalTimeout()
		}));
		this.timeout = this.timeoutsService.setTimeout(() => this.remove(), this.originalTimeout());
		this.hideTime = (/* @__PURE__ */ new Date()).getTime() + (this.originalTimeout() || 0);
		this.width.set(-1);
		if (options.progressBar) this.intervalId = this.timeoutsService.setInterval(() => this.updateProgress(), 10);
	}
	/**
	* tells toastrService to remove this toast after animation time
	*/
	remove() {
		if (this.state() === "removed") return;
		clearTimeout(this.timeout);
		this.state.set("removed");
		this.timeout = this.timeoutsService.setTimeout(() => this.toastrService.remove(this.toastPackage.toastId));
	}
	tapToast() {
		if (this.state() === "removed") return;
		this.toastPackage.triggerTap();
		if (this.options().tapToDismiss) this.remove();
	}
	stickAround() {
		if (this.state() === "removed") return;
		if (this.options().disableTimeOut !== "extendedTimeOut") {
			clearTimeout(this.timeout);
			this.options.update((options) => ({
				...options,
				timeOut: 0
			}));
			this.hideTime = 0;
			clearInterval(this.intervalId);
			this.width.set(0);
		}
	}
	delayedHideToast() {
		const options = this.options();
		if (options.disableTimeOut === true || options.disableTimeOut === "extendedTimeOut" || options.extendedTimeOut === 0 || this.state() === "removed") return;
		const extendedTimeOut = options.extendedTimeOut;
		this.timeout = this.timeoutsService.setTimeout(() => this.remove(), extendedTimeOut);
		this.options.update((options) => ({
			...options,
			timeOut: extendedTimeOut
		}));
		this.hideTime = (/* @__PURE__ */ new Date()).getTime() + (extendedTimeOut || 0);
		this.width.set(-1);
		if (options.progressBar) this.intervalId = this.timeoutsService.setInterval(() => this.updateProgress(), 10);
	}
	static ɵfac = function ToastBase_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || ToastBase)();
	};
	static ɵcmp = (function() {
		function ToastBase_Conditional_1_Template(rf, ctx) {
			if (rf & 1) {
				const _r1 = ɵɵgetCurrentView();
				ɵɵdomElementStart(0, "button", 2);
				ɵɵdomListener("click", function ToastBase_Conditional_1_Template_button_click_0_listener() {
					ɵɵrestoreView(_r1);
					const ctx_r1 = ɵɵnextContext();
					return ɵɵresetView(ctx_r1.remove());
				});
				ɵɵdomElementStart(1, "span", 3);
				ɵɵtext(2, "×");
				ɵɵdomElementEnd()();
			}
		}
		function ToastBase_Conditional_2_Conditional_2_Template(rf, ctx) {
			if (rf & 1) {
				ɵɵdomElementContainerStart(0);
				ɵɵtext(1);
				ɵɵdomElementContainerEnd();
			}
			if (rf & 2) {
				const ctx_r1 = ɵɵnextContext(2);
				ɵɵadvance();
				ɵɵtextInterpolate1("[", ctx_r1.duplicatesCount + 1, "]");
			}
		}
		function ToastBase_Conditional_2_Template(rf, ctx) {
			if (rf & 1) {
				ɵɵdomElementStart(0, "div");
				ɵɵtext(1);
				ɵɵconditionalCreate(2, ToastBase_Conditional_2_Conditional_2_Template, 2, 1, "ng-container");
				ɵɵdomElementEnd();
			}
			if (rf & 2) {
				const ctx_r1 = ɵɵnextContext();
				const _options_r3 = ɵɵreadContextLet(0);
				ɵɵclassMap(_options_r3.titleClass);
				ɵɵattribute("aria-label", ctx_r1.title());
				ɵɵadvance();
				ɵɵtextInterpolate1(" ", ctx_r1.title(), " ");
				ɵɵadvance();
				ɵɵconditional(ctx_r1.duplicatesCount ? 2 : -1);
			}
		}
		function ToastBase_Conditional_3_Conditional_0_Template(rf, ctx) {
			if (rf & 1) ɵɵdomElement(0, "div", 6);
			if (rf & 2) {
				const ctx_r1 = ɵɵnextContext(2);
				const _options_r3 = ɵɵreadContextLet(0);
				ɵɵclassMap(_options_r3.messageClass);
				ɵɵdomProperty("innerHTML", ctx_r1.message(), ɵɵsanitizeHtml);
			}
		}
		function ToastBase_Conditional_3_Conditional_1_Template(rf, ctx) {
			if (rf & 1) {
				ɵɵdomElementStart(0, "div", 7);
				ɵɵtext(1);
				ɵɵdomElementEnd();
			}
			if (rf & 2) {
				const ctx_r1 = ɵɵnextContext(2);
				const _options_r3 = ɵɵreadContextLet(0);
				ɵɵclassMap(_options_r3.messageClass);
				ɵɵattribute("aria-label", ctx_r1.message());
				ɵɵadvance();
				ɵɵtextInterpolate1(" ", ctx_r1.message(), " ");
			}
		}
		function ToastBase_Conditional_3_Template(rf, ctx) {
			if (rf & 1) ɵɵconditionalCreate(0, ToastBase_Conditional_3_Conditional_0_Template, 1, 3, "div", 4)(1, ToastBase_Conditional_3_Conditional_1_Template, 2, 4, "div", 5);
			if (rf & 2) {
				ɵɵnextContext();
				const _options_r3 = ɵɵreadContextLet(0);
				ɵɵconditional(_options_r3.enableHtml ? 0 : 1);
			}
		}
		function ToastBase_Conditional_4_Template(rf, ctx) {
			if (rf & 1) {
				ɵɵdomElementStart(0, "div");
				ɵɵdomElement(1, "div", 8);
				ɵɵdomElementEnd();
			}
			if (rf & 2) {
				const ctx_r1 = ɵɵnextContext();
				ɵɵadvance();
				ɵɵstyleProp("width", ctx_r1.width() + "%");
			}
		}
		return /*@__PURE__*/ ɵɵdefineComponent({
			type: ToastBase,
			selectors: [[
				"",
				"toast-component",
				""
			]],
			hostVars: 4,
			hostBindings: function ToastBase_HostBindings(rf, ctx) {
				if (rf & 1) ɵɵlistener("mouseenter", function ToastBase_mouseenter_HostBindingHandler() {
					return ctx.stickAround();
				})("mouseleave", function ToastBase_mouseleave_HostBindingHandler() {
					return ctx.delayedHideToast();
				})("click", function ToastBase_click_HostBindingHandler() {
					return ctx.tapToast();
				});
				if (rf & 2) {
					ɵɵclassMap(ctx.toastClasses());
					ɵɵstyleProp("display", ctx.displayStyle());
				}
			},
			decls: 5,
			vars: 5,
			consts: [
				[
					"type",
					"button",
					"aria-label",
					"Close",
					1,
					"toast-close-button"
				],
				[3, "class"],
				[
					"type",
					"button",
					"aria-label",
					"Close",
					1,
					"toast-close-button",
					3,
					"click"
				],
				["aria-hidden", "true"],
				[
					"role",
					"alert",
					3,
					"class",
					"innerHTML"
				],
				[
					"role",
					"alert",
					3,
					"class"
				],
				[
					"role",
					"alert",
					3,
					"innerHTML"
				],
				["role", "alert"],
				[1, "toast-progress"]
			],
			template: function ToastBase_Template(rf, ctx) {
				if (rf & 1) {
					ɵɵdeclareLet(0);
					ɵɵconditionalCreate(1, ToastBase_Conditional_1_Template, 3, 0, "button", 0);
					ɵɵconditionalCreate(2, ToastBase_Conditional_2_Template, 3, 5, "div", 1);
					ɵɵconditionalCreate(3, ToastBase_Conditional_3_Template, 2, 1);
					ɵɵconditionalCreate(4, ToastBase_Conditional_4_Template, 2, 2, "div");
				}
				if (rf & 2) {
					const _options_r4 = ɵɵstoreLet(ctx.options());
					ɵɵadvance();
					ɵɵconditional(_options_r4.closeButton ? 1 : -1);
					ɵɵadvance();
					ɵɵconditional(ctx.title() ? 2 : -1);
					ɵɵadvance();
					ɵɵconditional(ctx.message() ? 3 : -1);
					ɵɵadvance();
					ɵɵconditional(_options_r4.progressBar ? 4 : -1);
				}
			},
			encapsulation: 2
		});
	})();
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastBase, [{
		type: Component,
		args: [{
			selector: "[toast-component]",
			standalone: true,
			changeDetection: ChangeDetectionStrategy.OnPush,
			host: {
				"[class]": "toastClasses()",
				"[style.display]": "displayStyle()",
				"(mouseenter)": "stickAround()",
				"(mouseleave)": "delayedHideToast()",
				"(click)": "tapToast()"
			},
			template: "@let _options = options();\n\n@if (_options.closeButton) {\n  <button (click)=\"remove()\" type=\"button\" class=\"toast-close-button\" aria-label=\"Close\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n}\n\n@if (title()) {\n  <div [class]=\"_options.titleClass\" [attr.aria-label]=\"title()\">\n    {{ title() }}\n\n    @if (duplicatesCount) {\n      <ng-container>[{{ duplicatesCount + 1 }}]</ng-container>\n    }\n  </div>\n}\n\n@if (message()) {\n  @if (_options.enableHtml) {\n    <div role=\"alert\" [class]=\"_options.messageClass\" [innerHTML]=\"message()\"></div>\n  } @else {\n    <div role=\"alert\" [class]=\"_options.messageClass\" [attr.aria-label]=\"message()\">\n      {{ message() }}\n    </div>\n  }\n}\n\n@if (_options.progressBar) {\n  <div>\n    <div class=\"toast-progress\" [style.width]=\"width() + '%'\"></div>\n  </div>\n}\n"
		}]
	}], () => [], null);
})();
var Toast = class Toast extends ToastBase {
	params = {
		easeTime: this.toastPackage.config.easeTime,
		easing: "ease-in"
	};
	elementRef = inject(ElementRef);
	remove() {
		if (this.state() === "removed") return;
		clearTimeout(this.timeout);
		this.state.set("removed");
		this.elementRef.nativeElement.classList.add("toast-out");
		this.timeout = this.timeoutsService.setTimeout(() => this.toastrService.remove(this.toastPackage.toastId), +this.params.easeTime);
	}
	static ɵfac = /*@__PURE__*/ (() => {
		let ɵToast_BaseFactory = void 0;
		return function Toast_Factory(__ngFactoryType__) {
			return (ɵToast_BaseFactory || (ɵToast_BaseFactory = ɵɵgetInheritedFactory(Toast)))(__ngFactoryType__ || Toast);
		};
	})();
	static ɵcmp = (function() {
		function Toast_Conditional_1_Template(rf, ctx) {
			if (rf & 1) {
				const _r1 = ɵɵgetCurrentView();
				ɵɵdomElementStart(0, "button", 2);
				ɵɵdomListener("click", function Toast_Conditional_1_Template_button_click_0_listener() {
					ɵɵrestoreView(_r1);
					const ctx_r1 = ɵɵnextContext();
					return ɵɵresetView(ctx_r1.remove());
				});
				ɵɵdomElementStart(1, "span", 3);
				ɵɵtext(2, "×");
				ɵɵdomElementEnd()();
			}
		}
		function Toast_Conditional_2_Conditional_2_Template(rf, ctx) {
			if (rf & 1) {
				ɵɵdomElementContainerStart(0);
				ɵɵtext(1);
				ɵɵdomElementContainerEnd();
			}
			if (rf & 2) {
				const ctx_r1 = ɵɵnextContext(2);
				ɵɵadvance();
				ɵɵtextInterpolate1("[", ctx_r1.duplicatesCount + 1, "]");
			}
		}
		function Toast_Conditional_2_Template(rf, ctx) {
			if (rf & 1) {
				ɵɵdomElementStart(0, "div");
				ɵɵtext(1);
				ɵɵconditionalCreate(2, Toast_Conditional_2_Conditional_2_Template, 2, 1, "ng-container");
				ɵɵdomElementEnd();
			}
			if (rf & 2) {
				const ctx_r1 = ɵɵnextContext();
				const _options_r3 = ɵɵreadContextLet(0);
				ɵɵclassMap(_options_r3.titleClass);
				ɵɵattribute("aria-label", ctx_r1.title());
				ɵɵadvance();
				ɵɵtextInterpolate1(" ", ctx_r1.title(), " ");
				ɵɵadvance();
				ɵɵconditional(ctx_r1.duplicatesCount ? 2 : -1);
			}
		}
		function Toast_Conditional_3_Conditional_0_Template(rf, ctx) {
			if (rf & 1) ɵɵdomElement(0, "div", 6);
			if (rf & 2) {
				const ctx_r1 = ɵɵnextContext(2);
				const _options_r3 = ɵɵreadContextLet(0);
				ɵɵclassMap(_options_r3.messageClass);
				ɵɵdomProperty("innerHTML", ctx_r1.message(), ɵɵsanitizeHtml);
			}
		}
		function Toast_Conditional_3_Conditional_1_Template(rf, ctx) {
			if (rf & 1) {
				ɵɵdomElementStart(0, "div", 7);
				ɵɵtext(1);
				ɵɵdomElementEnd();
			}
			if (rf & 2) {
				const ctx_r1 = ɵɵnextContext(2);
				const _options_r3 = ɵɵreadContextLet(0);
				ɵɵclassMap(_options_r3.messageClass);
				ɵɵattribute("aria-label", ctx_r1.message());
				ɵɵadvance();
				ɵɵtextInterpolate1(" ", ctx_r1.message(), " ");
			}
		}
		function Toast_Conditional_3_Template(rf, ctx) {
			if (rf & 1) ɵɵconditionalCreate(0, Toast_Conditional_3_Conditional_0_Template, 1, 3, "div", 4)(1, Toast_Conditional_3_Conditional_1_Template, 2, 4, "div", 5);
			if (rf & 2) {
				ɵɵnextContext();
				const _options_r3 = ɵɵreadContextLet(0);
				ɵɵconditional(_options_r3.enableHtml ? 0 : 1);
			}
		}
		function Toast_Conditional_4_Template(rf, ctx) {
			if (rf & 1) {
				ɵɵdomElementStart(0, "div");
				ɵɵdomElement(1, "div", 8);
				ɵɵdomElementEnd();
			}
			if (rf & 2) {
				const ctx_r1 = ɵɵnextContext();
				ɵɵadvance();
				ɵɵstyleProp("width", ctx_r1.width() + "%");
			}
		}
		return /*@__PURE__*/ ɵɵdefineComponent({
			type: Toast,
			selectors: [[
				"",
				"toast-component",
				""
			]],
			hostVars: 4,
			hostBindings: function Toast_HostBindings(rf, ctx) {
				if (rf & 1) ɵɵanimateEnter("toast-in");
				if (rf & 2) ɵɵstyleProp("--%NS%animation-easing", ctx.params.easing)("--%NS%animation-duration", ctx.params.easeTime + "ms");
			},
			features: [ɵɵInheritDefinitionFeature],
			decls: 5,
			vars: 5,
			consts: [
				[
					"type",
					"button",
					"aria-label",
					"Close",
					1,
					"toast-close-button"
				],
				[3, "class"],
				[
					"type",
					"button",
					"aria-label",
					"Close",
					1,
					"toast-close-button",
					3,
					"click"
				],
				["aria-hidden", "true"],
				[
					"role",
					"alert",
					3,
					"class",
					"innerHTML"
				],
				[
					"role",
					"alert",
					3,
					"class"
				],
				[
					"role",
					"alert",
					3,
					"innerHTML"
				],
				["role", "alert"],
				[1, "toast-progress"]
			],
			template: function Toast_Template(rf, ctx) {
				if (rf & 1) {
					ɵɵdeclareLet(0);
					ɵɵconditionalCreate(1, Toast_Conditional_1_Template, 3, 0, "button", 0);
					ɵɵconditionalCreate(2, Toast_Conditional_2_Template, 3, 5, "div", 1);
					ɵɵconditionalCreate(3, Toast_Conditional_3_Template, 2, 1);
					ɵɵconditionalCreate(4, Toast_Conditional_4_Template, 2, 2, "div");
				}
				if (rf & 2) {
					const _options_r4 = ɵɵstoreLet(ctx.options());
					ɵɵadvance();
					ɵɵconditional(_options_r4.closeButton ? 1 : -1);
					ɵɵadvance();
					ɵɵconditional(ctx.title() ? 2 : -1);
					ɵɵadvance();
					ɵɵconditional(ctx.message() ? 3 : -1);
					ɵɵadvance();
					ɵɵconditional(_options_r4.progressBar ? 4 : -1);
				}
			},
			styles: [".toast-in[_nghost-%COMP%]{animation:_ngcontent-%COMP%_toast-animation var(--%NS%animation-duration) var(--%NS%animation-easing)}.toast-out[_nghost-%COMP%]{animation:_ngcontent-%COMP%_toast-animation var(--%NS%animation-duration) var(--%NS%animation-easing) reverse forwards}@keyframes _ngcontent-%COMP%_toast-animation{0%{opacity:0}to{opacity:1}}"]
		});
	})();
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Toast, [{
		type: Component,
		args: [{
			selector: "[toast-component]",
			host: {
				"[style.--animation-easing]": "params.easing",
				"[style.--animation-duration]": "params.easeTime + \"ms\"",
				"animate.enter": "toast-in"
			},
			standalone: true,
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: "@let _options = options();\n\n@if (_options.closeButton) {\n  <button (click)=\"remove()\" type=\"button\" class=\"toast-close-button\" aria-label=\"Close\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n}\n\n@if (title()) {\n  <div [class]=\"_options.titleClass\" [attr.aria-label]=\"title()\">\n    {{ title() }}\n\n    @if (duplicatesCount) {\n      <ng-container>[{{ duplicatesCount + 1 }}]</ng-container>\n    }\n  </div>\n}\n\n@if (message()) {\n  @if (_options.enableHtml) {\n    <div role=\"alert\" [class]=\"_options.messageClass\" [innerHTML]=\"message()\"></div>\n  } @else {\n    <div role=\"alert\" [class]=\"_options.messageClass\" [attr.aria-label]=\"message()\">\n      {{ message() }}\n    </div>\n  }\n}\n\n@if (_options.progressBar) {\n  <div>\n    <div class=\"toast-progress\" [style.width]=\"width() + '%'\"></div>\n  </div>\n}\n",
			styles: [":host.toast-in{animation:toast-animation var(--animation-duration) var(--animation-easing)}:host.toast-out{animation:toast-animation var(--animation-duration) var(--animation-easing) reverse forwards}@keyframes toast-animation{0%{opacity:0}to{opacity:1}}\n"]
		}]
	}], null, null);
})();
var DefaultGlobalConfig = {
	...DefaultNoComponentGlobalConfig,
	toastComponent: Toast
};
/**
* @description
* Provides the `TOAST_CONFIG` token with the given config.
*
* @param config The config to configure toastr.
* @returns The environment providers.
*
* @example
* ```ts
* import { provideToastr } from 'ngx-toastr';
*
* bootstrap(AppComponent, {
*   providers: [
*     provideToastr({
*       timeOut: 2000,
*       positionClass: 'toast-top-right',
*     }),
*   ],
* })
*/
var provideToastr = (config = {}) => {
	return makeEnvironmentProviders([{
		provide: TOAST_CONFIG,
		useValue: {
			default: DefaultGlobalConfig,
			config
		}
	}]);
};
var ToastrModule = class ToastrModule {
	static forRoot(config = {}) {
		return {
			ngModule: ToastrModule,
			providers: [provideToastr(config)]
		};
	}
	static ɵfac = function ToastrModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || ToastrModule)();
	};
	static ɵmod = /*@__PURE__*/ ɵɵdefineNgModule({
		type: ToastrModule,
		imports: [Toast],
		exports: [Toast]
	});
	static ɵinj = /*@__PURE__*/ ɵɵdefineInjector({});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastrModule, [{
		type: NgModule,
		args: [{
			imports: [Toast],
			exports: [Toast]
		}]
	}], null, null);
})();
var ToastrComponentlessModule = class ToastrComponentlessModule {
	static forRoot(config = {}) {
		return {
			ngModule: ToastrModule,
			providers: [{
				provide: TOAST_CONFIG,
				useValue: {
					default: DefaultNoComponentGlobalConfig,
					config
				}
			}]
		};
	}
	static ɵfac = function ToastrComponentlessModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || ToastrComponentlessModule)();
	};
	static ɵmod = /*@__PURE__*/ ɵɵdefineNgModule({ type: ToastrComponentlessModule });
	static ɵinj = /*@__PURE__*/ ɵɵdefineInjector({});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastrComponentlessModule, [{
		type: NgModule,
		args: [{}]
	}], null, null);
})();
var DefaultNoAnimationsGlobalConfig = {
	...DefaultNoComponentGlobalConfig,
	toastComponent: ToastBase
};
var ToastNoAnimationModule = class ToastNoAnimationModule {
	static forRoot(config = {}) {
		return {
			ngModule: ToastNoAnimationModule,
			providers: [{
				provide: TOAST_CONFIG,
				useValue: {
					default: DefaultNoAnimationsGlobalConfig,
					config
				}
			}]
		};
	}
	static ɵfac = function ToastNoAnimationModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || ToastNoAnimationModule)();
	};
	static ɵmod = /*@__PURE__*/ ɵɵdefineNgModule({
		type: ToastNoAnimationModule,
		imports: [ToastBase],
		exports: [ToastBase]
	});
	static ɵinj = /*@__PURE__*/ ɵɵdefineInjector({});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastNoAnimationModule, [{
		type: NgModule,
		args: [{
			imports: [ToastBase],
			exports: [ToastBase]
		}]
	}], null, null);
})();
export { BasePortalHost, ComponentPortal, DefaultGlobalConfig, DefaultNoAnimationsGlobalConfig, DefaultNoComponentGlobalConfig, Overlay, OverlayContainer, OverlayRef, TOAST_CONFIG, Toast, ToastContainerDirective, ToastBase as ToastNoAnimation, ToastNoAnimationModule, ToastPackage, ToastRef, ToastrComponentlessModule, ToastrModule, ToastrService, provideToastr };
