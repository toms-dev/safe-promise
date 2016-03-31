export default class SafePromise<T> implements Promise<T> {

    public static defaultErrorHandler: (e: any) => void = (e: any) => {
        console.error("(using default promise error handler)");
        setImmediate(() => {
            throw e;
        });
    };

    private subPromise: Promise<T>;
    private onrejected: (reason:any)=>(Promise<T>|T);

    constructor(callback: (resolve : (value?: T | Thenable<T>) => void, reject: (error?: any) => void) => void) {
        this.subPromise = new Promise<T>(callback);

        // Wrap the catch with a default behavior
        this.subPromise.catch((reason: any) => {
            this.onCatch(reason);
        });
    }

    private onCatch(reason: any): void {
        console.error("Promise error caught!");
        // Wrap the error handling as it may also fail.
        try {
            if (this.onrejected) {
                this.onrejected(reason);
            }
            else if (SafePromise.defaultErrorHandler) {
                SafePromise.defaultErrorHandler(reason)
            }
        } catch (e) {
            console.error('Error while handling error in promise (yo dawg).');
            console.error(e.stack);
        }
    }

    then(onfulfilled?:(value?:T)=>(Promise<T>|T), onrejected?:(reason:any)=>(PromiseLike<T>|T)):Promise<T> {
        this.subPromise.then(onfulfilled, onrejected);
        return this;
    }

    catch(onrejected?:(reason:any)=>(Promise<T>|T)):Promise<T> {
        console.log("DEBUG: Catching promise errors!");
        this.onrejected = onrejected;
        return this;
    }
}
