

### 0: **Success** - `200 OK`
The request was successful, and the server has returned the requested data or successfully completed the request.

### 1: **Missing Input** - `400 Bad Request`
The request was malformed or missing required parameters. This error usually occurs when essential information (like form fields) is missing.

### 2: **Invalid Format Input** - `400 Bad Request`
The input provided was invalid due to a wrong format. For example, sending a string where a number is expected.

### 3: **Unauthorized** - `401 Unauthorized`
Authentication is required to access the resource. This error occurs when the user is not authenticated or the authentication token is missing or invalid.

### -1: **Server Error** - `500 Internal Server Error`
An unexpected error occurred on the server side, preventing it from fulfilling the request. This is a general error message when the server encounters an issue.

### -2: **Not Found** - `404 Not Found`
The requested resource could not be found on the server. This could be due to a typo in the URL or the resource no longer existing.

### -3: **Duplicated Record** - `409 Conflict`
This occurs when an attempt is made to create or update a resource that would cause a conflict due to a duplicate record (e.g., duplicate email, phone number, etc.).

### -4: **Forbidden (Authorization)** - `403 Forbidden`
The server understood the request, but the client does not have permission to access the resource. This usually happens when the user does not have sufficient privileges.
