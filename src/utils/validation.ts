import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate =
	(schema: AnyZodObject) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params
			});
			next();
		} catch (err: unknown) {
			if (err instanceof ZodError) {
				return res.status(400).json({
					error: {
						issues: err.issues.map(issue => ({
							path: issue.path,
							message: issue.message
						}))
					}
				});
			}

			return res.status(400).json({
				error: "hubo un error"
			});
		}
	};
