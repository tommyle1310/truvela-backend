import { HttpException } from "@nestjs/common";
import { ResponseStatus } from "./constants";

type ResponseData = {
    EC: number; // Custom error code (from HttpStatus)
    EM: string; // Custom message
    data?: any; // Optional additional data
};

export function createResponse(
    httpStatus: 'OK' | 'MissingInput' | 'InvalidFormatInput' | 'Unauthorized' | 'ServerError' | 'NotFound' | 'DuplicatedRecord' | 'Forbidden',
    data?: any,
    message?: string,
): ResponseData {
    // Access the corresponding status object from HttpStatus
    const status = ResponseStatus[httpStatus]; // This will return the corresponding status object like { httpCode: 200, message: 'Success', code: 0 }

    // Use the provided message or fallback to the message in HttpStatus
    const responseMessage = message || status.message;

    // Create the response object
    const response: ResponseData = {
        EC: status.code,
        EM: responseMessage,
    };

    // Add data to response if it was provided
    if (data !== undefined) {
        response.data = data;
    }

    // Check if it's an error status, and throw an HttpException
    if (status.httpCode >= 400) {
        throw new HttpException(response, status.httpCode);  // Throw HttpException with the response and the status code
    }

    // If it's not an error, return the response
    return response;
}


