import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { User, UserDocument, UserModel } from '../domain/user.model';
import { userCollection } from '../../db/db';
import { injectable } from 'inversify';
import { SETTINGS } from '../../core/settings/settings';


@injectable()
export class UsersRepository {

  async findById(id: string): Promise<WithId<User> | null> {
    console.log('id', id);
    return userCollection.findOne({ _id: new ObjectId(id) });
  }

  async findByIdOrFail(id: string): Promise<WithId<User>> {
    const res = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError('TimerModel not exist');
    }
    return res;
  }

  async findByTgId(tgId: string): Promise<WithId<User> | null> {
    const res = await userCollection.findOne({ tg_id: tgId });

    // if (!res) {
    //     throw new RepositoryNotFoundError("TimerModel not exist");
    // }
    console.log('findByTgId', res);
    return res;
  }

  async create(newUser: UserDocument): Promise<string> {
    const insertResult = await newUser.save();
    return insertResult._id.toString();
  }

  async createIfNotExists(data: {
    tg_id: string;
    tg_firstname: string;
    tg_lastname: string;
    tg_nick: string;
    tg_language: string;
  }): Promise<{ created: boolean }> {
    const now = new Date().toISOString();

    const result = await UserModel.updateOne(
      { tg_id: data.tg_id },
      {
        $setOnInsert: {
          ...data,
          created_at: now,
          updated_at: now,

          timer_active: false,
          time_start: 0,
          time_end: 0,
          amount: 0,
        },
      },
      { upsert: true },
    );

    return { created: result.upsertedCount === 1 };
  }

  async createTimer(data: {
    time_start: number,
    time_end: number,
    tg_id: string
  }): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000);

    const result = await UserModel.updateOne(
      {
        tg_id: data.tg_id,
        $or: [
          { timer_active: false },
          { time_end: { $lte: now } },
        ],
      },
      {
        $set: {
          timer_active: true,
          time_start: data.time_start,
          time_end: data.time_end,
        },
      },
    );

    // если 0 — таймер уже активен
    return result.matchedCount > 0;
  }

  async finishTimerAndAddAmount(tg_id: string): Promise<boolean> {

    const now = Math.floor(Date.now() / 1000);
console.log('finishTimerAndAddAmount',tg_id)
    const result = await UserModel.updateOne(
      {
        tg_id: tg_id,
        timer_active: true,
        time_end: { $lte: now }, // таймер реально истёк
      },
      {
        $inc: {
          amount: SETTINGS.AMOUNT, // 👈 начисляем
        },
        $set: {
          timer_active: false,
          time_start: 0,
          time_end: 0,
        },
      },
    );

    // если 0 — либо таймер ещё не истёк, либо уже обработан
    return result.matchedCount > 0;
  }


  async delete(id: string): Promise<void> {
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('TimerModel not exist');
    }
    return;
  }

  async findByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<User> | null> {
    return userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  }

  async doesExistByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<{ exists: boolean, field?: 'login' | 'email' }> {
    // Сначала проверяем логин
    const existingByLogin = await userCollection.findOne({ login });
    if (existingByLogin) {
      return { exists: true, field: 'login' };
    }

    // Затем проверяем email
    const existingByEmail = await userCollection.findOne({ email });
    if (existingByEmail) {
      return { exists: true, field: 'email' };
    }

    return { exists: false };
  }

  async doesExistByEmail(
    email: string,
  ): Promise<{ exists: boolean, field?: 'login' | 'email' }> {

    // Затем проверяем email
    const existingByEmail = await userCollection.findOne({ email });
    if (existingByEmail) {
      return { exists: true, field: 'email' };
    }

    return { exists: false };
  }

  async findByConfirmationCode(code: string): Promise<User | null> {
    return await userCollection.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  // В usersRepository
  async confirmEmail(userId: ObjectId): Promise<boolean> {
    const result = await userCollection.updateOne(
      { _id: userId },
      {
        $set: {
          'emailConfirmation.isConfirmed': true,
        },
      },
    );

    return result.modifiedCount === 1;
  }

  async updateConfirmationCode(
    userId: ObjectId,
    newCode: string,
    newExpirationDate: string,
  ): Promise<boolean> {
    try {
      const result = await userCollection.updateOne(
        { _id: userId },
        {
          $set: {
            'emailConfirmation.confirmationCode': newCode,
            'emailConfirmation.expirationDate': newExpirationDate,
          },
        },
      );

      console.log('Update confirmation code result:', result.modifiedCount);
      return result.modifiedCount === 1;
    } catch (error) {
      console.error('Update confirmation code error:', error);
      return false;
    }
  }

  async updateUserPassword(
    userId: ObjectId,
    newPassword: string,
  ): Promise<boolean> {
    try {

      const result = await userCollection.updateOne(
        { _id: userId },
        {
          $set: {
            passwordHash: newPassword,
          },
        },
      );

      console.log('Update password result:', result.modifiedCount);
      return result.modifiedCount === 1;
    } catch (error) {
      console.error('Update password error:', error);
      return false;
    }
  }
}
