export const validate = (schema, source="body") => {

    return async (req, res, next) => {
        try {
            const validatedData = await schema.parseAsync(req[source]);
            req[source] = validatedData;
            
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }
    }
}