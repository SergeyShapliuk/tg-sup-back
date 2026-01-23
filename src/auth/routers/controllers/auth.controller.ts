// import { inject, injectable } from 'inversify';
// import { RequestWithUserId } from '../../../core/types/requests';
// import { IdType } from '../../../core/types/id';
// import { Request, Response } from 'express';
// import { HttpStatus } from '../../../core/types/http-ststuses';
// import { errorsHandler } from '../../../core/errors/errors.handler';
// import { AuthAttributes } from '../../application/dtos/auth-attributes';
// import { TimerAttributes } from '../../../users/application/dtos/user-attributes';
// import { randomUUID } from 'crypto';
// import { nodemailerService } from '../../../core/adapters/nodemailer.service';
// import { emailExamples } from '../../../core/adapters/emailExamples';
// import { addToBlacklist, isTokenBlacklisted } from '../guard/refreshTokenBlacklistService';
// import { jwtService } from '../../../core/adapters/jwt.service';
// import { sessionsRepository } from '../../../securityDevices/repositories/sessions.repository';
// import { TimersRepository } from '../../../users/repositories/users.repository';
// import { AuthService } from '../../application/auth.service';
//
// @injectable()
// export class AuthController {
//   constructor(
//     @inject(AuthService) private authService: AuthService,
//     @inject(TimersRepository) private usersRepository: TimersRepository,
//   ) {
//   }
//
//
//   async getUserHandler(
//     req: RequestWithUserId<IdType>,
//     res: Response,
//   ) {
//     try {
//       const userId = req.user?.id as string;
//       const refreshToken = req.cookies.refreshToken;
//
//       if (!userId) return res.sendStatus(HttpStatus.Unauthorized);
//
//       const me = await this.usersRepository.findById(userId);
//
//       const response = {
//         login: me?.name,
//         email: me?.name,
//         userId: me?._id.toString(),
//       };
//       return res.status(HttpStatus.Ok).send(response);
//     } catch (e) {
//       errorsHandler(e, res);
//     }
//   }
//
//   async loginUserHandler(
//     req: Request<{}, {}, AuthAttributes>,
//     res: Response,
//   ) {
//     try {
//       const { loginOrEmail, password } = req.body;
//       const result = await this.authService.loginUser({ loginOrEmail, password }, req);
//
//       if (!result || !result?.accessToken || !result?.refreshToken) return res.sendStatus(HttpStatus.Unauthorized);
//       console.log({ result });
//
//       const { accessToken, refreshToken } = result;
//
//       res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
//       res.status(HttpStatus.Ok).send({ accessToken });
//     } catch (e) {
//       errorsHandler(e, res);
//     }
//   }
//
//
//   async registrationUserHandler(
//     req: Request<{}, {}, any>,
//     res: Response,
//   ) {
//     try {
//       const { login, password, email } = req.body;
//       const result = await this.authService.registerUser('login', 'password', 'email');
//       console.log({ result });
//       if (!result.user) {
//         return res.status(HttpStatus.BadRequest).json({
//           errorsMessages: [
//             {
//               message: `User with this ${result.duplicateField} already exists`,
//               field: result.duplicateField!,
//             },
//           ],
//         });
//       }
//
//       return res.sendStatus(HttpStatus.NoContent);
//
//     } catch (e) {
//       errorsHandler(e, res);
//     }
//   }
//
//   async createRefreshTokensHandler(
//     req: RequestWithUserId<IdType>,
//     res: Response,
//   ) {
//     try {
//       const userId = req.user?.id as string;
//       const refreshToken = req.cookies.refreshToken;
//       console.log('createRefreshTokensHandler', userId, refreshToken);
//       if (!userId) return res.sendStatus(HttpStatus.Unauthorized);
//
//       const result = await this.authService.refreshTokens(userId, refreshToken);
//
//       // if (!result?.accessToken || !result?.refreshToken) return res.sendStatus(HttpStatus.Unauthorized);
//       // console.log({result});
//       // const {accessToken, refreshToken} = result;
//
//       res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
//       // res.status(HttpStatus.Ok).send(accessToken);
//     } catch (e) {
//       errorsHandler(e, res);
//     }
//   }
//
//   async recoveryPasswordUserHandler(
//     req: Request<{}, {}, { email: string }>,
//     res: Response,
//   ) {
//     try {
//       const { email } = req.body;
//       await this.authService.recoveryPasswordUser(email);
//
//       return res.sendStatus(HttpStatus.NoContent);
//
//     } catch (e) {
//       errorsHandler(e, res);
//     }
//   }
//
//   async resendCodeHandler(
//     req: Request<{}, {}, { email: string }>,
//     res: Response,
//   ) {
//     try {
//       const { email } = req.body;
//       const existingUser = await this.usersRepository.findByLoginOrEmail(email);
//       // ✅ Если пользователь не найден
//       if (!existingUser) {
//         return res.status(HttpStatus.BadRequest).json({
//           errorsMessages: [
//             {
//               message: 'TimerModel with this email not found',
//               field: 'email',
//             },
//           ],
//         });
//       }
//
//       // ✅ Если email уже подтвержден
//       // if (existingUser?.emailConfirmation && existingUser.emailConfirmation.isConfirmed) {
//       //   return res.status(HttpStatus.BadRequest).json({
//       //     errorsMessages: [
//       //       {
//       //         message: 'Email already confirmed',
//       //         field: 'email',
//       //       },
//       //     ],
//       //   });
//       // }
//       // ✅ Генерируем новый код подтверждения
//       const newConfirmationCode = randomUUID();
//       const newExpirationDate = new Date(Date.now() + 5 * 60 * 1000).toISOString();
//       // ✅ Обновляем код в базе данных
//       const updated = await this.usersRepository.updateConfirmationCode(
//         existingUser._id,
//         newConfirmationCode,
//         newExpirationDate,
//       );
//       if (!updated) {
//         return res.status(HttpStatus.InternalServerError).json({
//           errorsMessages: [
//             {
//               message: 'Failed to update confirmation code',
//               field: 'email',
//             },
//           ],
//         });
//       }
//       nodemailerService
//         .sendEmail(
//           email,
//           newConfirmationCode,
//           emailExamples.registrationEmail,
//         )
//         .catch(er => console.error('error in send email:', er));
//
//       res.status(HttpStatus.NoContent).send('Resend code');
//     } catch (e) {
//       errorsHandler(e, res);
//     }
//   }
//
//   async confirmPasswordHandler(
//     req: Request<{}, {}, { newPassword: string, recoveryCode: string }>,
//     res: Response,
//   ) {
//     try {
//       const { newPassword, recoveryCode } = req.body;
//       // const refreshToken = req.cookies.refreshToken;
//       const refreshToken = undefined;
//       console.log({ refreshToken });
//       console.log({ newPassword });
//       console.log({ recoveryCode });
//       const result = await this.authService.confirmNewPasswordUser(newPassword, recoveryCode);
//
//       if (!result) {
//         return res.status(HttpStatus.BadRequest).json({
//           errorsMessages: [
//             {
//               message: 'Recovery code is required',
//               field: 'recoveryCode',
//             },
//           ],
//         });
//       }
//       // const user = await usersRepository.findByConfirmationCode(recoveryCode);
//       // console.log("confirmCodeHandlerUser", user);
//       // if (!user) {
//       //     return res.status(HttpStatus.BadRequest).json({
//       //         errorsMessages: [
//       //             {
//       //                 message: "Invalid confirmation code",
//       //                 field: "code"
//       //             }
//       //         ]
//       //     });
//       // }
//       // if (user?.emailConfirmation && new Date(user.emailConfirmation.expirationDate) < new Date()) {
//       //     return res.status(HttpStatus.BadRequest).json({
//       //         errorsMessages: [
//       //             {
//       //                 message: "Confirmation code expired",
//       //                 field: "code"
//       //             }
//       //         ]
//       //     });
//       // }
//       // if (user?.emailConfirmation && user.emailConfirmation.isConfirmed) {
//       //     return res.status(HttpStatus.BadRequest).json({
//       //         errorsMessages: [
//       //             {
//       //                 message: "Email already confirmed",
//       //                 field: "code"
//       //             }
//       //         ]
//       //     });
//       // }
//       // if (!user._id) {
//       //     console.error("TimerModel found but no _id:", user);
//       //     return res.status(HttpStatus.InternalServerError).json({
//       //         errorsMessages: [
//       //             {
//       //                 message: "Internal server error",
//       //                 field: "code"
//       //             }
//       //         ]
//       //     });
//       // }
//       // const response = await usersRepository.confirmEmail(user._id);
//       // console.log("confirmEmail", response);
//       res.status(HttpStatus.NoContent).send('Verify');
//     } catch (e) {
//       errorsHandler(e, res);
//     }
//   }
//
//   async confirmCodeHandler(
//     req: Request<{}, {}, { code: string }>,
//     res: Response,
//   ) {
//     try {
//       const { code } = req.body;
//       const user = await this.usersRepository.findByConfirmationCode(code);
//       console.log('confirmCodeHandlerUser', user);
//       if (!user) {
//         return res.status(HttpStatus.BadRequest).json({
//           errorsMessages: [
//             {
//               message: 'Invalid confirmation code',
//               field: 'code',
//             },
//           ],
//         });
//       }
//       // if (user?.emailConfirmation && new Date(user.emailConfirmation.expirationDate) < new Date()) {
//       //   return res.status(HttpStatus.BadRequest).json({
//       //     errorsMessages: [
//       //       {
//       //         message: 'Confirmation code expired',
//       //         field: 'code',
//       //       },
//       //     ],
//       //   });
//       // }
//       // if (user?.emailConfirmation && user.emailConfirmation.isConfirmed) {
//       //   return res.status(HttpStatus.BadRequest).json({
//       //     errorsMessages: [
//       //       {
//       //         message: 'Email already confirmed',
//       //         field: 'code',
//       //       },
//       //     ],
//       //   });
//       // }
//       if (!user) {
//         console.error('TimerModel found but no _id:', user);
//         return res.status(HttpStatus.InternalServerError).json({
//           errorsMessages: [
//             {
//               message: 'Internal server error',
//               field: 'code',
//             },
//           ],
//         });
//       }
//       // const response = await this.usersRepository.confirmEmail(user?._id || '');
//       const response = null
//       console.log('confirmEmail', response);
//       res.status(HttpStatus.NoContent).send('Verify');
//     } catch (e) {
//       errorsHandler(e, res);
//     }
//   }
//
//   async invalidRefreshTokensHandler(
//     req: RequestWithUserId<IdType>,
//     res: Response,
//   ) {
//     try {
//       const userId = req.user?.id as string;
//       const refreshToken = req.cookies.refreshToken;
//       console.log('invalidRefreshTokensHandler', userId, refreshToken);
//
//       if (!userId) return res.sendStatus(HttpStatus.Unauthorized);
//       const isBlackListed = await isTokenBlacklisted(refreshToken);
//       console.log('isBlackListed', isBlackListed);
//       if (isBlackListed) return res.sendStatus(HttpStatus.Unauthorized);
//       // 2. Декодируем токен и проверяем устройство в БД
//       const payload = await jwtService.decodeToken(refreshToken);
//       if (!payload?.deviceId) {
//         return res.sendStatus(HttpStatus.Unauthorized);
//       }
//
//       // 3. ✅ ВАЖНО: Проверяем существование устройства в БД
//       const device = await sessionsRepository.findByDeviceId(payload.deviceId);
//       if (!device || device.userId !== userId) {
//         return res.sendStatus(HttpStatus.Unauthorized); // 401 если устройство удалено
//       }
//
//       await sessionsRepository.deleteByDeviceId(payload.deviceId);
//       console.log(`Device ${payload.deviceId} deleted during logout`);
//
//
//       await addToBlacklist(refreshToken, userId);
//       // if (!result?.accessToken || !result?.refreshToken) return res.sendStatus(HttpStatus.Unauthorized);
//       // console.log({result});
//       // const {accessToken, refreshToken} = result;
//       res.clearCookie('refreshToken');
//       res.sendStatus(HttpStatus.NoContent);
//     } catch (e) {
//       errorsHandler(e, res);
//     }
//   }
//
//   async updateRefreshTokensHandler(
//     req: RequestWithUserId<IdType>,
//     res: Response,
//   ) {
//     try {
//       const userId = req.user?.id as string;
//       const deviceId = req.device?.id as string;
//       const oldRefreshToken = req.cookies.refreshToken;
//
//       console.log('updateRefreshTokensHandler', userId, deviceId);
//       if (!userId) return res.sendStatus(HttpStatus.Unauthorized);
//
//       const isBlackListed = await isTokenBlacklisted(oldRefreshToken);
//
//       if (isBlackListed) return res.sendStatus(HttpStatus.Unauthorized);
//
//       const tokens = await this.authService.refreshTokens(userId, oldRefreshToken);
//
//       if (!tokens) return res.sendStatus(HttpStatus.Unauthorized);
//
//       const { accessToken, refreshToken } = tokens;
//
//       console.log('updateRefreshTokensHandler', refreshToken);
//       res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
//       res.status(HttpStatus.Ok).send({ accessToken });
//     } catch (e) {
//       errorsHandler(e, res);
//     }
//   }
//
// }
