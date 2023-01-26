export type ApiError = {
	status: number;
	message: string;
	code: string;
};

export const getInternalError = (message: string) => {
	const error: ApiError = {
		code: "Internal Server Error",
		message,
		status: 500
	};
	return error;
};

export const getNotFoundError = (message: string) => {
	const error: ApiError = {
		code: "Not Found",
		message,
		status: 404
	};
	return error;
};

export const getBadRequestError = (message: string) => {
	const error: ApiError = {
		code: "Bad Request",
		message,
		status: 400
	};

	return error;
};
