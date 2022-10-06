import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator'

export const signupValidationRules = () => {
  return [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Invalid email').notEmpty().isEmail().normalizeEmail(),
    body('auth_type', 'Auth type is required').notEmpty(),
    body('password', 'Password is required (min 5 characters)')
    .if(body('auth_type').equals('email'))
    .notEmpty()
    .isLength({ min: 3 }),
  ];
}

export const signinValidationRules = () => {
  return [
    body('name', 'Name is required')
      .notEmpty()
      .if(body('auth_type').not().equals('email')),
    body('email', 'Invalid email').notEmpty().isEmail().normalizeEmail(),
    body('auth_type', 'Auth type is required').notEmpty(),
    body('password', 'Password is required (min 5 characters)')
      .if(body('auth_type').equals('email'))
      .notEmpty()
      .isLength({ min: 3 }),
  ];
}

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractErrors: any = [];
  errors.array({ onlyFirstError: true })
  .map((err) => extractErrors.push({[err.param] : err.msg}));

  return res.status(422).json({ errors: extractErrors });
};
