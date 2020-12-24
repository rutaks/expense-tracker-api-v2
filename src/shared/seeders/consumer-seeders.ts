import { Admin } from 'src/admins/entities/admin.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Gender } from 'src/users/enums/gender.enum';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Consumer } from 'src/consumer/entities/consumer.entity';

/**
 * Class representing the seeder process. Will prefill database with dummy records
 * @version 1.0
 * @author Rutakayile Samuel
 */
class ConsumerSeeder {
  static async seedConsumer(): Promise<void> {
    const consumerRepo = getRepository(Consumer);
    const authRepo = getRepository(Auth);
    let consumer = new Consumer();
    consumer = {
      ...consumer,
      firstName: 'Consumer',
      lastName: 'One',
      email: 'consumer.one@gmail.com',
      gender: Gender.MALE,
    };

    consumer = await consumerRepo.save(consumer);
    let auth1 = new Auth();
    auth1 = {
      ...auth1,
      email: consumer.email,
      password: await bcrypt.hash('Password123!', 10),
      user: consumer,
    };

    await authRepo.save(auth1);
  }
}

export default ConsumerSeeder;
