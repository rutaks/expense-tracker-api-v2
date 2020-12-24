/* istanbul ignore next */
import 'dotenv/config';
import AdminSeeder from './admin-seeders';
import ConsumerSeeder from './consumer-seeders';

/**
 * Class representing the seeder process. Will prefill database with dummy records
 * @version 1.0
 * @author Rutakayile Samuel
 */
class MainSeeder {
  static async runSeeders(): Promise<void> {
    try {
      await AdminSeeder.seedAdmin();
      await ConsumerSeeder.seedConsumer();
    } catch (error) {
      console.log(error);
    }
  }
}

export default MainSeeder;
