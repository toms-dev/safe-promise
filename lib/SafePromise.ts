export default class SafePromise<T> implements Promise<T> {

	private enabled: boolean;

    public static defaultErrorHandler: (e: any) => void = (e: any) => {
        console.error("(using default promise error handler)");
        setTimeout(() => {
            throw e;
        });
    };

    private subPromise: Promise<T>;

    constructor(callback: (resolve : (value?: T | Thenable<T>) => void, reject: (error?: any) => void) => void) {
        this.subPromise = new Promise<T>(callback);
        this.enabled = true;

        // Wrap the catch with a default behavior
        this.subPromise.catch((reason: any) => {
            this.onCatch(reason);
        });
    }

    private onCatch(reason: any): void {
    	if (! this.enabled) return;
		if (SafePromise.defaultErrorHandler) {
        	SafePromise.defaultErrorHandler(reason)
        }
    }

    then(onfulfilled?:(value?:T)=>(Promise<T>|T|void), onrejected?:(reason:any)=>(PromiseLike<T>|T)):Promise<T> {
        return this.subPromise.then((value?: T) => {
		    	try {
		    		return (<any> onfulfilled)(value) || this;
		    	} catch(e) {
		    		this.onCatch(e);
		    		throw e;
		    	}
        	},
        	(reason: any) => {
		    	try {
		    		onrejected(reason);
		    	} catch(e) {
		    		this.onCatch(e);
		    		throw e;
		    	}
		    });
    }

    catch(onrejected?:(reason?:any)=>(Promise<T>|T|void)):Promise<T> {
    	this.enabled = false;
		this.subPromise.catch((reason: any) => {
			// Wrap the error handling as it may also fail.
		    try {
				onrejected(reason);
		    } catch (e) {
		        console.error('Error while handling error in promise catch (#inception).');
		        setTimeout(() => { throw e; });
		    }		
		});
        return this;
    }
}
