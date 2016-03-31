export default class SafePromise<T> implements Promise<T> {

    public static defaultErrorHandler: (e: any) => void = (e: any) => {
        console.error("(using default promise error handler)");
        setTimeout(() => {
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
            setTimeout(() => { throw e; });
        }
    }

    then(onfulfilled?:(value?:T)=>(Promise<T>|T|void), onrejected?:(reason:any)=>(PromiseLike<T>|T)):Promise<T> {
        this.subPromise.then(<any> onfulfilled, onrejected);
        return this;
    }

    catch(onrejected?:(reason?:any)=>(Promise<T>|T|void)):Promise<T> {
        console.log("DEBUG: Catching promise errors!");
        this.onrejected = <any> onrejected;
        return this;
    }
}
