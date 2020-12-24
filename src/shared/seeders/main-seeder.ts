/* istanbul ignore next */
import 'dotenv/config';
import AdminSeeder from './admin-seeders';

/**
 * Class representing the seeder process. Will prefill database with dummy records
 * @version 1.0
 * @author Rutakayile Samuel
 */
class MainSeeder {
  static async runSeeders(): Promise<void> {
    try {
      AdminSeeder.seedAdmin();
    } catch (error) {
      console.log(error);
    }
  }
}

export default MainSeeder;
