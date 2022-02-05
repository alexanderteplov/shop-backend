export const formatJSONResponse = (body) => {
    const response = {
        statusCode: 200,
    };
    if (body) {
        Object.assign(response, { body: JSON.stringify(body) });
    }
    return response;
};
//# sourceMappingURL=apiGateway.js.map