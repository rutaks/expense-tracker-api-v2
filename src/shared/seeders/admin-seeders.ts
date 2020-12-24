import { Admin } from 'src/admins/entities/admin.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Gender } from 'src/users/enums/gender.enum';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';

/**
 * Class representing the seeder process. Will prefill database with dummy records
 * @version 1.0
 * @author Rutakayile Samuel
 */
class AdminSeeder {
  static async seedAdmin(): Promise<void> {
    const agentRepo = getRepository(Admin);
    const authRepo = getRepository(Auth);
    let admin = new Admin();
    admin = {
      ...admin,
      firstName: 'Admin',
      lastName: 'One',
      email: 'rootsum.dev@gmail.com',
      gender: Gender.MALE,
    };

    admin = await agentRepo.save(admin);
    let auth1 = new Auth();
    auth1 = {
      ...auth1,
      email: admin.email,
      password: await bcrypt.hash('Password123!', 10),
      user: admin,
    };

    await authRepo.save(auth1);
  }
}

export default AdminSeeder;
