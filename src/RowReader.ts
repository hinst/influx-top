import { FluxTableMetaData, ParameterizedQuery, QueryApi } from "@influxdata/influxdb-client";

export abstract class RowReader<T> {
    protected resolve: (rowReader: T) => void =
        () => { throw new Error('Should never happen') };
    private reject: (error: Error) => void =
        () => { throw new Error('Should never happen') };
    readonly promise: Promise<T>;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    abstract next(row: string[], tableMeta: FluxTableMetaData): void;
    abstract complete(): void;

    error(error: Error) {
        this.reject(error);
    }

    async read(queryApi: QueryApi, query: string | ParameterizedQuery ) {
        queryApi.queryRows(query, this);
        return await this.promise;
    }
}