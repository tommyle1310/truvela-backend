export const ResponseStatus = {
    'OK': { httpCode: 200, message: 'Success', code: 0 },  // Success
    'MissingInput': { httpCode: 400, message: 'Missing Input', code: 1 },  // Missing Input
    'InvalidFormatInput': { httpCode: 400, message: 'Invalid Format Input', code: 2 },  // Invalid Format Input
    'Unauthorized': { httpCode: 401, message: 'Unauthorized', code: 3 },  // Unauthorized
    'ServerError': { httpCode: 500, message: 'Server Error', code: -1 },  // Server Error
    'NotFound': { httpCode: 404, message: 'Not Found', code: -2 },  // Not Found
    'DuplicatedRecord': { httpCode: 409, message: 'Duplicated Record', code: -3 },  // Duplicated Record
    'Forbidden': { httpCode: 403, message: 'Forbidden (Authorization)', code: -4 },  // Forbidden
};
