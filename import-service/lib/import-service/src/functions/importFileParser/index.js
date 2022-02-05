import { handlerPath } from '@libs/handlerResolver';
export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            s3: {
                bucket: 'magic-files',
                event: 's3:ObjectCreated:*',
                rules: [{
                        prefix: 'uploaded/',
                    }],
                existing: true,
            },
        }
    ]
};
//# sourceMappingURL=index.js.map