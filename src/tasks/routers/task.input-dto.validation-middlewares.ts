
import {body} from "express-validator";

const EMAIL_PATTERN =
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const EMAIL_PATTERN_V2 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


export const tgIdValidation = body("telegram_id")
  .exists()
  .withMessage('ID is required') // Проверка на наличие
  .isString()
  .withMessage('ID must be a string') // Проверка, что это строка

export const taskIdValidation = body("task_id")
  .exists()
  .withMessage('ID is required') // Проверка на наличие
  .isString()
  .withMessage('ID must be a string') // Проверка, что это строка

export const statusValidation = body("stat")
  .exists()
  .withMessage('Status is required')
  .isNumeric()
  .withMessage("Status should be number")

export const codeValidation = body("code")
  .isString()
  .withMessage("Code should be string")
  .trim()
  .notEmpty()
  .withMessage("Code is required")
// .matches(EMAIL_PATTERN)
// .withMessage("Invalid email format")
// .isLength({max: 100})
// .withMessage("Email is too long");

export const userCreateInputValidation = [
  // resourceTypeValidation(ResourceType.Posts),
  // loginValidation,
  // passwordValidation,
  // emailValidation
];

export const userUpdateTaskValidation = [
  tgIdValidation,
  taskIdValidation,
  statusValidation
];
