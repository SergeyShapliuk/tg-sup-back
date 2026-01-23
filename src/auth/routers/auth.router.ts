// import {Router} from "express";
// import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
// import {authInputValidation} from "./auth.input-dto.validation-middlewares";
// import {accessTokenGuard} from "./guard/access.token.guard";
// import {
//     codeValidation,
// } from "../../users/routers/user.input-dto.validation-middlewares";
// import {body} from "express-validator";
// import {refreshTokenGuard} from "./guard/reftesh.token.guard";
// import {createRateLimit} from "../../core/middlewares/createRateLimit";
// import {container} from "../../composition-root";
// import {AuthController} from "./controllers/auth.controller";
//
// const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// const RECOVERY_EMAIL_PATTERN = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
//
// export const loginValidation = body("login")
//     .isString()
//     .withMessage("Login should be string")
//     .trim()
//     .notEmpty()
//     .withMessage("Login is required")
//     .isLength({min: 3, max: 10})
//     .withMessage("Login must be between 3 and 10 characters")
//     .matches(/^[a-zA-Z0-9_-]*$/)
//     .withMessage("Login can only contain letters, numbers, underscores and hyphens");
//
// export const passwordValidation = body("password")
//     .isString()
//     .withMessage("Password should be string")
//     .trim()
//     .notEmpty()
//     .withMessage("Password is required")
//     .isLength({min: 6, max: 20})
//     .withMessage("Password must be between 6 and 20 characters");
//
// export const emailValidation = body("email")
//     .isString()
//     .withMessage("Email should be string")
//     .trim()
//     .notEmpty()
//     .withMessage("Email is required")
//     .matches(EMAIL_PATTERN)
//     .withMessage("Invalid email format")
//     .isLength({max: 100})
//     .withMessage("Email is too long");
//
// export const recoveryEmailValidation = body("email")
//     .isString()
//     .withMessage("Email should be string")
//     .trim()
//     .notEmpty()
//     .withMessage("Email is required")
//     .matches(EMAIL_PATTERN)
//     .withMessage("Invalid email format")
//     .isLength({max: 100})
//     .withMessage("Email is too long");
//
// export const newPasswordValidation = body("newPassword")
//     .isString()
//     .withMessage("Password should be string")
//     .trim()
//     .notEmpty()
//     .withMessage("Password is required")
//     .isLength({min: 6, max: 20})
//     .withMessage("Password must be between 6 and 20 characters");
//
// export const recoveryCodeValidation = body("recoveryCode")
//     .isString()
//     .withMessage("Code should be string")
//     .trim()
//     .notEmpty()
//     .withMessage("Code is required");
// // .matches(EMAIL_PATTERN)
// // .withMessage("Invalid email format")
// // .isLength({max: 100})
// // .withMessage("Email is too long");
//
// export const authRouter = Router({});
//
// const authController = container.get<AuthController>(AuthController);
// // authRouter.use(superAdminGuardMiddleware);
//
// authRouter
//
//     .post(
//         "/login",
//         createRateLimit(),
//         ...authInputValidation,
//         inputValidationResultMiddleware,
//         authController.loginUserHandler.bind(authController)
//     )
//
//     .get(
//         "/me",
//         accessTokenGuard,
//         inputValidationResultMiddleware,
//         authController.getUserHandler.bind(authController)
//     )
//
//     .post(
//         "/registration",
//         createRateLimit(),
//         ...[loginValidation, passwordValidation, emailValidation],
//         inputValidationResultMiddleware,
//         authController.registrationUserHandler.bind(authController)
//     )
//
//     .post(
//         "/registration-confirmation",
//         createRateLimit(),
//         codeValidation,
//         inputValidationResultMiddleware,
//         authController.confirmCodeHandler.bind(authController)
//     )
//
//     .post(
//         "/registration-email-resending",
//         createRateLimit(),
//         emailValidation,
//         inputValidationResultMiddleware,
//         authController.resendCodeHandler.bind(authController)
//     )
//
//     .post(
//         "/password-recovery",
//         createRateLimit(),
//         recoveryEmailValidation,
//         inputValidationResultMiddleware,
//         authController.recoveryPasswordUserHandler.bind(authController)
//     )
//
//     .post(
//         "/new-password",
//         createRateLimit(),
//         ...[newPasswordValidation, recoveryCodeValidation],
//         inputValidationResultMiddleware,
//         authController.confirmPasswordHandler.bind(authController)
//     )
//
//     .post(
//         "/refresh-token",
//         refreshTokenGuard,
//         inputValidationResultMiddleware,
//         authController.updateRefreshTokensHandler.bind(authController)
//     )
//
//     .post(
//         "/logout",
//         refreshTokenGuard,
//         inputValidationResultMiddleware,
//         authController.invalidRefreshTokensHandler.bind(authController)
//     );
//
//
