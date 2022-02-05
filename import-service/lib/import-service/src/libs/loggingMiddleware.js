function isSqsEvent(event) {
    if (!('Records' in event))
        return false;
    return event.Records[0].body !== undefined;
}
function isS3Event(event) {
    if (!('Records' in event))
        return false;
    return event.Records[0].s3 !== undefined;
}
export const loggingMiddleware = () => {
    const before = async (request) => {
        console.log('Incoming request:', request);
        const { event } = request;
        if (isSqsEvent(event)) {
            console.log('Record body list:', event.Records.map(({ body }) => body));
        }
        ;
        if (isS3Event(event)) {
            console.log('Record key list:', event.Records.map(({ s3 }) => s3.object.key));
        }
        ;
    };
    const after = async (request) => {
        console.log('Outcoming response:', request.response);
    };
    return {
        before,
        after,
    };
};
//# sourceMappingURL=loggingMiddleware.js.map